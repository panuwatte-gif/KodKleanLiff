/* ============================================================
   kk-helpers.js — โมดูลช่วย "ไม่มี state" ของ KodKlean LIFF
   - ปฏิทินไทย + แปลงวันที่ไทย (หน้า สมุดบันทึก)
   - กฎคัดกรองตั้งต้น + ตัวผูกสูตรบัญชีอัตโนมัติ (ส่วนที่ล็อก ห้ามแก้)
   - สรุปข้อมูลโหมดสาธิต (ปฏิทิน/งบ 2 ชุด คำนวณจากรายการในเครื่อง)
   - ส่งออก CSV (เปิดใน Excel ได้) + ZIP หลักฐานทั้งเดือน
   หมายเหตุเจ้าของ: แก้ "ข้อความกฎ" ในแอป (หน้า กฎคัดกรอง) ไม่ต้องแก้ไฟล์นี้
   ============================================================ */
window.KK_HELPERS = (function () {
  const TH_M = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const TH_M_FULL = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const pad = (n) => String(n).padStart(2, '0');
  const isoOf = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  function todayIso() { return isoOf(new Date()); }
  function thisYm() { return todayIso().slice(0, 7); }
  function ymLabel(ym) { const [y, m] = ym.split('-').map(Number); return TH_M_FULL[m - 1] + ' ' + (y + 543); }
  function ymShort(ym) { const m = +ym.split('-')[1]; return TH_M[m - 1]; }
  function dayLabel(iso) { const [y, m, d] = iso.split('-').map(Number); return d + ' ' + TH_M[m - 1] + ' ' + String(y + 543).slice(2); }
  function addMonths(ym, n) { const [y, m] = ym.split('-').map(Number); const d = new Date(y, m - 1 + n, 1); return d.getFullYear() + '-' + pad(d.getMonth() + 1); }

  // ตารางปฏิทิน 42 ช่อง (อา-ส)
  function monthGrid(ym) {
    const [y, m] = ym.split('-').map(Number);
    const first = new Date(y, m - 1, 1);
    const start = new Date(y, m - 1, 1 - first.getDay());
    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      cells.push({ iso: isoOf(d), day: d.getDate(), inMonth: d.getMonth() === m - 1 });
    }
    return cells;
  }

  // แปลง '2 ส.ค. 69' / 'วันนี้' / 'เมื่อวาน' → ISO (ใช้กับข้อมูลตัวอย่างเก่า)
  function parseThaiDate(s) {
    if (!s) return null;
    if (s.indexOf('วันนี้') >= 0) return todayIso();
    if (s.indexOf('เมื่อวาน') >= 0) { const d = new Date(); d.setDate(d.getDate() - 1); return isoOf(d); }
    const m = String(s).match(/(\d{1,2})\s*([ก-ฮ]+\.?[ก-ฮ]*\.?)\s*(\d{2,4})/);
    if (!m) return null;
    const mi = TH_M.findIndex((x) => x.replace(/\./g, '') === m[2].replace(/\./g, ''));
    if (mi < 0) return null;
    let y = +m[3]; if (y < 100) y += 2500; if (y > 2400) y -= 543;
    return y + '-' + pad(mi + 1) + '-' + pad(+m[1]);
  }

  /* ---------- กฎคัดกรอง ----------
     ส่วนที่เจ้าของ "แก้ได้": title/desc/doc/vat/book/ลำดับ/เพิ่ม-ลบกฎ (เก็บใน fin_rules + localStorage)
     ส่วนที่ "ล็อก": backendRoute + journalPreview = ตัวผูกสูตรเดบิต-เครดิต/VAT อัตโนมัติ */
  function defaultRules() {
    return [
      { id: 'tax', group: 'main', title: 'มีใบกำกับภาษี (มี VAT)', desc: 'ไม่ต้องสร้างเอกสารเพิ่ม · แยกภาษีซื้อเก็บให้', doc: 'none', vat: true, book: 'both' },
      { id: 'bill', group: 'main', title: 'มีบิล / ใบเสร็จ (ไม่มี VAT)', desc: 'ไม่ต้องสร้างเอกสารเพิ่ม', doc: 'none', vat: false, book: 'both' },
      { id: 'slip', group: 'main', title: 'มีแค่สลิปโอน', desc: 'พบบ่อยสุด · ระบบสร้างใบสำคัญจ่ายให้', doc: 'pv', vat: false, book: 'both' },
      { id: 'none_transfer', group: 'none', title: 'โอนเงิน (มีสลิป)', desc: 'พิสูจน์ผู้รับได้ → ระบบสร้างใบสำคัญจ่าย · ลงภาษีได้', doc: 'pv', vat: false, book: 'both' },
      { id: 'none_cashid', group: 'none', title: 'จ่ายสด · ระบุชื่อผู้รับได้', desc: 'เช่น วิน/ค่าส่ง/แผงลอย → ใบรับรองแทนใบเสร็จ · กรอกแค่ชื่อผู้รับ ไม่ต้องใช้เลขบัตร · ลงภาษีได้', doc: 'cert', vat: false, book: 'both' },
      { id: 'none_cash_pvcert', group: 'none', title: 'จ่ายสด · ไม่มีบิลเลย (ค่าเดินทาง/ค่าส่ง)', desc: 'ระบบออกให้ 2 ใบ: ใบสำคัญจ่าย + ใบรับรองแทนใบเสร็จ · ต้องเซ็นอนุมัติก่อนปิดงาน · ลงภาษีได้', doc: 'pv_cert', vat: false, book: 'both' },
      { id: 'none_cashno', group: 'none', title: 'จ่ายสด · พิสูจน์ผู้รับไม่ได้เลย', desc: 'เข้าเฉพาะงบส่วนตัว ระบบกันไม่ให้เข้างบจำลองนิติ', doc: 'none', vat: false, book: 'inhouse' },
    ];
  }
  const DOC_LABEL = { none: 'ไม่สร้างเอกสารเพิ่ม', pv: 'ใบสำคัญจ่าย', cert: 'ใบรับรองแทนใบเสร็จ', pv_cert: 'ใบสำคัญจ่าย + ใบรับรองแทนใบเสร็จ' };
  function docLabel(r) { return DOC_LABEL[r.doc] || DOC_LABEL.none; }
  function bookLabel(r) { return r.book === 'inhouse' ? 'เฉพาะงบส่วนตัว' : 'เข้าทั้ง 2 งบ'; }
  function ruleResult(r) {
    if (r.doc === 'pv_cert') return 'ระบบสร้าง "ใบสำคัญจ่าย" + "ใบรับรองแทนใบเสร็จ" ให้ครบทั้ง 2 ใบ — กรอกแค่ชื่อผู้รับ แล้วเซ็นอนุมัติ';
    if (r.doc === 'pv') return 'ระบบสร้าง "ใบสำคัญจ่าย" ให้อัตโนมัติ + แนบหลักฐาน';
    if (r.doc === 'cert') return 'ระบบสร้าง "ใบรับรองแทนใบเสร็จ" — กรอกแค่ชื่อผู้รับ (ไม่ต้องใช้เลขบัตร)';
    if (r.book === 'inhouse') return 'บันทึกเข้าเฉพาะงบส่วนตัว (ระบบกันอัตโนมัติ)';
    if (r.vat) return 'ไม่สร้างเอกสารเพิ่ม + แยกภาษีซื้อเข้า VAT (ใช้ในงบจำลองนิติ)';
    return 'ใช้เอกสารจากร้านเป็นหลักฐานได้เลย ไม่สร้างเอกสารเพิ่ม';
  }
  function ruleIcon(r) {
    if (r.doc === 'pv_cert') return 'assets/icons/icon_payment_slip.webp';
    if (r.vat) return 'assets/icons/icon_tax_invoice.webp';
    if (r.doc === 'pv') return 'assets/icons/icon_payment_slip.webp';
    if (r.doc === 'cert') return 'assets/icons/icon_tax_invoice.webp';
    if (r.book === 'inhouse') return 'assets/icons/icon_warning.webp';
    return 'assets/icons/icon_document_folder.webp';
  }
  // 🔒 ล็อก: กฎ → รหัส route ฝั่งบัญชี (สูตรเดบิต-เครดิตจริงอยู่ backend journal.ts)
  function backendRoute(r) {
    if (!r) return '2b_inhouse';
    if (r.vat) return '1a';
    if (r.book === 'inhouse') return '2b_inhouse';
    if (r.doc === 'pv_cert') return '2b_both';
    if (r.doc === 'pv') return '2a';
    if (r.doc === 'cert') return '2b_travel';
    return '1b';
  }
  // 🔒 ล็อก: ตัวอย่างบรรทัดบัญชีที่ระบบจะลง (แสดงใน CASE view — สูตรเดียวกับ backend)
  function journalPreview(route, total, isAsset) {
    const f = (n) => Math.round(n * 100) / 100;
    if (isAsset) return [
      { name: 'สินทรัพย์ถาวร-อุปกรณ์ (งบนิติ)', dr: total, cr: 0 },
      { name: 'ธนาคาร (งบนิติ)', dr: 0, cr: total },
      { name: 'ค่าใช้จ่ายทันที (งบร้าน)', dr: total, cr: 0 },
      { name: 'ธนาคาร (งบร้าน)', dr: 0, cr: total },
    ];
    if (route === '1a') { const vat = f(total - total / 1.07); return [
      { name: 'สินค้า/ค่าใช้จ่ายตามหมวด (สุทธิ)', dr: f(total - vat), cr: 0 },
      { name: 'ภาษีซื้อ 7%', dr: vat, cr: 0 },
      { name: 'ธนาคาร/เงินสด', dr: 0, cr: total },
    ]; }
    const nm = route === '2b_inhouse' ? ' (เฉพาะงบส่วนตัว)' : '';
    return [
      { name: 'สินค้า/ค่าใช้จ่ายตามหมวด' + nm, dr: total, cr: 0 },
      { name: 'ธนาคาร/เงินสด' + nm, dr: 0, cr: total },
    ];
  }

  /* ---------- โหมดสาธิต: สรุปเดือนจากรายการในเครื่อง ---------- */
  function demoMonth(purchases, ym) {
    const rows = (purchases || []).map((p) => ({ p, iso: p.iso || parseThaiDate(p.date) }))
      .filter((x) => x.iso && x.iso.slice(0, 7) === ym);
    const days = {};
    rows.forEach((x) => { const d = days[x.iso] = days[x.iso] || { n: 0, total: 0 }; d.n++; d.total += x.p.total || 0; });
    return { rows, days };
  }

  /* ---------- CSV (BOM ให้ Excel อ่านไทยได้) ---------- */
  function csv(rows) {
    const esc = (s) => '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"';
    return '\ufeff' + rows.map((r) => r.map(esc).join(',')).join('\r\n');
  }
  function download(name, blob) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  }

  /* ---------- ZIP (แบบ store ไม่บีบอัด — พอสำหรับรวมหลักฐาน) ---------- */
  const CRC_T = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(u8) { let c = 0xffffffff; for (let i = 0; i < u8.length; i++) c = CRC_T[(c ^ u8[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
  function dataUrlBytes(url) {
    const b64 = url.split(',')[1] || '';
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  }
  function makeZip(files) { // files: [{name, data:Uint8Array}]
    const enc = new TextEncoder(); const parts = []; const central = []; let offset = 0;
    const u16 = (n) => new Uint8Array([n & 255, (n >> 8) & 255]);
    const u32 = (n) => new Uint8Array([n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255]);
    files.forEach((f) => {
      const name = enc.encode(f.name); const crc = crc32(f.data); const sz = f.data.length;
      const head = [u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0), u32(crc), u32(sz), u32(sz), u16(name.length), u16(0)];
      head.forEach((h) => parts.push(h)); parts.push(name, f.data);
      const cen = [u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0), u32(crc), u32(sz), u32(sz), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset)];
      cen.forEach((c) => central.push(c)); central.push(name);
      offset += 30 + name.length + sz;
    });
    let cenSize = 0; central.forEach((c) => (cenSize += c.length));
    const end = [u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(cenSize), u32(offset), u16(0)];
    return new Blob([...parts, ...central, ...end], { type: 'application/zip' });
  }

  return { TH_M, todayIso, thisYm, ymLabel, ymShort, dayLabel, addMonths, monthGrid, parseThaiDate,
    defaultRules, docLabel, bookLabel, ruleResult, ruleIcon, backendRoute, journalPreview,
    demoMonth, csv, download, dataUrlBytes, makeZip };
})();
