# GO-LIVE — KodKlean LIFF (สถานะจริง + ขั้นตอนที่เหลือ)

> **อัปเดตล่าสุด (5 ส.ค. 69) — รอบส่วนขยายใหญ่:**
> 1. **เคลียร์ entry ทดสอบ:** ลง reversal 4 ใบ (`[TEST-REVERSAL]`) หักล้าง `[TEST]` เดิมเป็นศูนย์ — ตรวจแล้ว `fin_journal_balance_check` = 0 รายการ, ยอดสุทธิ [TEST] เดบิต=เครดิต ฿57,620 หักกันหมด งบจริงไม่ปน
> 2. **หน้าใหม่ 3 หน้า:** สมุดบันทึก (ปฏิทินรายเดือน + ไดอารี่รายวัน + ค้นตามร้าน + สรุป % รายร้าน + Excel/ZIP ทั้งเดือน) · งบ 2 ชุด (สลับส่วนตัว/จำลองนิติ + เลือกเดือน + ตาราง VAT ซื้อ + Excel) · กฎคัดกรองเอกสาร (เพิ่ม/แก้/ลบ/สลับลำดับกฎเองได้ + default route รายร้าน — เก็บใน `fin_rules` key `liff_screening_rules` ไม่ hardcode; สูตรเดบิต-เครดิต/VAT ล็อกหลังบ้าน ผูกอัตโนมัติตามชนิดเอกสาร)
> 3. **Backend ใหม่ (deploy แล้ว):** RPC `fin_liff_dashboard()` + `fin_liff_month(ym)` (security definer, เรียกได้เฉพาะ service role) + gateway `kk-finance-line` v3 เพิ่ม action `liff_dashboard` / `liff_month` — กราฟ Dashboard ทุกตัว + ปฏิทิน + P&L 2 งบ + VAT ดึงจาก fin จริงเมื่อ login ผ่าน LINE (โหมดสาธิตใช้ตัวอย่างเดิม)
> 4. **ข้อมูล supplier ครบ:** ฟอร์มร้านเพิ่ม เลขผู้เสียภาษี / ที่อยู่ / ช่องทางติดต่อ / ชนิดเอกสารที่ร้านออกได้ (ผูก default_route) — เขียนขึ้น `fin_vendors` จริงผ่าน `vendor_save` (tax_id / default_route / memory.address+contact) · ปุ่ม "เพิ่มร้านใหม่" มีทั้งหน้า ร้านค้า และตอนบันทึกซื้อ
> 5. **แนบหลายรูปต่อครั้ง:** ทุกช่องหลักฐาน (บิลหลายหน้า/สลิปหลายใบ/หลายลัง) เลื่อนดู + ลบทีละรูป · รับของถ่ายได้หลายรูป · เติมหลักฐานในรายการก็หลายรูป
> 6. **CASE view:** แตะรายการในสมุดบันทึก → เห็นชุดเต็ม: รูปหลักฐาน + บรรทัดบัญชี (เดบิต=เครดิต) + เอกสาร + ปุ่ม PDF (โหมดจริงดึง `ledger_detail` + signed URL — Drive PDF เปิดได้ทันทีหลังต่อ LINE/Drive) + ZIP ทั้งเดือน (ทำงานแล้วทั้ง 2 โหมด)
> 7. **ไฟล์ใหม่:** `kk-helpers.js` (ปฏิทินไทย/กฎตั้งต้น/CSV/ZIP — ไม่มี state, มีคอมเมนต์กำกับ)
>
> อัปเดตรอบก่อน: **แก้ payload ทุกปุ่มเงินให้ตรง contract ของ `kk-finance` จริง** (เดิมส่งชื่อฟิลด์ผิด: `intake_route`/`slip_total`/`rows`/`account_code`/`amount` → แก้เป็น `route`/`total`/`lines`/`category_account` ให้ backend รับได้) + พิสูจน์เดบิต=เครดิตครบ 4 เส้นทางด้วยตัวเลขจริงในฐานข้อมูล + เพิ่มส่งออก Excel/CSV + ค้นหาในหน้ารายการ
> เปิดไฟล์ `KodKlean_LIFF.dc.html` ตอนนี้ = รันได้เลยแบบ **โหมดสาธิต** (ข้อมูลตัวอย่าง) · ทำ 4 ด่านล่างเพื่อสลับเป็น **เชื่อมระบบจริง** · ทุกด่าน never-block (ไม่ทำก็ยังเปิด/กดได้ ไม่ error)

---

## ✅ ทำเสร็จรอบนี้ (โค้ด + ฐานข้อมูล — ตรวจแล้ว)
1. **แก้ data model ให้ 2 ฝั่งตรงกัน — วิธีที่เลือก: แมปที่ฝั่ง backend (ไม่แตะตารางที่ app_stock ใช้ร่วม)**
   - เพิ่มคอลัมน์ `fin_vendors.mockup_id` + เติมค่าให้ครบ 9 ร้าน (makro/freshket/shopee/fah/ppfood/loy/meatfb/papud/salmon → uuid จริง)
   - normalize `fin_vendors.default_route` เป็นรหัสมาตรฐาน `1a`/`1b`/`2a` (ของเดิม `2b_transfer` ผิด — แก้เป็น `2a`)
   - front-end แมป route ของผู้ใช้ → รหัส backend อัตโนมัติ: มีใบกำกับ→`1a` · บิล/ใบเสร็จ→`1b` · สลิปโอน→`2a` · จ่ายสดระบุผู้รับ→`2b_travel` · จ่ายสดพิสูจน์ไม่ได้→`2b_inhouse`
2. **ต่อ front-end เข้า backend จริง** (`this.api()` + แมป mockup↔uuid, ห่อ try/catch + toast ไทย ทุกจุด · fail = เก็บในเครื่องไว้ก่อน ไม่จอขาว):
   - อ่าน: `bootstrap` (ร้าน/กิจการ/แมป) + `approve_list` (ใบรออนุมัติจริงมาแทนตัวอย่าง) ตอน login สำเร็จ
   - เขียน (payload ตรง contract `kk-finance` แล้ว): ยืนยันซื้อ→`summary_confirm {route,total,vat,category_account,is_stock,is_asset,items}` · สลิปหลายร้าน→`payment_split_save {total,lines[]}` (ผลรวม lines ต้อง=total) · ค่าใช้จ่ายไม่ใช่สินค้า→`summary_confirm {route:'1b',category_account}` (ผังจริง 5210/5220/5900 — เลิกใช้ 5410 ที่ผิด) · ของถาวร→`summary_confirm {is_asset,asset}` (2 งบ: งบนิติลงทรัพย์สิน 1500 / งบร้านลงค่าใช้จ่ายทันที) · เซ็น→`approve_sign {doc_ids}`
   - ถ้า backend ตอบ error → toast โชว์ข้อความจริงจาก backend + เก็บในเครื่องไว้ก่อน (never-block)
   - ส่งออก **Excel/CSV** สรุปรายการตามแท็บ (เลขที่/วันที่/ร้าน/เอกสาร/สถานะ/ของถาวร/ยอด/VAT ประมาณ · ใส่ BOM ให้ Excel อ่านไทยได้) + ช่องค้นหาในหน้ารายการ — ทำงานทั้งโหมดสาธิตและจริง
   - draft (หลักฐานไม่ครบ) = เก็บในเครื่องอย่างเดียว ยังไม่ยิงเข้าบัญชี (ตรงกฎ never-block / block เฉพาะตอนยืนยัน)
3. **ตรวจฐานข้อมูลการเงิน (ตามที่สั่ง) — ทดสอบบันทึกจริงลง `fin_journal_lines`** — ยืนยัน:
   - ผังบัญชี 39 บัญชี ครบทุกรหัสที่ journal ใช้ (1010/1020/1040/1050/1500/5010/5210/5220/5900 …)
   - **เดบิต=เครดิต สมดุลครบ 4 เส้นทาง (ตัวเลขจริงจาก DB · diff = 0.00 ทุกใบ ทั้งงบนิติและงบร้าน):**
     - Makro ใบกำกับภาษี (1a) ฿6,480 = สุทธิ 6,056.07 + VAT 423.93 (3 บรรทัด) ✓
     - ฟ้าซีฟู้ด สลิปโอน (2a) ฿4,130 (2 บรรทัด) ✓
     - ค่าไฟฟ้า (1b) ฿1,200 (2 บรรทัด) ✓
     - ของถาวร ตู้แช่ ฿8,500 (4 บรรทัด · แยก 2 งบ debit=credit=17,000) ✓
   - view `fin_journal_balance_check` = จับ entry ที่เดบิต≠เครดิต · ตรวจทั้งฐานข้อมูล = **0 รายการ**
   - หมายเหตุ: entry ทดสอบทั้ง 4 ตั้งชื่อขึ้นต้น `[TEST]` (idempotency_key `balance-proof-*`) · ตารางเป็น append-only ลบไม่ได้ ถ้าจะเคลียร์ให้ลง reversal ผ่านแอป
4. **จัดโครงพร้อม deploy** — เพิ่ม `index.html` (เด้งเข้าแอป) · ค่า public อยู่ `config.js` · ค่าลับอยู่ Supabase Secrets (ไม่ hardcode)

## ⚠️ 2 เรื่องที่ผมยังทำแทนไม่ได้ (ต้องมือคน — บอกวิธีไว้ด้านล่าง)
- **A. redeploy `kk-finance` เพื่อสลับ AI เป็น Gemini** — ผมมีแค่ไฟล์ `supabase/functions/kk-finance/ai.ts` (เวอร์ชัน Gemini) แต่ตัว function ประกอบด้วย 8-9 ไฟล์ (index/db/files/drive/queries/flow/journal/docs) ที่ผม **ดึงจากตัว live มาไม่ได้** — ถ้า deploy ด้วยไฟล์ไม่ครบจะทับของที่ทำงานอยู่พัง จึง**ไม่แตะ** (AI เป็นฟีเจอร์เสริม ไม่ทำก็ใช้ระบบได้เต็ม ปุ่มจะ disable ให้เอง) → งานนักพัฒนา ด่าน 5
- **B. ทดสอบยิงจริงทะลุ LINE** — path จริงต้องมี LINE id-token (verify กับ api.line.me) ที่ต้องใช้ **LIFF ID + LINE_CHANNEL_ID ของพี่** ผมสร้างแทนไม่ได้ → ต้องทำด่าน 1–4 ก่อน แล้ว smoke-test 1 บิลจริง (ดูวิธีเช็คใต้ด่าน 4)

---

## ด่าน 1 — LINE (บัญชี LINE ของพี่) · ~15 นาที
ที่ https://developers.line.biz/console/
1. สร้าง **Provider** (ถ้ายังไม่มี) เช่น "KodKlean"
2. สร้าง **LINE Login channel** (ไม่ใช่ Messaging API)
3. แท็บ **LIFF** → **Add** : Size **Full** · Endpoint URL = URL เว็บจากด่าน 3 (ใส่ชั่วคราวก่อนแล้วกลับมาแก้ได้) · Scope เปิด `profile`, `openid` → กด Add → ได้ **LIFF ID** (`1234567890-abcdefgh`)
4. แท็บ **Basic settings** → คัดลอก **Channel ID** (ตัวเลขล้วน)

## ด่าน 2 — Secret ใน Supabase · ~10 นาที
Supabase Dashboard → project **Stock Tracker** → **Project Settings → Edge Functions → Secrets** → Add:

| Secret | ค่า | จำเป็น? |
|---|---|---|
| `LINE_CHANNEL_ID` | Channel ID (ด่าน 1 ข้อ 4) | ✅ ไม่มี = login ไม่ผ่าน |
| `GEMINI_API_KEY` | จาก https://aistudio.google.com/apikey | เสริม (AI อ่านบิล — ใช้ได้หลังทำด่าน 5 A) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` + `GDRIVE_ROOT_FOLDER_ID` | เก็บไฟล์ต้นฉบับขึ้น Drive | เสริม |

> `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` มีให้อัตโนมัติ ไม่ต้องใส่

## ด่าน 3 — Deploy เว็บ (ให้ได้ URL https) · ~15 นาที
เสิร์ฟ **ทั้งโฟลเดอร์** (มีรูปใน `assets/` — อย่าบีบไฟล์เดียว รูปจะหาย)
1. push ทั้งโปรเจกต์ขึ้น GitHub (มี `index.html`, `KodKlean_LIFF.dc.html`, `data.js`, `config.js`, `support.js`, โฟลเดอร์ `assets/`)
2. Cloudflare Pages → **Create project → Connect to Git** → เลือก repo · Framework preset **None** · Build command เว้นว่าง · Output directory `/`
3. Deploy เสร็จได้ URL เช่น `https://kodklean-liff.pages.dev/` (index.html จะเด้งเข้าแอปเอง)
4. เอา URL กลับไปใส่ **Endpoint URL** ของ LIFF (ด่าน 1 ข้อ 3)
> ทางเลือก: Netlify ลาก-วางโฟลเดอร์ที่ app.netlify.com/drop ก็ได้

## ด่าน 4 — กรอก config.js · ~2 นาที
แก้บรรทัดเดียว แล้ว push ขึ้น Git อีกครั้ง (Cloudflare auto-deploy):
```js
LIFF_ID: '1234567890-abcdefgh',   // LIFF ID จากด่าน 1
```
เปิดผ่าน LINE → login อัตโนมัติ · แถบบนขึ้น "เชื่อมระบบจริง · <ชื่อ LINE>" · หน้า **ตั้งค่า › บริการภายนอก** กด "ตรวจการเชื่อมต่อ" = สถานะจริง

**Smoke-test หลัง go-live (ทำ 1 ครั้ง):** บันทึกซื้อจริง 1 บิล (เช่น Makro มี VAT) → กดยืนยัน → ใน Supabase เปิด `select * from fin_journal_entries order by created_at desc limit 1;` ต้องเห็น entry ใหม่ · แล้ว `select * from fin_journal_balance_check;` ต้อง **ว่าง** (แปลว่าเดบิต=เครดิตทุกใบ) — ถ้ามีแถวโผล่ = journal ฝั่ง function ยังไม่ balance ให้แจ้งนักพัฒนา

## ด่าน 5 — งานนักพัฒนา (โค้ด backend)
**A. redeploy kk-finance (Gemini):**
```
supabase functions download kk-finance      # ได้ทุกไฟล์ index/db/files/drive/ai/queries/flow/journal/docs
# วางทับ ai.ts ด้วย supabase/functions/kk-finance/ai.ts (Gemini เวอร์ชันในโปรเจกต์นี้)
supabase functions deploy kk-finance
```
**B. เติมแคตตาล็อกสินค้าเข้า `fin_items`/`ingredient_lot`** ถ้าต้องการให้ line item ผูก uuid จริง (ตอนนี้ front-end ส่ง lines แบบ {name,qty,price} — journal ลงตามยอด/route ถูกต้องแล้ว แต่ยังไม่ผูก item master ครบ)
**C. เก็บกวาด:** ลบ tombstone `liff-record-purchase`/`liff-reports`/`liff-sign-document` (คืน 410 อยู่) · เคลียร์รหัสบัญชีซ้ำ 1010/1020 (ทั้งคู่เป็น "ธนาคาร" — journal ใช้ 1010=เงินสด/1020=ธนาคาร ควรตั้งชื่อ 1010 ให้ตรง)

---

## เช็กลิสต์สั้น
- [x] แก้ data model 2 ฝั่งให้ตรง (mockup_id + route map) — ตรวจแล้ว
- [x] ต่อ read/write จริง + guard + toast ไทย
- [x] ตรวจบัญชี + เดบิต=เครดิตสมดุล (3 กรณี) + view เฝ้าดุล
- [ ] LINE: Login channel + LIFF (LIFF ID + Channel ID) — *มือพี่*
- [ ] Supabase secret `LINE_CHANNEL_ID` — *มือพี่*
- [ ] Deploy โฟลเดอร์ → URL https + ใส่ LIFF Endpoint + `config.js` — *มือพี่*
- [ ] Smoke-test 1 บิล + เช็ค `fin_journal_balance_check` ว่าง
- [ ] (นักพัฒนา) redeploy kk-finance Gemini + เติม item master
