/* ============================================================
   data.js — ข้อมูล mock ทั้งหมดของ KodKlean LIFF (Phase 1 UI)
   แก้ไข/เพิ่มร้านค้า สินค้า ราคา รูป กราฟ ได้ที่ไฟล์นี้ที่เดียว
   หมายเหตุ: ราคาเป็น "ตัวอย่าง" เพื่อให้ UI คำนวณได้ เจ้าของแก้ทีหลังในหน้า ร้านค้า
   ============================================================ */
window.KK_DATA = (function () {
  const P = 'assets/products/';
  const L = 'assets/logos/';

  // ---------- ร้านค้า + สินค้า (ตาม SEED_SUPPLIERS) ----------
  const vendors = [
    {
      id: 'makro', name: 'Makro', channel: 'สาขา / ออนไลน์', logo: L + 'makro.webp', color: '#4DABF7',
      shipping: 0, box: 0, freq: 'ซื้อบ่อย',
      doc: ['ใบกำกับภาษี / ใบเสร็จ', 'รูปสินค้าที่รับ'],
      cats: ['หมู', 'ไข่+เต้าหู้', 'ผัก+อื่นๆ', 'เครื่องปรุง'],
      items: [
        { id: 'mk01', name: 'หมูสันนอก', spec: 'สไลซ์ · แพ็กเย็น', unit: 'กก.', price: 165, img: P + 'pork-sliced.webp', cat: 'หมู' },
        { id: 'mk02', name: 'หมูสันใน', spec: 'แพ็กเย็น', unit: 'กก.', price: 175, img: P + 'pork-sliced.webp', cat: 'หมู' },
        { id: 'mk03', name: 'ไข่ไก่ เบอร์ 3-4', spec: 'แผง 30 ฟอง', unit: 'แผง', price: 115, img: P + 'eggs.webp', cat: 'ไข่+เต้าหู้' },
        { id: 'mk04', name: 'ไข่เป็ดฟองเล็ก', spec: 'แผง 30 ฟอง', unit: 'แผง', price: 125, img: P + 'eggs.webp', cat: 'ไข่+เต้าหู้' },
        { id: 'mk05', name: 'ไข่แดงเค็ม', spec: 'แพ็ก 6 ลูก', unit: 'แพ็ก', price: 65, img: P + 'eggs.webp', cat: 'ไข่+เต้าหู้' },
        { id: 'mk06', name: 'เต้าหู้คินุ', spec: 'ก้อน 300 กรัม', unit: 'ก้อน', price: 18, img: '', cat: 'ไข่+เต้าหู้' },
        { id: 'mk07', name: 'แตงกวา', spec: 'สด', unit: 'กก.', price: 25, img: P + 'vegetables.webp', cat: 'ผัก+อื่นๆ' },
        { id: 'mk08', name: 'แครอท', spec: 'สด', unit: 'กก.', price: 35, img: P + 'vegetables.webp', cat: 'ผัก+อื่นๆ' },
        { id: 'mk09', name: 'แครอทหั่นเต๋า', spec: 'แพ็กพร้อมใช้', unit: 'แพ็ก', price: 48, img: P + 'vegetables.webp', cat: 'ผัก+อื่นๆ' },
        { id: 'mk10', name: 'เห็ดออรินจิ', spec: 'แพ็ก 500 กรัม', unit: 'แพ็ก', price: 85, img: P + 'vegetables.webp', cat: 'ผัก+อื่นๆ' },
        { id: 'mk11', name: 'เส้นแก้ว', spec: 'แพ็ก', unit: 'แพ็ก', price: 42, img: '', cat: 'ผัก+อื่นๆ' },
        { id: 'mk12', name: 'พริกขี้หนู', spec: 'สด', unit: 'กก.', price: 90, img: P + 'aromatics.webp', cat: 'ผัก+อื่นๆ' },
        { id: 'mk13', name: 'ขึ้นฉ่าย', spec: 'สด', unit: 'กก.', price: 60, img: P + 'vegetables.webp', cat: 'ผัก+อื่นๆ' },
        { id: 'mk14', name: 'ต้นหอม', spec: 'สด', unit: 'กก.', price: 55, img: P + 'aromatics.webp', cat: 'ผัก+อื่นๆ' },
        { id: 'mk15', name: 'ต้นหอมญี่ปุ่น', spec: 'สด', unit: 'กก.', price: 120, img: P + 'aromatics.webp', cat: 'ผัก+อื่นๆ' },
        { id: 'mk16', name: 'รากผักชี', spec: 'สด', unit: 'กก.', price: 140, img: P + 'aromatics.webp', cat: 'ผัก+อื่นๆ' },
        { id: 'mk17', name: 'หอมใหญ่', spec: 'สด', unit: 'กก.', price: 38, img: P + 'aromatics.webp', cat: 'ผัก+อื่นๆ' },
        { id: 'mk18', name: 'หอมแดง', spec: 'สด', unit: 'กก.', price: 65, img: P + 'aromatics.webp', cat: 'ผัก+อื่นๆ' },
        { id: 'mk19', name: 'ซอสปรุงรสฝาเขียว ภูเขาทอง', spec: 'ขวด 700 มล.', unit: 'ขวด', price: 42, img: P + 'seasonings.webp', cat: 'เครื่องปรุง' },
        { id: 'mk20', name: 'ซอสเต้าเจี้ยว เด็กสมบูรณ์ สูตร 1', spec: 'ขวด', unit: 'ขวด', price: 35, img: P + 'seasonings.webp', cat: 'เครื่องปรุง' },
        { id: 'mk21', name: 'น้ำปลา ดอยหอยหลอด', spec: 'ขวด 700 มล.', unit: 'ขวด', price: 32, img: P + 'seasonings.webp', cat: 'เครื่องปรุง' },
        { id: 'mk22', name: 'น้ำเชื่อม มิตรผล', spec: 'ขวด', unit: 'ขวด', price: 55, img: P + 'seasonings.webp', cat: 'เครื่องปรุง' },
        { id: 'mk23', name: 'ซอสแม็กกี้ฝาเหลือง', spec: 'ขวด', unit: 'ขวด', price: 48, img: P + 'seasonings.webp', cat: 'เครื่องปรุง' },
        { id: 'mk24', name: 'น้ำมันหอย ตราแม่ครัว', spec: 'ขวด', unit: 'ขวด', price: 52, img: P + 'seasonings.webp', cat: 'เครื่องปรุง' },
        { id: 'mk25', name: 'น้ำมันหอย ฉลากเงิน', spec: 'ขวด', unit: 'ขวด', price: 58, img: P + 'seasonings.webp', cat: 'เครื่องปรุง' },
        { id: 'mk26', name: 'ซีอิ๊วขาว เด็กสมบูรณ์ สูตร 1', spec: 'ขวด', unit: 'ขวด', price: 38, img: P + 'seasonings.webp', cat: 'เครื่องปรุง' },
        { id: 'mk27', name: 'ฟ้าไทย ซองชมพู', spec: 'ซอง', unit: 'ซอง', price: 25, img: P + 'seasonings.webp', cat: 'เครื่องปรุง' },
        { id: 'mk28', name: 'ฟ้าไทย ซองเขียว', spec: 'ซอง', unit: 'ซอง', price: 25, img: P + 'seasonings.webp', cat: 'เครื่องปรุง' },
        { id: 'mk29', name: 'ผงชูรส อิอิโยะโมะโต๊ะพลัส', spec: 'ถุง 1 กก.', unit: 'ถุง', price: 95, img: P + 'seasonings.webp', cat: 'เครื่องปรุง' },
        { id: 'mk30', name: 'น้ำส้มสายชูกลั่น อสร', spec: 'ขวด', unit: 'ขวด', price: 22, img: P + 'seasonings.webp', cat: 'เครื่องปรุง' },
        { id: 'mk31', name: 'น้ำส้มสายชูข้าว คิวพี', spec: 'ขวด', unit: 'ขวด', price: 85, img: P + 'seasonings.webp', cat: 'เครื่องปรุง' },
        { id: 'mk32', name: 'ผงลาบเหนือ แม่น้อย', spec: 'ซอง', unit: 'ซอง', price: 15, img: P + 'seasonings.webp', cat: 'เครื่องปรุง' }
      ]
    },
    {
      id: 'freshket', name: 'Freshket', channel: 'ออนไลน์', logo: L + 'freshket.png', color: '#38B26E',
      shipping: 0, box: 0, freq: 'ซื้อบ่อย', doc: ['ใบเสร็จ / ใบส่งของ', 'รูปสินค้าที่รับ'], cats: [],
      items: [
        { id: 'fk01', name: 'ใบกะเพรา (เด็ด)', spec: 'แพ็กสด', unit: 'กก.', price: 180, img: P + 'vegetables.webp', cat: '' },
        { id: 'fk02', name: 'กระเทียม', spec: 'แกะกลีบ', unit: 'กก.', price: 95, img: P + 'aromatics.webp', cat: '' }
      ]
    },
    {
      id: 'shopee', name: 'Shopee', channel: 'ออนไลน์ · บิลแล้วแต่ร้านย่อย', logo: L + 'shopee.webp', color: '#FF5722',
      shipping: 0, box: 0, freq: 'ซื้อบ่อย', doc: ['สลิปโอน / ใบเสร็จร้านย่อย', 'แคปหน้าคำสั่งซื้อ'], cats: [],
      items: [
        { id: 'sp01', name: 'ข้าวไอยรา ถุงม่วง', spec: 'ถุง 5 กก.', unit: 'ถุง', price: 245, img: P + 'riceberry-rice.webp', cat: '' },
        { id: 'sp02', name: 'ข้าวหอมมะลิ ไอยราสีทอง', spec: 'ถุง 5 กก.', unit: 'ถุง', price: 265, img: P + 'riceberry-rice.webp', cat: '' },
        { id: 'sp03', name: 'ข้าวไดโนเสาร์ ต้นปี', spec: 'ถุง 5 กก.', unit: 'ถุง', price: 235, img: P + 'riceberry-rice.webp', cat: '' },
        { id: 'sp04', name: 'ข้าวหอมมะลิ ตราฉัตรทอง', spec: 'ถุง 5 กก.', unit: 'ถุง', price: 255, img: P + 'riceberry-rice.webp', cat: '' },
        { id: 'sp05', name: 'ข้าวไรซ์เบอรี่ ลุงยิ้ม', spec: 'ถุง 2 กก.', unit: 'ถุง', price: 155, img: P + 'riceberry-rice.webp', cat: '' }
      ]
    },
    {
      id: 'fah', name: 'ฟ้าซีฟู้ด', channel: 'แชท · มีค่าส่ง/ค่าลัง', logo: L + 'fah-seafood.webp', color: '#2D9CDB',
      shipping: 150, box: 80, freq: 'ซื้อบ่อย', doc: ['แคปแชทคำสั่งซื้อ', 'สลิปโอนเงิน', 'รูปสินค้าที่รับ'], cats: [],
      items: [
        { id: 'fh01', name: 'เนื้อกุ้ง', spec: '16/20 · NW80%', unit: 'กก.', price: 385, img: P + 'shrimp-large-16-20.webp', cat: '' },
        { id: 'fh02', name: 'เป็ดบดไร้มัน ไวดักส์', spec: 'แพ็กแช่แข็ง', unit: 'กก.', price: 145, img: P + 'beef-minced.webp', cat: '' },
        { id: 'fh03', name: 'เนื้อปลาฮอกเกะ', spec: 'แล่แช่แข็ง', unit: 'กก.', price: 260, img: P + 'salmon-fillet.webp', cat: '' },
        { id: 'fh04', name: 'แซลมอน', spec: 'เทราต์แล่', unit: 'กก.', price: 320, img: P + 'salmon-fillet.webp', cat: '' }
      ]
    },
    {
      id: 'ppfood', name: 'PP Food', channel: 'แชท · มีค่าส่ง/ค่าลัง', logo: L + 'pp-food.webp', color: '#F2994A',
      shipping: 140, box: 80, freq: 'ซื้อบ่อย', doc: ['แคปแชทคำสั่งซื้อ', 'สลิปโอนเงิน', 'รูปสินค้าที่รับ'], cats: [],
      items: [
        { id: 'pp01', name: 'เป็ดบดไร้มัน ไวดักส์', spec: 'แพ็กแช่แข็ง', unit: 'กก.', price: 150, img: P + 'beef-minced.webp', cat: '' },
        { id: 'pp02', name: 'เนื้อปลาฮอกเกะ', spec: 'แล่แช่แข็ง', unit: 'กก.', price: 255, img: P + 'salmon-fillet.webp', cat: '' },
        { id: 'pp03', name: 'เนื้อกุ้ง', spec: '41/50 · NW80%', unit: 'กก.', price: 340, img: P + 'shrimp-medium-41-50.webp', cat: '' },
        { id: 'pp04', name: 'แซลมอน', spec: 'เทราต์แล่', unit: 'กก.', price: 315, img: P + 'salmon-fillet.webp', cat: '' }
      ]
    },
    {
      id: 'loy', name: 'หลอยไก่สด', channel: 'แชท Facebook/LINE · มีค่าส่ง/ค่าลัง', logo: L + 'loy-chicken.webp', color: '#F2C94C',
      shipping: 120, box: 60, freq: '', doc: ['แคปแชทคำสั่งซื้อ', 'สลิปโอนเงิน', 'รูปสินค้าที่รับ'], cats: [],
      items: [
        { id: 'ly01', name: 'สันในไก่', spec: 'สดรายวัน', unit: 'กก.', price: 82, img: P + 'chicken-breast.webp', cat: '' },
        { id: 'ly02', name: 'อกไก่ติดหนัง', spec: 'สดรายวัน', unit: 'กก.', price: 75, img: P + 'chicken-breast.webp', cat: '' },
        { id: 'ly03', name: 'อกไก่ BB', spec: 'สดรายวัน', unit: 'กก.', price: 78, img: P + 'chicken-breast.webp', cat: '' },
        { id: 'ly04', name: 'อกลอก', spec: 'สดรายวัน', unit: 'กก.', price: 80, img: P + 'chicken-breast.webp', cat: '' }
      ]
    },
    {
      id: 'meatfb', name: 'Supplier เนื้อ (FB)', channel: 'แชท Facebook', logo: L + '13-supplier-meat.webp', color: '#219653',
      shipping: 0, box: 0, freq: '', doc: ['แคปแชทคำสั่งซื้อ', 'สลิปโอนเงิน', 'รูปสินค้าที่รับ'], cats: [],
      items: [
        { id: 'mf01', name: 'เนื้อแดง', spec: 'ตัดสด', unit: 'กก.', price: 285, img: P + 'beef-minced.webp', cat: '' },
        { id: 'mf02', name: 'เนื้อลูกมะพร้าว', spec: 'ตัดสด', unit: 'กก.', price: 295, img: P + 'beef-minced.webp', cat: '' },
        { id: 'mf03', name: 'สันใน', spec: 'ตัดสด', unit: 'กก.', price: 340, img: P + 'beef-minced.webp', cat: '' },
        { id: 'mf04', name: 'แก้มวัว', spec: 'ตัดสด', unit: 'กก.', price: 310, img: P + 'beef-minced.webp', cat: '' }
      ]
    },
    {
      id: 'papud', name: 'Supplier เนื้อ ป๋าพุธ', channel: 'แชท', logo: L + 'papud.png', color: '#C0392B',
      shipping: 0, box: 0, freq: '', doc: ['แคปแชทคำสั่งซื้อ', 'สลิปโอนเงิน'], cats: [],
      items: [
        { id: 'pw01', name: 'เนื้อแดง', spec: 'ตัดสด', unit: 'กก.', price: 275, img: P + 'beef-minced.webp', cat: '' }
      ]
    },
    {
      id: 'salmon', name: 'Supplier แซลมอน (Nu Tai Toto)', channel: 'Facebook/LINE · มีค่าส่ง/ค่าลัง', logo: L + 'salmon-supplier.webp', color: '#EB7A55',
      shipping: 150, box: 100, freq: '', doc: ['แคปแชทคำสั่งซื้อ', 'สลิปโอนเงิน', 'รูปสินค้าที่รับ'], cats: [],
      items: [
        { id: 'sm01', name: 'แซลมอนปาด', spec: 'แช่แข็ง', unit: 'กก.', price: 250, img: P + 'salmon-fillet.webp', cat: '' },
        { id: 'sm02', name: 'บราวน์', spec: 'แช่แข็ง', unit: 'กก.', price: 230, img: P + 'salmon-fillet.webp', cat: '' }
      ]
    }
  ];

  // ---------- รายการซื้อล่าสุด (ตัวอย่าง) ----------
  const purchases = [
    { id: 'PC-0912', vendorId: 'fah', date: '2 ส.ค. 69', total: 4130, status: 'รอรับของ', route: 'ใบสำคัญจ่าย + สลิปโอน', missing: [] },
    { id: 'PC-0911', vendorId: 'makro', date: '1 ส.ค. 69', total: 6480, status: 'เสร็จสมบูรณ์', route: 'ใบกำกับภาษี (มี VAT)', missing: [] },
    { id: 'PC-0910', vendorId: 'salmon', date: '31 ก.ค. 69', total: 5250, status: 'ร่าง', route: 'ใบสำคัญจ่าย + สลิปโอน', missing: ['รูปสินค้าที่รับ'] },
    { id: 'PC-0909', vendorId: 'loy', date: '30 ก.ค. 69', total: 1890, status: 'รออนุมัติ', route: 'ใบสำคัญจ่าย + สลิปโอน', missing: [] },
    { id: 'PC-0908', vendorId: 'shopee', date: '29 ก.ค. 69', total: 1225, status: 'ร่าง', route: 'ยังไม่ระบุ', missing: ['สลิปโอนเงิน', 'แคปหน้าคำสั่งซื้อ'] },
    { id: 'PC-0907', vendorId: 'ppfood', date: '28 ก.ค. 69', total: 3465, status: 'เสร็จสมบูรณ์', route: 'ใบสำคัญจ่าย + สลิปโอน', missing: [] }
  ];

  // ---------- เอกสารรออนุมัติ (ตัวอย่าง) ----------
  const drafts = [
    { id: 'PV-2569-0042', type: 'ใบสำคัญจ่าย', entity: 'กะเพราโคตรคลีน', vendorId: 'loy', amount: 1890, date: '30 ก.ค. 69', payee: 'หลอยไก่สด (โอนธนาคาร)', ready: true },
    { id: 'PV-2569-0043', type: 'ใบสำคัญจ่าย', entity: 'กะเพราโคตรคลีน', vendorId: 'fah', amount: 4130, date: '2 ส.ค. 69', payee: 'ฟ้าซีฟู้ด (โอนธนาคาร)', ready: true },
    { id: 'RC-2569-0007', type: 'ใบรับรองแทนใบเสร็จ', entity: '5% ข้าวมันไก่', vendorId: 'papud', amount: 550, date: '1 ส.ค. 69', payee: 'วินมอเตอร์ไซค์ (ค่าส่งของ)', ready: false, missingField: 'เลขบัตรประชาชนผู้รับเงิน' }
  ];

  // ---------- งานรับของ (ตัวอย่าง) ----------
  const receives = [
    {
      id: 'RV-501', vendorId: 'fah', date: 'สั่ง 2 ส.ค. 69 · กำหนดส่งพรุ่งนี้', waitDays: 1,
      lines: [
        { name: 'เนื้อกุ้ง 16/20', ordered: 6, unit: 'กก.', price: 385 },
        { name: 'แซลมอน', ordered: 4, unit: 'กก.', price: 320 },
        { name: 'เนื้อปลาฮอกเกะ', ordered: 3, unit: 'กก.', price: 260 }
      ]
    },
    {
      id: 'RV-500', vendorId: 'salmon', date: 'สั่ง 31 ก.ค. 69 · ค้าง 3 วัน', waitDays: 3,
      lines: [
        { name: 'แซลมอนปาด', ordered: 10, unit: 'กก.', price: 250 },
        { name: 'บราวน์', ordered: 10, unit: 'กก.', price: 230 }
      ]
    }
  ];

  // ---------- กราฟ Dashboard (ตัวอย่าง) ----------
  const exp12 = [
    { m: 'ก.ย.', v: 128400 }, { m: 'ต.ค.', v: 142800 }, { m: 'พ.ย.', v: 131200 }, { m: 'ธ.ค.', v: 168900 },
    { m: 'ม.ค.', v: 152300 }, { m: 'ก.พ.', v: 139800 }, { m: 'มี.ค.', v: 147600 }, { m: 'เม.ย.', v: 156200 },
    { m: 'พ.ค.', v: 149100 }, { m: 'มิ.ย.', v: 160400 }, { m: 'ก.ค.', v: 171800 }, { m: 'ส.ค.', v: 48620 }
  ];
  const vat12 = [
    { m: 'ก.ย.', v: 3210 }, { m: 'ต.ค.', v: 3820 }, { m: 'พ.ย.', v: 3350 }, { m: 'ธ.ค.', v: 4460 },
    { m: 'ม.ค.', v: 3980 }, { m: 'ก.พ.', v: 3540 }, { m: 'มี.ค.', v: 3760 }, { m: 'เม.ย.', v: 4120 },
    { m: 'พ.ค.', v: 3890 }, { m: 'มิ.ย.', v: 4230 }, { m: 'ก.ค.', v: 4580 }, { m: 'ส.ค.', v: 1260 }
  ];
  // ปริมาณซื้อเนื้อสัตว์เดือนนี้ (กก.) — เพิ่ม/ลดชนิดได้ในหน้า Data (อนาคต)
  const meat = [
    { name: 'อกไก่', img: P + 'chicken-breast.webp', qty: 118, color: '#FFB84D' },
    { name: 'หมูสันนอก', img: P + 'pork-sliced.webp', qty: 86, color: '#FF8FA3' },
    { name: 'เนื้อแดงวัว', img: P + 'beef-minced.webp', qty: 54, color: '#74B816' },
    { name: 'แซลมอน', img: P + 'salmon-fillet.webp', qty: 41, color: '#FF9F68' },
    { name: 'กุ้ง', img: P + 'shrimp-large-16-20.webp', qty: 38, color: '#F4845F' },
    { name: 'เป็ดบด', img: P + 'beef-minced.webp', qty: 22, color: '#B08968' }
  ];
  const top5 = [
    { vendorId: 'makro', amount: 18640 },
    { vendorId: 'fah', amount: 12470 },
    { vendorId: 'salmon', amount: 9800 },
    { vendorId: 'ppfood', amount: 6930 },
    { vendorId: 'loy', amount: 4620 }
  ];
  const books = { personal: 48620, biz: 41240, vatIn: 1260 };

  return { vendors, purchases, drafts, receives, exp12, vat12, meat, top5, books };
})();
