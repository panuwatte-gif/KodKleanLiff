/* ============================================================
   sw.js — Service Worker ของ KodKlean_Money (ทำให้ติดตั้งเป็นแอปบนหน้าจอได้ + เปิดตอนเน็ตหลุดได้)
   กติกา:
   - ไฟล์โค้ด (.html/.js/.json) = เอาจากเน็ตก่อนเสมอ → อัปเดตใหม่เห็นทันที ไม่ค้างของเก่า
   - รูปภาพ/ฟอนต์ = เอาจากแคชก่อน → เปิดไว รูปไม่กระพริบ
   - เรียก backend (supabase/line) = ไม่ยุ่ง ปล่อยผ่านตรงๆ
   เวลาปล่อยเวอร์ชันใหม่: แก้เลข CACHE_V ข้างล่าง 1 ตัว แล้ว deploy — แคชเก่าถูกล้างอัตโนมัติ
   ============================================================ */
const CACHE_V = 'kk-money-v17';
const SHELL = [
  './',
  './index.html',
  './KodKlean_LIFF.dc.html',
  './support.js',
  './data.js',
  './config.js',
  './kk-helpers.js',
  './manifest.webmanifest',
  './assets/app/icon-192.png',
  './assets/app/icon-512.png',
  './assets/login/bg.webp',
  './assets/login/logo.webp',
  './assets/login/mascot.webp',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_V).then((c) => c.addAll(SHELL).catch(() => null)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_V).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => { if (e.data === 'skip-waiting') self.skipWaiting(); });

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // backend/CDN ปล่อยผ่าน
  const isAsset = /\.(png|jpe?g|webp|gif|svg|woff2?|ttf|ico)$/i.test(url.pathname);

  if (isAsset) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_V).then((c) => c.put(req, copy));
        return res;
      }).catch(() => hit))
    );
    return;
  }

  e.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE_V).then((c) => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || caches.match('./KodKlean_LIFF.dc.html')))
  );
});
