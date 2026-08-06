/* ============================================================
   config.js — ตั้งค่าเชื่อมระบบจริง (แก้ที่นี่ที่เดียว)
   ถ้ายังไม่กรอก LIFF_ID → แอปรันโหมด "สาธิต" (demo) อัตโนมัติ ไม่พัง
   ------------------------------------------------------------
   ต้องกรอก 1 ค่าเท่านั้นเพื่อเริ่มใช้จริง: LIFF_ID
   (SUPABASE_URL / ANON_KEY / FN ใส่ให้แล้ว ชี้ไป project "Stock Tracker")
   ============================================================ */
window.KK_CONFIG = {
  // 1) เอามาจาก LINE Developers Console → LIFF → LIFF ID (รูปแบบ 1234567890-abcdefgh)
  LIFF_ID: '2010990360-t2BNXL84',

  // 2) Supabase (ตั้งให้แล้ว — ไม่ต้องแก้)
  SUPABASE_URL: 'https://qxhvmrxbrrweundfspzp.supabase.co',
  ANON_KEY: 'sb_publishable_Lwu-iFC-U7VWXkEyEO9Azg_4SJmm_J1',

  // 3) ประตูเรียก backend (kk-finance-line) — ไม่ต้องแก้
  FN_GATEWAY: 'https://qxhvmrxbrrweundfspzp.supabase.co/functions/v1/kk-finance-line',
};
