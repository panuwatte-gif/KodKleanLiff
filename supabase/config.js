/* ============================================================
   config.js — ตั้งค่าเชื่อมระบบจริง (แก้ที่นี่ที่เดียว)
   ------------------------------------------------------------
   เข้าแอปด้วย "รหัสผ่าน" แล้ว (ไม่ใช้ LINE Login เป็นทางหลักอีก)
   · รหัสตั้งต้น 4065 — เปลี่ยนได้ในแอปที่หน้า ตั้งค่า › เปลี่ยนรหัสผ่านแอป
   · รหัสเก็บแบบเข้ารหัส (sha256) ที่ Supabase → เปลี่ยนที่เครื่องไหนก็มีผลทั้ง 2 เครื่อง
   ค่าข้างล่างตั้งให้ครบแล้ว ไม่ต้องแก้อะไร
   ============================================================ */
window.KK_CONFIG = {
  // Supabase (project "Stock Tracker")
  SUPABASE_URL: 'https://qxhvmrxbrrweundfspzp.supabase.co',
  ANON_KEY: 'sb_publishable_Lwu-iFC-U7VWXkEyEO9Azg_4SJmm_J1',

  // ประตูเรียก backend (kk-finance-line)
  FN_GATEWAY: 'https://qxhvmrxbrrweundfspzp.supabase.co/functions/v1/kk-finance-line',

  // เผื่ออนาคตอยากเปิดผ่านแอป LINE อีกครั้ง (ตอนนี้ไม่ใช้แล้ว — เว้นว่างได้)
  LIFF_ID: '',
};
