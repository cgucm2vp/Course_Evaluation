# 網站搬遷告示 (Course Evaluation Migration Notice)

長庚大學中醫學會課程評價與指引系統 - 舊站 GitHub Pages 搬遷告示頁面。

## 本地開發 (Local Development)

```bash
# 安裝依賴
npm install

# 啟動本地開發伺服器
npm run dev
```

## GitHub Secret 配置

請於 GitHub Repository (Settings -> Secrets and variables -> Actions) 新增以下 Secret：
- `VITE_NEW_SITE_URL`: 新網站的完整 URL (例如: `https://your-new-website.com`)
