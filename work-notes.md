# work-notes (สำหรับ Claude ใช้ทำงานต่อ — ลบได้เมื่อจบงาน)

## สไตล์รูปตัวการ์ตูน (สำคัญ! ห้ามจับคู่ข้ามสไตล์)
- chibi เดี่ยว: work_ahia (ชายหนุ่มสูทน้ำเงิน chibi), adult_maepan (หญิง chibi สูทชมพู ท่า present), kid_maepan (หญิง chibi ถือแท็บเล็ต)
- เสมือนจริง (ห้ามคู่กับ chibi): kid_ahia, child_ahia, child_maepan, teen_ahia, work_maepan
- แผ่นรวมท่า (ตัดแล้วอยู่ assets/poses/): boynavy, girlpink, boypink, girlbaby, boyblue, girlbeige — grid 3 แถว (3/3/4 = 10 ท่า)
- ลำดับท่า (10 ท่า): 01 นอน, 02 คลาน, 03 ร้องไห้, 04 ยืนโบกมือ, 05 เดิน, 06 ดีใจ/กอด, 07 ยืนชุดนักเรียน, 08 เดินสะพายเป้, 09 กระโดดดีใจ, 10 เศร้า

## คู่ต่อหน้า (chibi ล้วน)
- Home hero: boynavy_09 + girlpink_09 (เด็กกระโดดดีใจ)
- Buy header: boypink_08 + girlbaby_08 (เดินสะพายเป้)
- Success: boypink_09 + girlbaby_09
- List: boyblue_07 + girlbeige_07
- Dashboard: boyblue_04 + girlbeige_04
- Approve: work_ahia + adult_maepan
- Data: boynavy_04 + girlpink_05
- Settings avatar: work_ahia

## แก้สี (เลี่ยงสีแดง) ใน KodKlean_LIFF.dc.html + data.js
- #D6336C (เงินออก/กราฟเดือนนี้) → #7048E8
- #FA5252 (badge กระดิ่ง) → #F76707
- #C2255C / #FFF0F6 (ร่าง/ของขาด) → #E8590C / #FFF4E6 (ยกเว้นปุ่มลบใช้ส้มเข้มได้)
- gradient #FF8A3D,#FF5E7E → #FF9F1C,#F76BB8 / hero gradient #FF9A5A,#FF5E7E,#F76BB8 → #FFC24D,#FF9A3D,#F98BC4
- nav active #F03E6A → #F76707
- data.js meat สี #E05C5C → #74B816

## งานค้าง
1. re-crop แผ่นท่าแบบแบ่ง 3 แถวเท่ากัน (girlpink/boypink/girlbaby ได้ 7 เพราะแถวติดกัน, boyblue/girlbeige ไม่แยกเลย)
2. ตัวจริงหลัง LINE ต่อติด: smoke-test liff_dashboard/liff_month/ledger_detail ผ่าน gateway + signed thumb ในสมุดบันทึก

## โครงหลัก (อัปเดต 5 ส.ค. 69)
- หน้า: state.screen = home|buy(step1-6)|success|diary|books|rules|list|approve|dash|data|settings, modal ใน state.modal (kind: vendor|item|price|rule|case|doc|sign|history)
- ข้อมูล: window.KK_DATA (data.js) + localStorage 'kk_liff_v1' (vendors, purchases, sig, rules)
- kk-helpers.js = โมดูล pure: ปฏิทินไทย, defaultRules + backendRoute/journalPreview (ล็อก), CSV/ZIP, demoMonth
- กฎคัดกรอง: state.rules → fin_rules key 'liff_screening_rules' (live) + localStorage · rule ids ตั้งต้น: tax/bill/slip/none_transfer/none_cashid/none_cashno
- โหมดจริง: bootstrap → liff_dashboard (state.agg = กราฟทุกตัว) + liff_month (state.monthLive[ym] = ปฏิทิน/ไดอารี่/pl/vat) + signed thumb cache state.thumbs
- backend: gateway kk-finance-line v3 (มี liff_dashboard/liff_month → RPC fin_liff_dashboard/fin_liff_month) · kk-finance ไม่ถูกแตะ
- vendor เพิ่มฟิลด์: taxId/address/contact/docType (docType = rule id → prefill route ตอนซื้อ + default_route ฝั่ง fin)
- หลักฐาน cart.ev[label] = array ของ dataURL (แนบหลายรูป) · purchase.photos เก็บ 6 รูปแรกไว้โชว์ในไดอารี่/CASE
