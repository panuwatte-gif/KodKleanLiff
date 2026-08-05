-- ============================================================
-- KodKlean Finance LIFF — schema.sql  (Phase 1)
--
-- ⚠️ อัปเดต (สำรวจ Stock Tracker แล้ว): ระบบการเงินมีอยู่แล้วเป็นชุด `fin_*`
--    (fin_vendors, fin_items, fin_purchase_orders/fin_po_items, fin_journal_entries/lines[+book_scope],
--     fin_documents, fin_edit_history, fin_captures[ai_result], fin_payment_events, fin_receive_events,
--     fin_assets, fin_signature_events, fin_number_sequences, fin_accounts[seed 39 บัญชีแล้ว],
--     append-only trigger ครบ) → **ใช้ `fin_*` ต่อ ไม่สร้าง liff_/ตารางไฟล์นี้ซ้ำ**
--    ไฟล์นี้เก็บไว้เป็น "ตัวอ้างอิง data model" เท่านั้น — อย่า apply (จะซ้ำ)
--    สิ่งที่เพิ่มจริงบน fin_*: migration `liff_add_fin_vendor_items`
--      = fin_vendor_items (SKU รายร้าน + maps_to_ingredient_id) + fin_vendor_item_prices
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- ค่าคงที่ / lookup ----------
-- ประตูคัดกรอง (route) — เก็บรหัสในฐานข้อมูลเท่านั้น, หน้าจอแสดงข้อความเต็ม
create table if not exists intake_routes (
  code        text primary key,            -- '1a','1b','2a','2b_transfer','2b_cash_cert','2b_inhouse'
  label_th    text not null,               -- ข้อความเต็มที่โชว์ผู้ใช้
  creates_doc text,                         -- ชนิดเอกสารที่ต้องสร้าง (null = ไม่ต้องสร้าง)
  book_scope  text not null default 'both', -- 'both' | 'inhouse_only'
  split_vat   boolean not null default false,
  sort        int default 0
);

-- ---------- พื้นฐาน ----------
create table if not exists entities (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,               -- ชื่อกิจการ/แบรนด์ในเครือ
  tax_id      text,
  address     text,
  is_default  boolean default false,
  created_at  timestamptz default now()
);

create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  line_user_id  text unique,
  display_name  text,
  is_owner      boolean default false,     -- owner = ผู้อนุมัติ/เซ็น
  signature_url text,                       -- ลายเซ็น (Supabase storage path)
  created_at    timestamptz default now()
);

create table if not exists accounts (
  code        text primary key,            -- เลขบัญชี (ผังบัญชีส่วน G)
  name        text not null,
  type        text not null,               -- asset|liability|equity|revenue|expense
  is_active   boolean default true
);

create table if not exists depreciation_rules (   -- เก็บไว้ ยังไม่ใช้เฟส1
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  method      text default 'straight_line',
  life_years  numeric,
  salvage_pct numeric default 0
);

create table if not exists vendors (
  id                       uuid primary key default gen_random_uuid(),
  name                     text not null,
  channel                  text,           -- 'แชท','สาขา/ออนไลน์' ฯลฯ
  logo_url                 text,
  color                    text,
  buy_frequency            int default 0,  -- ใช้เรียงร้านซื้อบ่อยขึ้นก่อน
  default_expense_account  text references accounts(code),
  default_entity_id        uuid references entities(id),
  default_route            text references intake_routes(code),
  default_shipping_cost    numeric default 0,
  default_box_cost_per_box numeric default 0,
  doc_checklist            jsonb default '[]'::jsonb,  -- ['แคปสั่งของ','สลิปโอน','รูปของ']
  tax_id                   text,
  created_at               timestamptz default now()
);

-- วัตถุดิบมาตรฐาน (ที่ App_stock/App_recipe ใช้) — จุด map กลางที่เดียว
create table if not exists items (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  category_path     text,                  -- 'เนื้อสัตว์/กุ้ง/ใหญ่'
  std_unit          text,                  -- หน่วยมาตรฐาน
  std_yield_percent numeric,               -- เก็บไว้ ยังไม่ประมวลผล
  image_url         text,
  show_in_dashboard boolean default false, -- กราฟปริมาณเนื้อสัตว์ (semi-manual)
  created_at        timestamptz default now()
);

-- SKU ตามหน้าร้านจริง — ฝั่งซื้อบันทึกที่นี่ แล้ว map เข้า items
create table if not exists vendor_items (
  id            uuid primary key default gen_random_uuid(),
  vendor_id     uuid not null references vendors(id) on delete cascade,
  name          text not null,             -- ชื่อเต็มตามร้าน
  spec          text,                      -- '16/20 · NW80%'
  sell_unit     text,                      -- กก./แพ็ค/ตัว
  pack_size     text,                      -- '800g'
  nw_percent    numeric,                   -- ต้นทุนแท้ = price ÷ NW%
  last_price    numeric,
  category      text,
  image_url     text,
  maps_to_item_id uuid references items(id),
  created_at    timestamptz default now()
);

create table if not exists price_history (
  id            uuid primary key default gen_random_uuid(),
  vendor_item_id uuid not null references vendor_items(id) on delete cascade,
  price         numeric not null,
  changed_by    uuid references users(id),
  created_at    timestamptz default now()
);

-- ---------- ไฟล์ + ขาเข้า ----------
create table if not exists files (
  id                 uuid primary key default gen_random_uuid(),
  sha256             text,                  -- กันซ้ำ
  mime               text,
  thumb_supabase_path text,                 -- WebP thumbnail เท่านั้น (ห้ามเก็บต้นฉบับ)
  original_gdrive_id text,                  -- ต้นฉบับอยู่ Google Drive
  drive_sync_status  text default 'pending',-- pending|synced|failed
  created_at         timestamptz default now()
);

create table if not exists captures (
  id          uuid primary key default gen_random_uuid(),
  file_id     uuid references files(id),
  raw_kind    text,                         -- 'chat_screenshot','slip','photo','manual'
  ocr_json    jsonb,                        -- ผล AI vision (ผู้ช่วยกรอก)
  created_by  uuid references users(id),
  created_at  timestamptz default now()
);

-- ตะกร้ารอจับคู่ (required_parts vs collected_parts)
create table if not exists match_groups (
  id              uuid primary key default gen_random_uuid(),
  purchase_id     uuid,
  required_parts  jsonb default '[]'::jsonb,
  collected_parts jsonb default '[]'::jsonb,
  status          text default 'open',      -- open|complete
  created_at      timestamptz default now()
);

-- ---------- หัว-บรรทัด: ซื้อ / จ่าย / รับ ----------
create table if not exists purchases (
  id           uuid primary key default gen_random_uuid(),
  vendor_id    uuid references vendors(id),
  entity_id    uuid references entities(id),
  route        text references intake_routes(code),
  purchase_date date,
  shipping_cost numeric default 0,
  box_cost     numeric default 0,
  subtotal     numeric default 0,
  total        numeric default 0,
  status       text default 'draft',        -- draft|submitted|approved|void
  is_asset     boolean default false,       -- flag ของถาวร (ยังไม่คิดค่าเสื่อม)
  note         text,
  slip_group_id uuid,                        -- สลิปเดียวหลายร้าน → ผูกกลุ่มเดียวกัน
  created_by   uuid references users(id),
  created_at   timestamptz default now()
);

create table if not exists purchase_lines (
  id             uuid primary key default gen_random_uuid(),
  purchase_id    uuid not null references purchases(id) on delete cascade,
  vendor_item_id uuid references vendor_items(id),
  name           text,                       -- snapshot ชื่อ ณ เวลาซื้อ
  qty            numeric,
  unit           text,
  unit_price     numeric,
  line_total     numeric,
  is_asset       boolean default false,
  expense_account text references accounts(code)
);

create table if not exists payments (
  id           uuid primary key default gen_random_uuid(),
  purchase_id  uuid references purchases(id),
  method       text,                         -- transfer|cash
  slip_file_id uuid references files(id),
  payee_name   text,                         -- จากสลิป
  paid_at      date,
  amount       numeric,
  created_at   timestamptz default now()
);

create table if not exists payment_lines (
  id          uuid primary key default gen_random_uuid(),
  payment_id  uuid not null references payments(id) on delete cascade,
  purchase_id uuid references purchases(id),  -- สลิปหลายร้านแตกบรรทัดเข้าร้านของตัวเอง
  amount      numeric
);

create table if not exists receipts (
  id           uuid primary key default gen_random_uuid(),
  purchase_id  uuid references purchases(id),
  received_at  date,
  status       text default 'pending',        -- pending|received|shortage
  created_at   timestamptz default now()
);

create table if not exists receipt_lines (
  id             uuid primary key default gen_random_uuid(),
  receipt_id     uuid not null references receipts(id) on delete cascade,
  purchase_line_id uuid references purchase_lines(id),
  qty_ordered    numeric,
  qty_received   numeric,
  shortage_action text                         -- refill|refund|loss
);

-- ---------- บัญชีคู่ (append-only) — งบทุกตัวมาจากที่นี่ ----------
create table if not exists journal_entries (
  id          uuid primary key default gen_random_uuid(),
  entry_date  date not null default current_date,
  ref_type    text,                          -- purchase|payment|receipt|adjust|reversal
  ref_id      uuid,
  memo        text,
  reverses_id uuid references journal_entries(id),
  created_by  uuid references users(id),
  created_at  timestamptz default now()
);

create table if not exists journal_lines (
  id          uuid primary key default gen_random_uuid(),
  entry_id    uuid not null references journal_entries(id) on delete cascade,
  account_code text not null references accounts(code),
  debit       numeric default 0,
  credit      numeric default 0,
  book_scope  text not null default 'both',  -- both | inhouse_only
  entity_tag  text,                           -- แยกรายแบรนด์ด้วย tag (ไม่เพิ่มเลขบัญชี)
  memo        text
);

create table if not exists vat_lines (
  id         uuid primary key default gen_random_uuid(),
  entry_id   uuid references journal_entries(id),
  type       text not null,                  -- input (ภาษีซื้อ) | output (ภาษีขาย)
  base       numeric not null,
  vat        numeric not null,
  created_at timestamptz default now()
);

-- ---------- สินทรัพย์ (เก็บ flag เท่านั้นเฟส1) ----------
create table if not exists assets (
  id            uuid primary key default gen_random_uuid(),
  purchase_id   uuid references purchases(id),
  name          text,
  is_asset      boolean default true,
  cost          numeric,
  depre_rule_id uuid references depreciation_rules(id),  -- ยังไม่คำนวณ
  created_at    timestamptz default now()
);

-- ---------- เอกสาร + ลายเซ็น ----------
create table if not exists documents (
  id          uuid primary key default gen_random_uuid(),
  type        text not null,                 -- payment_voucher | receipt_cert
  doc_no      text,
  entity_id   uuid references entities(id),
  purchase_id uuid references purchases(id),
  payload     jsonb,                          -- ฟิลด์เอกสารตามคู่มือสรรพากร
  status      text default 'draft',           -- draft|signed|void
  missing_fields jsonb default '[]'::jsonb,
  replaces_id uuid references documents(id),  -- ใบใหม่แทนใบเก่า
  created_at  timestamptz default now()
);

create table if not exists signature_events (   -- append-only
  id          uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id),
  signed_by   uuid references users(id),
  doc_hash    text,                           -- hash เอกสาร ณ เวลาเซ็น
  signed_at   timestamptz default now()
);

-- ---------- กันพัง ----------
create table if not exists edit_history (       -- append-only — ประวัติทุกรายการ
  id          uuid primary key default gen_random_uuid(),
  table_name  text not null,
  row_id      uuid not null,
  action      text not null,                  -- create|update|reversal|void
  before_json jsonb,
  after_json  jsonb,
  changed_by  uuid references users(id),
  created_at  timestamptz default now()
);

create table if not exists auto_decisions (
  id          uuid primary key default gen_random_uuid(),
  ref_type    text,
  ref_id      uuid,
  decided     text,                           -- route ที่ AI เดา
  confidence  numeric,
  reason      text,
  created_at  timestamptz default now()
);

create table if not exists number_sequences (
  key         text primary key,               -- 'PV-2569','RC-2569'
  current     bigint not null default 0
);

-- ============================================================
-- SEED: ประตูคัดกรอง (route) — หน้าจอแสดง label_th, ห้ามโชว์ code
-- ============================================================
insert into intake_routes (code, label_th, creates_doc, book_scope, split_vat, sort) values
  ('1a','มีใบกำกับภาษี (มี VAT)',            null,            'both', true, 1),
  ('1b','มีบิล / ใบเสร็จ (ไม่มี VAT)',        null,            'both', false, 2),
  ('2a','มีแค่สลิปโอน',                       'payment_voucher','both', false, 3),
  ('2b_transfer','ไม่มีเอกสาร · จ่ายด้วยการโอน (มีสลิป)', 'payment_voucher','both', false, 4),
  ('2b_cash_cert','ไม่มีเอกสาร · จ่ายสด ค่าเดินทางเล็กน้อย','receipt_cert','both', false, 5),
  ('2b_inhouse','ไม่มีเอกสาร · จ่ายสด พิสูจน์ผู้รับไม่ได้', null, 'inhouse_only', false, 6)
on conflict (code) do nothing;

-- ============================================================
-- SEED: ผังบัญชีชุดสะอาด (DATA_MODEL ส่วน G) — ห้ามชื่อซ้ำ
-- ============================================================
insert into accounts (code, name, type) values
  ('1000','เงินสด','asset'),('1010','ธนาคาร','asset'),('1030','จ่ายล่วงหน้า','asset'),
  ('1040','สินค้าคงเหลือ','asset'),('1050','ภาษีซื้อ','asset'),('1060','ลูกหนี้ platform','asset'),
  ('1070','ลูกหนี้เงินคืนร้าน','asset'),('1080','เจ้าหนี้พนง.สำรองจ่าย','asset'),
  ('1500','สินทรัพย์ถาวร-อุปกรณ์','asset'),('1510','สินทรัพย์ถาวร-เครื่องใช้สนง.','asset'),
  ('1590','ค่าเสื่อมสะสม','asset'),
  ('2000','เจ้าหนี้การค้า','liability'),('2010','เจ้าหนี้บัตร','liability'),
  ('2020','ภาษีขาย','liability'),('2040','VAT ค้างชำระ','liability'),
  ('3000','ทุน/ส่วนของหุ้นส่วน','equity'),('3020','เงินถอนเจ้าของ','equity'),('3030','กำไรสะสม','equity'),
  ('4010','รายได้ขาย-platform','revenue'),('4040','ขายตรง/B2B','revenue'),
  ('4050','ขายซอส','revenue'),('4900','รายได้อื่น','revenue'),
  ('5010','ต้นทุนขาย-วัตถุดิบ','expense'),('5020','บรรจุภัณฑ์/ลังโฟม','expense'),
  ('5030','ค่า GP platform','expense'),('5040','ค่าโฆษณา/การตลาด','expense'),
  ('5050','ค่าขนส่ง/เดินทาง','expense'),('5060','ค่าเช่า','expense'),('5070','ค่าน้ำ-ไฟ','expense'),
  ('5080','เงินเดือน/ค่าแรง','expense'),('5110','ของเสีย/สูญหาย','expense'),
  ('5310','ค่าเสื่อมราคา','expense'),('5320','ค่าธรรมเนียมธนาคาร','expense'),
  ('5900','ค่าใช้จ่ายเบ็ดเตล็ด','expense')
on conflict (code) do nothing;

-- ============================================================
-- APPEND-ONLY: บล็อก UPDATE/DELETE บน journal / signature / edit_history
-- (แก้บัญชี = ลง reversal ใหม่ / เซ็นแล้ว = ออกใบใหม่)
-- ============================================================
create or replace function kk_block_mutation() returns trigger
language plpgsql as $$
begin
  raise exception 'append-only table: % ห้าม UPDATE/DELETE (ใช้ reversal/ใบใหม่แทน)', tg_table_name;
end $$;

do $$
declare t text;
begin
  foreach t in array array['journal_entries','journal_lines','signature_events','edit_history'] loop
    execute format('drop trigger if exists kk_ao_%1$s on %1$s', t);
    execute format('create trigger kk_ao_%1$s before update or delete on %1$s
                    for each row execute function kk_block_mutation()', t);
  end loop;
end $$;

-- ============================================================
-- RLS: เปิดทุกตาราง — ผู้ใช้ที่ login (authenticated) เข้าถึงได้
-- (เฟส1 ผู้ใช้ = เจ้าของ 2 คน; นโยบายละเอียดต่อ entity เพิ่มทีหลังได้)
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array[
    'entities','users','accounts','depreciation_rules','vendors','items','vendor_items',
    'price_history','files','captures','match_groups','purchases','purchase_lines',
    'payments','payment_lines','receipts','receipt_lines','journal_entries','journal_lines',
    'vat_lines','assets','documents','signature_events','edit_history','auto_decisions',
    'number_sequences','intake_routes'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists kk_rw on %I', t);
    execute format($p$create policy kk_rw on %I for all to authenticated using (true) with check (true)$p$, t);
  end loop;
end $$;

-- END schema.sql
