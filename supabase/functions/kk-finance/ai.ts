// ai.ts — OCR อ่านบิล/สลิป ด้วย Google Gemini (แทน Claude — ถูกกว่าหลายเท่า)
// ⚠️ ไฟล์นี้ = ตัวแทน ai.ts ตัวเดิมใน kk-finance (ตัวเดิมใช้ Anthropic/Claude)
//    วิธีใช้: วางทับ supabase/functions/kk-finance/ai.ts แล้ว redeploy kk-finance ทั้ง bundle
//    (ต้อง checkout ไฟล์อื่นครบก่อน — index/db/files/drive/queries/flow/journal/docs)
// secret ที่ใช้: GEMINI_API_KEY (ไม่มี = คืน available:false ให้ประตู fallback → กรอกมือ, never block)
// SlipOK ไม่ใช้ (เป็นบริการฝั่งคนขาย ไม่เกี่ยวฝั่งซื้อ)
export async function ocrImage({ image_b64, mime = 'image/jpeg', hint = '' }: any) {
  const key = Deno.env.get('GEMINI_API_KEY');
  if (!key) return { available: false, note: 'no GEMINI_API_KEY — ประตูจะใช้ fallback หรือให้กรอกเอง' };
  if (!image_b64) return { available: true, error: 'no image' };
  const clean = image_b64.includes(',') ? image_b64.split(',')[1] : image_b64;
  const model = Deno.env.get('GEMINI_MODEL') || 'gemini-2.0-flash';
  const prompt = `คุณคืองานคัดกรองเอกสารการเงินร้านอาหารไทย อ่านรูปแล้วตอบ JSON เท่านั้น (ไม่มี markdown ไม่มีคำอธิบาย):
{"doc_kind":"tax_invoice|receipt|slip|order_screenshot|goods_photo|other","vendor_name":"ชื่อร้าน/ผู้รับเงิน","tax_id":"เลขผู้เสียภาษี13หลักหรือnull","date":"YYYY-MM-DD หรือ null","total":ยอดรวมตัวเลข,"vat_amount":ยอดVATหรือ0,"line_count":จำนวนรายการ,"is_multi_store":true ถ้าสลิปจ่ายหลายร้าน(เช่น Shopee หลายร้าน),"stores":[{"name":"...","amount":0}],"asset_suspect":true ถ้าน่าจะเป็นของใช้ถาวร/อุปกรณ์(ตู้เย็น เครื่องครัวใหญ่),"suggest_route":"1a|1b|2a|2b","confidence":0-100}
กติกา: ใบกำกับภาษีเต็มรูปมี VAT=1a / บิลเงินสด-ใบเสร็จไม่มีVAT=1b / สลิปโอน=2a / อ่านไม่ออก=2b ${hint}`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [
          { inline_data: { mime_type: mime, data: clean } },
          { text: prompt },
        ] }],
        generationConfig: { temperature: 0, maxOutputTokens: 1024, responseMimeType: 'application/json' },
      }),
    });
  } catch (e) {
    return { available: true, error: 'Gemini network: ' + String(e?.message || e) };
  }
  if (!res.ok) return { available: true, error: 'Gemini error: ' + (await res.text()).slice(0, 300) };
  const j = await res.json();
  const text = j.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('') || '';
  try {
    const m = text.match(/\{[\s\S]*\}/);
    return { available: true, result: JSON.parse(m ? m[0] : text) };
  } catch {
    return { available: true, error: 'parse failed', raw: text };
  }
}
