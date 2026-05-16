import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

const PROMPT_TEMPLATE = `你是一個旅遊確認信解析助手。
從以下 email 原文中，精確提取航班或飯店訂單資料，以 JSON 格式回傳。

規則：
- 無法確定的欄位一律填入 "待確認"，不要猜測
- 日期格式統一為 YYYY-MM-DD
- 時間格式統一為 HH:MM
- 只回傳 JSON，不要有其他說明文字

若是航班，回傳：
{"type":"flight","airline":"","flightNumber":"","date":"","departure":{"airport":"","terminal":"","time":""},"arrival":{"airport":"","terminal":"","time":""},"seatBen":"","seatKelly":"","bookingRef":"","baggageAllowance":""}

若是飯店，回傳：
{"type":"hotel","name":"","checkIn":"","checkOut":"","roomType":"","bookingRef":"","cancellationDeadline":""}

確認信內容：
---
EMAIL_CONTENT
---

只回傳 JSON。`

export async function parseConfirmationEmail(emailText) {
  const prompt = PROMPT_TEMPLATE.replace('EMAIL_CONTENT', emailText)
  const result = await model.generateContent(prompt)
  const raw = result.response.text().trim()
  const jsonStr = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  return JSON.parse(jsonStr)
}
