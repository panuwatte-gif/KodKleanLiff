# HANDOFF PROMPT — KodKlean Finance LIFF (ส่งต่อแชทถัดไป)

> วางข้อความนี้ทั้งก้อนให้ AI แชทใหม่ พร้อมแนบไฟล์โปรเจกต์ (`KodKlean_LIFF.dc.html`, `data.js`, `supabase/schema.sql`, โฟลเดอร์ `assets/`)
> เป้าหมาย: ทำต่อได้ทันทีโดยไม่หลุด design system / assets / navigation / feature list / กติกา ที่ล็อกไว้แล้ว

---

## 0. โปรเจกต์นี้คืออะไร
LIFF (ส่วนหนึ่งของ app_money) สำหรับ **บันทึกค่าใช้จ่ายฝั่งซื้อ + ลงบัญชี** เตรียมพร้อมก่อนจดนิติบุคคล
- ผู้ใช้ = เจ้าของร้าน 2 คน (ไม่ใช่สายเทคนิค) → **ความง่าย + น่ารักสำคัญเท่าฟังก์ชัน** ถ้าไม่สวยไม่น่ารัก คนไม่ใช้
- เฟส 1 = UI mockup ใช้ได้จริงในเครื่อง (localStorage) · backend Supabase = สร้าง schema แล้ว รอ apply + edge functions
- จะเชื่อม app_stock (ต้นทุนขายจริง) ทีหลัง — ตอนนี้ยังไม่เชื่อม

## 1. โครงไฟล์ (ห้ามแตกไฟล์เพิ่มโดยไม่จำเป็น)
- `KodKlean_LIFF.dc.html` — UI ทั้งหมด (ทุกหน้า + logic) เป็น Design Component เดียว: template `<x-dc>` + `class Component extends DCLogic`
- `data.js` — `window.KK_DATA` ข้อมูล mock (ร้าน/สินค้า/รายการ/กราฟ) แก้ข้อมูลที่นี่ที่เดียว
- `supabase/schema.sql` — ฐานข้อมูลเต็มเฟส 1 (พร้อม apply)
- ข้อมูลที่ผู้ใช้แก้ใน mockup: localStorage key `kk_liff_v1` (vendors, purchases, sig, prefsChars, svc)

## 2. DESIGN SYSTEM (ล็อก — ห้ามเปลี่ยนโดยไม่ขอ)
- ฟอนต์: **Noto Sans Thai** (400–900) · ตัวหนังสือใช้งาน ≥16px · ปุ่ม ≥48px · mobile-first max-width 440px · ไม่มี scroll แนวนอน
- พื้นแอป: `linear-gradient(160deg,#FFF3D6,#FFE3EC 45%,#DFF6FF)` · body `#FFF4E6` · ตัวอักษรหลัก `#3D2C29` · muted `#8A6D5C`/`#B08968`
- การ์ด: `#fff` · radius 18–26px · shadow `0 3px 12px rgba(255,140,90,.1)`
- สีหลัก: ส้ม `#F76707`/`#E8590C` · ม่วง `#7048E8`/`#5F3DC4` · ชมพู `#F76BB8` · เขียว `#37B24D`/`#2B8A3E` · ฟ้า `#1971C2`
- ไล่สีพาสเทล (hero/ปุ่มเด่น): `linear-gradient(115deg,#63C6F5,#9D8BF3,#FF93C6,#FFB765)` · FAB `linear-gradient(135deg,#7AB8F5,#9D8BF3,#FF93C6)`
- **เลี่ยงสีแดง** — เตือน/ของขาด ใช้ส้มเข้ม `#D9480F` · toggle เปิด `#37B24D` ปิด `#D9C6B2`
- สีสถานะ: เสร็จสมบูรณ์ `#2B8A3E`/bg`#EBFBEE` · รออนุมัติ `#E67700`/`#FFF9DB` · รอรับของ `#1971C2`/`#E7F5FF` · ร่าง `#9C36B5`/`#F8F0FC`
- **Dashboard: เงินออกเพิ่ม = เรื่องไม่ดี ห้ามใช้สี/ลูกศรเชิงบวก · ห้ามแสดงรายได้/กำไร** (ฝั่งซื้อ+เงินออกเท่านั้น)
- inline style ล้วน (ตามกฎ DC) · animation kkpop/kkfloat มีใน `<helmet>`

## 3. ASSETS (ใช้จากที่มีเท่านั้น ห้าม gen icon/รูปเอง)
- ตัวการ์ตูน **อาเฮีย (ชายใส่แว่น) + แม่พัน (หญิง)** — จับคู่ **วัยเดียวกัน** เท่านั้น สลับวัยตามหน้า **ห้ามวัยชรา ห้ามซ้ำแบบ ต้องเห็นชัด (สูง 84–152px ไม่ใช่ตัวจิ๋ว)**
  - chibi ท่าต่างๆ: `assets/poses2/boynavy_01..10.png` (=อาเฮีย) + `assets/poses2/girlpink_01..10.png` (=แม่พัน) — คู่กันเสมอ (ท่า: 04 ยืน, 05 เดิน, 06 ดีใจ/กอด, 07 นักเรียน, 08 สะพายเป้, 09 กระโดดดีใจ)
  - ผู้ใหญ่ทำงาน: `assets/characters/work_ahia.webp` + `assets/characters/adult_maepan.webp` (ใช้หน้า อนุมัติ/ตั้งค่า)
  - **ห้ามจับคู่ข้ามสไตล์** (chibi ต้องคู่ chibi, เสมือนจริงคู่เสมือนจริง)
- mascot ลูกเจี๊ยบ: `assets/mascots/` (big_mascot_0x, small_0x-mascot-*) ใช้ประกอบ/แทนไอคอน
- ไอคอน 3D: `assets/icons/` (icon_camera, icon_receive_box, icon_document_folder, icon_tax_invoice, icon_payment_slip, icon_po_clipboard, icon_stock_shelf, icon_notification_bell, icon_warning)
- โลโก้ supplier: `assets/logos/` · โลโก้แบรนด์ในเครือ: `assets/brandlogos/` · รูปสินค้า: `assets/products/`

## 4. NAVIGATION (ล็อก)
Bottom nav 5 ช่อง: **หน้าหลัก · รายการ · บันทึกซื้อ (FAB กลาง) · ร้านค้า · สรุป**
`state.screen`: `home | buy(buyStep 1–6) | success | list | approve | dash | data | settings | multi | expense`
Modal (`state.modal.kind`): `vendor | item | price | doc | sign | history`

## 5. FEATURE LIST + STATE (ทำครบแล้วใน mockup — รักษาไว้)
1. **หน้าหลัก** — เงินไหลออกเดือนนี้ (ม่วง ไม่ใช่แดง) · การ์ดงานค้าง 3 (รออนุมัติ/ค้างรับ/ร่าง) นับจริง · ทางเข้า 4 · ทางลัด สลิปหลายร้าน + ค่าใช้จ่ายอื่น · รายการล่าสุด · โลโก้แบรนด์ในเครือ
2. **บันทึกซื้อ 6 ขั้น**: (1) เลือกร้าน+ค้นหา+เพิ่มร้านด่วน (2) เลือกสินค้าการ์ด −/+ แตะแก้ราคา→ถามบันทึกราคาใหม่ + **ปุ่มให้ AI อ่านจากรูป** (3) ค่าส่ง+ค่าลัง default ร้าน แก้ได้ (4) **คัดกรองเอกสาร 4 การ์ด (ข้อความเต็ม ห้ามโชว์รหัส 1a/1b/2a/2b)** + sub เมื่อ "ไม่มีเอกสาร" + เตือนนุ่มๆให้โอน (5) เช็คลิสต์หลักฐาน ติ๊กเขียว/บันทึกร่าง (6) สรุป + **ถามของถาวร (flag)** + ยืนยัน
3. **สลิปเดียว หลายร้าน** (`multi`) — ใส่ยอดสลิปรวม + แตกบรรทัดรายร้าน (select ร้าน + ยอด + route cycle) · **ผลรวมต้อง = ยอดสลิป ถึงยืนยันได้** · แต่ละบรรทัดเข้า route ของตัวเอง
4. **ค่าใช้จ่ายไม่ใช่สินค้า** (`expense`) — เลือกประเภท (ค่าไฟ/ค่าเช่า/เบ็ดเตล็ด…) + จำนวนเงิน + ถามของถาวร + หมายเหตุ · ไม่ต้องเลือกสินค้า
5. **AI อ่านบิล** — ปุ่มในขั้น 2 · ถ้าไม่มี Gemini key → ปุ่ม disable + toast (never block) · มี key → จำลองเติมฟอร์ม → banner "ตรวจ/แก้ก่อนยืนยัน"
6. **ของถาวร** — toggle ในขั้นสรุปซื้อ + หน้า expense → เก็บ flag `isAsset` (ลงค่าใช้จ่ายทันที ยังไม่คิดค่าเสื่อม) · แสดง badge "ของถาวร" ในรายการ
7. **รายการ/รับของ** — tab (ทั้งหมด/ตะกร้ารอจับคู่/รับของ/เสร็จ) · รับของ: กรอกจำนวนจริง→ของขาด เลือก ส่งเติม/คืนเงิน/Loss + ถ่ายรูปของ · เติมหลักฐานร่างได้ · **ปุ่มดูประวัติแก้ไข ทุกรายการ**
8. **ประวัติแก้ไข** (modal `history`) — timeline จาก edit_history (สร้าง→ลงบัญชีคู่→สร้างเอกสาร→เซ็น) + กติกาแก้ไข (แก้ทับ/reversal/ใบใหม่ ไม่มีลบ)
9. **อนุมัติ + เซ็น** — เลือกหลายใบเซ็นทีเดียว · ใบไม่ครบเซ็นไม่ได้ (block เฉพาะจุดเซ็น) · modal ยืนยัน แปะลายเซ็น+log
10. **Dashboard** — เงินออกเดือนนี้ · กราฟค่าใช้จ่าย 12 ด. (เดือนนี้สีเด่น) · VAT ซื้อ 12 ด. · ปริมาณเนื้อสัตว์ · **งบ 2 ชุด** (ส่วนตัวทุกรายการ vs จำลองนิติเอกสารครบ + หมายเหตุ "ต้นทุนขายจริงรอเชื่อม App_stock") · Top 5 ร้าน
11. **ร้านค้า (Data)** — เพิ่ม/แก้/ลบ/สลับตำแหน่งร้าน + สินค้าต่อร้าน + เปลี่ยนรูปสินค้า (บีบ+WebP)
12. **ตั้งค่า** — โปรไฟล์ owner · อัปโหลดลายเซ็น · toggle แสดงตัวการ์ตูน · **บริการภายนอก** (LINE/Supabase/Drive/Gemini) toggle mock + "ระบบทำงานได้แม้ยังไม่ใส่ key"

## 6. กติกาสำคัญ (ห้ามพลาด)
- **ห้ามโชว์รหัส route 1a/1b/2a/2b ให้ผู้ใช้** — แสดงข้อความเต็มเสมอ
- **never block** ตอนบันทึก/ร่าง (ไม่ครบ = บันทึก+mark ไม่หยุด) · **block เฉพาะตอนยืนยัน/เซ็น** เอกสาร (deadline สรรพากร)
- **ห้าม DELETE เงิน** — ยังไม่ลงบัญชี=แก้ทับ / ลงแล้ว=reversal / เซ็นแล้ว=ออกใบใหม่ (ใบเก่า void) · ทุกแก้ไขลง edit_history
- ลงบัญชีคู่หลังบ้านทุก event (เดบิต=เครดิต) ซ่อนจากผู้ใช้ · ทุก line มี `book_scope` (both / inhouse_only)
- งบ 2 ชุด = journal ชุดเดียว ต่างแค่ filter · งบจำลองนิติยังไม่ครบ (รอ App_stock ต่อ COGS)
- ตัวเลขคำนวณจริง ห้าม hardcode · try-catch ทุก call → toast ไทย ห้ามจอขาว
- ไฟล์: Supabase = WebP thumbnail เท่านั้น · Google Drive = ต้นฉบับ (กิจการ/ปี/เดือน/CASE) ≥5 ปี · sha256 กันซ้ำ

## 7. BACKEND — สถานะจริง (สำรวจ DB แล้ว)
- Supabase project: **"Stock Tracker"** `project_id = qxhvmrxbrrweundfspzp` (ap-northeast-1) — ใช้ตัวนี้ จะไปแทนของเดิม
- **⚠️ ระบบการเงินมีอยู่แล้วเป็นชุด `fin_*` (ไม่ใช่ liff_)** ตรงตาม DATA_MODEL เฟส1 เกือบเป๊ะ และส่วนใหญ่ยังว่าง พร้อมใช้:
  - `fin_vendors`(3 แถว) · `fin_items`(4) · `fin_purchase_orders`(intake_route,is_asset,book_scope,shipping/packaging_cost)+`fin_po_items` · `fin_payment_events` · `fin_receive_events`(+items) · `fin_journal_entries`+`fin_journal_lines`(book_scope,is_reversal) · `fin_documents`(type,doc_no,payload,approve_log,replaces_id,signed_file_hash,pdf_gdrive_id) · `fin_edit_history` · `fin_captures`(ai_result,intake_route,route_confirmed) · `fin_assets` · `fin_signature_events` · `fin_number_sequences` · `fin_entities`(3) · `fin_users`(4) · `fin_accounts`(**seed 39 บัญชีแล้ว**) · `fin_rules`
  - **append-only trigger ครบแล้ว**: fin_journal_entries/lines, fin_documents, fin_edit_history, fin_purchase_orders, fin_signature_events
- **✅ Edge functions = ระบบสมบูรณ์มีอยู่แล้ว (อย่าสร้างใหม่ — จะกลายเป็นชั้นซ้ำ):**
  - **`kk-finance`** (verify_jwt=true) = สมองกลาง business logic ทั้งหมด · โครงไฟล์: index.ts(router) · db.ts(sb/json/nextNumber/logEdit/autoDecision) · files.ts+drive.ts(thumbnail→Supabase `fin-files` bucket / ต้นฉบับ→Google Drive, never-block) · **ai.ts(OCR — ปัจจุบันในตัว live ยังเป็น Claude/ANTHROPIC_API_KEY แต่ user สั่งเปลี่ยนเป็น Gemini)** · queries.ts · flow.ts · journal.ts(บัญชีคู่ balanced+book_scope both/statutory_only/inhouse_only+reversal) · docs.ts
  - **⚠️ AI = Gemini เท่านั้น** (ถูกกว่า Claude หลายเท่า) — ไฟล์ทดแทนพร้อมใช้ที่ `supabase/functions/kk-finance/ai.ts` (ใช้ `GEMINI_API_KEY`, model `gemini-2.0-flash`, never-block) · **ต้อง redeploy kk-finance ทั้ง bundle ตอน build front-end** (ตอนนั้น checkout ไฟล์อื่นครบ) · **SlipOK ไม่ใช้** (บริการฝั่งคนขาย ไม่เกี่ยวฝั่งซื้อ) — `fin-slip-verify` ปล่อยไว้เฉยๆ ไม่เรียก
  - **`kk-finance-line`** (verify_jwt=false) = ประตู LINE: header `x-line-id-token` → verify กับ api.line.me (ต้อง `LINE_CHANNEL_ID`) → ฉีด `line` context → forward เข้า kk-finance · **front-end เรียกตัวนี้ตัวเดียว** · มี `action:'health'` บอกว่า secret ไหนตั้งแล้ว
  - **actions ที่มี** (ส่ง `{action, payload, }` ผ่าน kk-finance-line): `bootstrap`(โหลดร้าน/สินค้า/บัญชี/นับงานค้าง) · `home_counts` · `ocr` · `upload_file` · `signed_url` · `drive_retry` · `create_capture` · `confirm_route`(คัดกรอง+ตะกร้าจับคู่) · `purchase_create` · `payment_split_save`(สลิปหลายร้าน เช็คผลรวม) · `attach_part`(เติมหลักฐานตะกร้า) · `receive_save` · `shortage_save`(ของขาด loss/refund/resend) · `summary_confirm`(ลงบัญชี+สร้างเอกสาร) · `asset_save` · `approve_list` · `approve_sign`(owner เท่านั้น+hash+log) · `doc_replace` · `run_depreciation` · `ledger_query`/`ledger_detail`/`ledger_edit`(เปลี่ยน route→reversal, เปลี่ยนรูป, unmatch, history) · `po_list`/`po_detail` · `settings_save` · `vendor_save`
  - **routes จริง (flow.ts ROUTE_INFO):** `1a`(ใบกำกับ VAT) `1b`(บิล/ใบเสร็จ) `2a`(สลิปโอน→ใบสำคัญจ่าย) `2b_travel`(ค่าเดินทาง→ใบรับรอง) `2b_inhouse`(ไม่มีเอกสาร→งบร้านเท่านั้น book=inhouse_only) · **asset = ลง statutory_only เป็นทรัพย์สิน + inhouse_only เป็นค่าใช้จ่ายทันที** (assetLines ใน journal.ts)
  - รองรับ: `fin-slip-verify`(SlipOK ตรวจสลิป) · `fin-drive-sync`(sync คิวไฟล์ค้าง) · `ai-proxy` · `notify-line`/`kodklean-line-notify`(แจ้งเตือน LINE)
- **⚠️ 3 functions ที่ผมเผลอสร้างซ้ำ (`liff-record-purchase`/`liff-reports`/`liff-sign-document`) = ทับเป็น tombstone คืน 410 แล้ว — ห้ามใช้ ใช้ kk-finance แทน** (ลบทิ้งได้เมื่อมี dashboard)
- **สิ่งที่ผม (ยัง) เพิ่มบน DB จริง — เก็บไว้ได้ มีประโยชน์:**
  - migration `liff_seed_vendors` — seed 9 ร้านจาก data.js เข้า `fin_vendors` (dedupe Makro/Shopee) + default_route/บัญชี/logo_key
  - migration `liff_use_ingredient_lot_drop_dup` — เชื่อม `ingredient_lot` (SKU รายร้าน 28 แถว) เข้า fin_vendors (`vendor_id`,`image_url`,`active`) · ทิ้ง fin_vendor_items ที่ผมสร้างซ้ำ
  - migration `liff_intake_routes` — ตาราง `intake_routes` อ้างอิง (kk-finance ใช้ ROUTE_INFO hardcode อยู่แล้ว — ตารางนี้แค่เผื่อ front-end/ซ้ำได้ ลบได้)
- **แคตตาล็อกซื้อ = `ingredient_lot`** → map เข้า `ingredient_master` (canonical: 69 แถว มีกุ้ง/แซลมอนหลายเกรด) → app_stock ใช้ ingredient เดียวกัน
- **Secrets ที่ต้องตั้ง (Supabase → Settings → Edge Functions Secrets):** `LINE_CHANNEL_ID`(จำเป็น-login) · `GEMINI_API_KEY`(AI อ่านบิล เสริม — Gemini ถูกกว่า Claude มาก) · `GOOGLE_SERVICE_ACCOUNT_JSON`+`GDRIVE_ROOT_FOLDER_ID`(เก็บต้นฉบับ) · SUPABASE_URL/SERVICE_ROLE_KEY(มีให้อัตโนมัติ) · เช็คด้วย action `health` · **ไม่ใช้ SLIPOK_API_KEY** (ฝั่งคนขาย)
- **⚠️ ผังบัญชีมีโค้ดซ้ำจาก AI เก่า** (ไม่ลบ) — journal.ts ใช้ ACC: เงินสด`1010` ธนาคาร`1020` จ่ายล่วงหน้า`1030` สินค้าคงเหลือ`1040` ภาษีซื้อ`1050` ทรัพย์สิน`1500` ค่าเดินทาง`5210` เบ็ดเตล็ด`5220` ค่าเสื่อม`5310` loss`5410` COGS`5010` วัตถุดิบสด`5020`
- **ตารางน่าเคลียร์ (ยังไม่ลบ — app_stock เก่ายังใช้):** master ซ้ำ `ingredients_master`(347)/`KodKlean_ingredients`(256)/`ingredient_mapping`(14) · โค้ดบัญชีซ้ำใน fin_accounts · rama9_*/grab_* = แอปอื่น
- **งานที่เหลือจริง = front-end อย่างเดียว:** สร้าง LIFF app จริง (HTML/JS + LIFF SDK) เรียก `kk-finance-line` ด้วย `x-line-id-token` ตาม actions ข้างบน แล้ว deploy (GitHub connect แล้ว → Cloudflare Pages/Netlify) · DC mockup นี้ = พิมพ์เขียว UI/flow

## 8. เฟส 1 ไม่ทำ (แต่เก็บข้อมูลดิบไว้แล้ว)
ค่าเสื่อม asset · ปิดงบ CPA · งบดุลเต็ม · ปฏิทิน/ยื่นภาษี · COGS จริงจาก App_stock · loss report จาก yield — เปิดทีหลังจาก flag/journal/ฟิลด์ที่เก็บไว้ ไม่ต้องรื้อ
