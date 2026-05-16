# Trip Planner — CLAUDE.md

## 專案定位
這是一個多人共編的旅遊行程規劃 web app。
核心功能：行程追蹤、交通訂單管理、靈感池、email 自動解析。

## 技術棧
- Frontend: React + Vite + Tailwind CSS
- Backend/DB: Supabase (PostgreSQL + Realtime)
- Deploy: Vercel
- 不使用 Next.js，保持簡單

## UI 設計規則（不可更動）
- 顏色系統：
  - pending 狀態: background #FAEEDA, text #633806, border #FAC775
  - booked 狀態: background #EAF3DE, text #27500A, border #C0DD97
  - 靈感池主色: #534AB7 / #EEEDFE
- 字體：系統預設 sans-serif，標題用 serif
- 所有卡片：border 0.5px，border-radius 8-12px，flat design，無陰影
- Mobile-first：最大寬度 480px，padding 16px

## 資料架構規則
- 每個行程是一個獨立的 trip record，用 trip_id 區分
- TripConfig 和實際資料（訂單狀態、備註、靈感池）分開存
- TripConfig 是靜態設定（航班、飯店、交通選項）
- 動態資料（已訂/未訂、備註、靈感池項目）存 Supabase
- 新行程只需要新增一個 TripConfig，不改任何 engine 程式碼

## 提交者機制
- 每個寫入操作都要記錄 updated_by（Ben 或 Kelly）
- 不需要登入系統，用簡單的本地選擇即可
- 每次操作在 action 發生時選擇提交者，不是全域狀態

## Email 解析規則
當使用者貼上或上傳確認信時，優先抓取：
- 航班：航班號、日期、出發/抵達時間、航站、座位號、訂單號、行李額度
- 飯店：飯店名稱、check-in/out 日期、房型、訂單號、取消政策截止日
- 以上資料自動填入對應的 TripConfig 欄位
- 無法確定的欄位標記為 "待確認"，不要猜測

## 絕對不能動的功能
- 靈感池（inspiration pool）：核心功能，必須保留
- 提交者選擇（Ben/Kelly）：每個寫入動作的 whoBar
- 靈感池匯出文字功能：讓使用者可以複製內容貼給 Claude 討論
- 備份/還原 JSON：作為 offline 備用機制保留

## 效能規則
- Supabase realtime subscription 只在 app 開著時維持
- 靈感池 items 不超過 100 筆時不需要 pagination
- 避免不必要的 re-render

## 錯誤處理
- 所有 Supabase 操作都要 try/catch
- 網路失敗時顯示友善訊息，不 crash
- 保留本地 state 作為 optimistic update

