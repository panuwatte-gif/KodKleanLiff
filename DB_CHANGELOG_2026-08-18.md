# แก้ App_money + ฐานข้อมูล — 18 ส.ค. 2026

Supabase project `qxhvmrxbrrweundfspzp` ("Stock Tracker")
ตารางระบบเก่าไม่ถูกแตะเลย: `ingredients_master` (347 แถว), `stock_items`, `stock_log`, `KodKlean_stock_movements`

---

## 1. บิลซื้อรู้จักวัตถุดิบแล้ว

**1.1 `fin_po_items`** เพิ่ม 3 คอลัมน์ nullable + index: `vendor_item_id` → fin_vendor_items(id) · `ingredient_id` → ingredient_master(id) · `lot_id` → ingredient_lot(id)
คอลัมน์ `item_id` เดิม (ชี้ fin_items) ไม่แตะ

**1.2 ฝั่งแอป + RPC**
- แอป (`KodKlean_LIFF.dc.html` 3 จุดที่ส่งตะกร้า) แนบ `vendor_item_id: l.it.id` ไปในทุกบรรทัด
- `fin_liff_purchase_save` lookup ร้าน+id → เขียน `vendor_item_id` และ `ingredient_id` (จาก `fin_vendor_items.ingredient_id`) ลง fin_po_items
- บรรทัดที่ไม่มี id (AI อ่านบิลแล้วยังไม่แมป / ของใหม่) = null ทั้งคู่ ไม่เดา
- ทดสอบจริงแล้ว: บรรทัด "แซลมอน" ได้ vendor_item_id + ingredient_id 118 · บรรทัดไม่แมป = null

**1.3 View `v_purchase_in`** — ยอดซื้อรายวัตถุดิบต่อวัน เฉพาะบรรทัดที่มี ingredient_id
ปันส่วน `shipping_cost + packaging_cost` เข้าแต่ละบรรทัดตามสัดส่วนมูลค่าบรรทัด
คอลัมน์: purchase_date, ingredient_id/name/category, entity_id, vendor_id/name, qty, kg, amount, shipping_alloc, amount_total, cost_per_kg
ไม่นับบิล DRAFT / VOID / CANCELLED

## 2. ลบตารางสต๊อกซ้ำซ้อน (0 แถวทุกตัว)

ลบแล้ว: `fin_stock_counts` · `fin_stock_daily_logs` · `fin_inventory_lots` · `fin_receive_events` · `fin_receive_event_items`
`fin_receive_event*` ไม่มี path ไหนเขียนเข้าเลย — มีแต่ `fin_liff_cancel` ที่ลบตอนยกเลิก จึงถอด 2 บรรทัดนั้นออกจาก function ก่อนลบตาราง
ระบบสต๊อกเหลือ `ingredient_lot` ที่เดียว

## 3. แตกกุ้ง id 18 ออกเป็นกลุ่มใช้งานจริง

| แถวใหม่ | id | lots | vendor_items | display_name ที่รวมเข้า |
|---|---|---|---|---|
| กุ้งเล็ก | 128 | 7 | 0 | กุ้งเล็ก |
| กุ้งเด้ง | 129 | 1 | 0 | กุ้งเด้ง BK |
| กุ้งกลาง | 130 | 8 | 1 | กุ้งกลาง |
| กุ้งใหญ่ | 131 | 9 | 0 | กุ้งใหญ่, กุ้งใหญ่ (BB), กุ้งใหญ่ (แก้ว BB) |
| เนื้อคางกุ้ง | 132 | 1 | 0 | เนื้อคางกุ้ง |
| กุ้งผ่า | 133 | 1 | 0 | กุ้งผ่า (ถุงใส) |

- copy โภชนาการจาก id 18 ครบทุกช่อง · lot ย้ายครบ 27/27
- vendor_items: PP Food "เนื้อกุ้ง" 41/50 NW80% → กุ้งกลาง
- id 18 ไม่ลบ ตั้ง `active=false` ล้างราคา+หมายเหตุที่ขัดกัน (235 vs 270)
- **ไม่ใส่ stock_name ใน fin_vendor_items** — ชื่อกลุ่มที่พนักงานเห็นมาจาก ingredient_master โดยตรง
- กุ้งดิบ id 19 แตกเป็น 2 แถวตามที่เจ้าของเคาะ: **กุ้งขาวดิบ (id 134)** ← lot 27 กุ้งขาวแกะดิบ M · **กุ้งกุลาดิบ (id 135)** ← lot 26 กุ้งกุลาดิบ 31/40 · id 19 ปิดใช้ (active=false) ไม่ลบ

## 4. ล้างราคาที่ AI เดา + ล็อกทางเขียนราคา

- 37 แถวที่มีราคาแต่ไม่มี vendor_items/lot ชี้เข้า → `price_per_kg = null`, `price_per_100g = null`, ล้างหมายเหตุที่พูดถึงราคา · เหลือ 0 แถว
- ถอด path เขียนราคาออก: `fin_liff_catalog_admin` op `item_save` เคยเขียน `ingredient_master.price_per_kg / price_per_100g / supplier / has_vat` ทุกครั้งที่แก้แคตตาล็อก → **ถอดออกแล้ว** (เหลือแค่ auto-link ingredient_id และคำนวณ `fin_vendor_items.price_per_kg`)
- ทางเขียน `ingredient_master.price_per_kg` ที่เหลือทางเดียว: `fin_liff_purchase_save` ตอนยืนยันซื้อจริง (draft ไม่เขียน) = ราคาซื้อล่าสุด (unit_price ÷ pack_qty)

## 5. รวมแถวซ้ำ

**อกไก่ — ทำแล้ว** (ย้าย FK ก่อน แล้วลบ)
- 115 "อกไก่ BB" + 116 "อกลอก" → id 8 "อกไก่ (ไม่มีหนัง)"
- 127 "Sbbk" → id 9 "อกไก่ (ติดหนัง)"
- ลบ 115/116/127 · ชื่อการค้า (อกไก่ BB / อกลอก / Sbbk) ยังอยู่ที่ `fin_vendor_items.name`

**แซลมอน — ทำแล้ว** (เจ้าของเคาะ: บราวน์ = ดำ · นอกนั้น = สวย · "สวย" คือไม่มีสีดำ ไม่เกี่ยวกับเกรด)
- id 21 → **แซลมอนดำ** ← Nu Tai Toto "บราวน์" (spec: แช่แข็ง · บราวน์ติดหนัง)
- id 20 → **แซลมอนสวย** ← ฟ้าซีฟู้ด/PP Food "แซลมอน" (เทราต์แล่) · Nu Tai Toto "แซลมอนปาด" · "เศษเนื้อปลาแซลมอน"
- ลบ 118, 119, 120 (ย้าย FK เข้า id 20 ก่อน) · เหลือ 2 แถวตามที่สั่ง · ความต่างรายร้าน/เกรดอยู่ที่ fin_vendor_items.name/spec

## 6. ธงออกบิล

`is_billable = false`: หลอยไก่สด · PP Food · ฟ้าซีฟู้ด · Shopee · Supplier แซลมอน (Nu Tai Toto) · Supplier เนื้อ บังดำ
`is_billable = true`: Lotus's · BigC · GO Wholesale · Makro · Freshket · ไฟต์ฟู้ดฮาลาลอินเตอร์เนชั่นแนล
"Supplier เนื้อ (FB)" → UPDATE เป็น name "ไฟต์ฟู้ดฮาลาลอินเตอร์เนชั่นแนล", tax_id 0135568020000, is_billable true (mockup_id `meatfb` + logo เดิมคงไว้ แอปไม่หลุดแมป) — ไม่เพิ่มร้านใหม่

เคส Shopee: `fin_purchase_orders.billable_override` (nullable boolean) — null = ตามธงร้าน · true/false = ทับรายบิล
RPC รับค่านี้จาก payload แล้ว + view `v_po_billable` ให้ธงที่ใช้จริง (`coalesce(billable_override, vendor.is_billable, false)`)

**ตั้งอัตโนมัติ ไม่มีปุ่มให้กด — "อัปคือมี ไม่อัปคือไม่มี"** (อยู่ในขั้นคัดกรองเท่านั้น ไม่โผล่หน้าอื่น)
- `fin_liff_catalog` ส่ง `is_billable` ให้แอปแล้ว
- ร้านธง **false**: แนบเอกสารจากร้าน (ช่อง บิล/ใบกำกับ → part `vendor_doc`) → ระบบตั้ง `billable_override = true` + สลับเส้นทางเป็นกฎ "ใช้เอกสารจากร้านได้เลย ไม่สร้างเอกสารเพิ่ม" (ไม่แยก VAT — ร้านธง false ออกใบกำกับเต็มรูปไม่ได้) แล้วขึ้นแถบบอกที่ขั้นคัดกรอง
- ลบไฟล์ที่แนบออก → คืนค่าเดิม เดินเส้นสร้างชุดภายในตามปกติ, override กลับเป็น null
- กดการ์ดเส้นทางเองเมื่อไหร่ = ทับค่าที่ระบบตั้ง (กรณีระบบอ่านประเภทเอกสารผิด เช่นเป็นใบกำกับจริง ให้กดการ์ด "มีใบกำกับภาษี")
- ร้านธง **true**: ไม่มีอะไรเพิ่ม

## 7. `ingredients_master` (มี s) — รายงาน ยังไม่แตะ

ใครใช้:
- FK เข้า: `ingredient_mapping.ingredient_id` (7 แถว · ทั้ง 7 เป็น alias ของ prep_items เช่น เนื้อบด/อกไก่นุ่ม/แซลมอน → `ing_prep_pr01` ฯลฯ) และ `recipe_ingredients.ingredient_id`
- FK ออก: → `ingredient_categories`, → `stock_items`
- trigger `trg_ingredients_updated_at`
- **ไม่มี** function / view / edge function / โค้ดแอป KodKlean_Money อ่านหรือเขียนเลย

รอคำสั่ง ไม่แก้ ไม่ย้ายเอง

---

## หลักการที่ยึด (ตรวจแล้วตรง)

ร้าน/ราคา/VAT/NW อยู่ที่ `fin_vendor_items` (vendor + ingredient + ราคา ในบรรทัดเดียว)
`ingredient_master` = ตัวตน + โภชนาการ เท่านั้น (ยกเว้น cache ราคาซื้อล่าสุดตามข้อ 4) — คอลัมน์ `supplier` ล้างออกจากแถวที่แก้แล้ว และไม่มี path ไหนเขียนเข้าอีก
`ingredient_lot` = ชั้น SKU/ล็อต (display_name = ชื่อที่พนักงานเรียก, pack_size_g ต่อล็อต) — เก็บไว้ตาม spec V2 ยกเลิกข้อเสนอยุบทิ้งแล้ว

## ฝั่งแอป
`KodKlean_LIFF.dc.html` แก้ 3 บรรทัด (แนบ vendor_item_id) · `sw.js` CACHE_V → `kk-money-v19` · sync เข้า `deploy/` แล้วทั้งคู่
