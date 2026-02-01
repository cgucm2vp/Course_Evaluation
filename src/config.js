/**
 * 前端配置檔
 * 維護者可以在這裡更改 Google Apps Script API URL
 */

const config = {
    // Google Apps Script Web App URL
    // 從環境變數讀取 (GitHub Secrets / .env)
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
    // 應用程式設定
    APP_NAME: '課程指引與評鑑查詢系統',
    USER_MANUAL_URL: 'https://drive.google.com/drive/folders/1a6hkCm-nAiMo0fNq00_1AmscYg-vp6Tp?usp=drive_link', // 請在此處替換為實際的操作手冊下載連結

    // 本地儲存鍵名
    STORAGE_KEYS: {
        USER: 'course_eval_user',
        TOKEN: 'course_eval_token',
        REMEMBERED_ACCOUNT: 'course_eval_remembered'
    },

    // 資源中心 - 相關連結 (對應排版圖)
    QUICK_LINKS: {
        BANNER_RIGHT: { title: '系學會相關連結', color: '#862D2D' },
        BANNER_LEFT: { title: '課務行政單位與中醫系相關連結', color: '#862D2D' },
        GROUPS: [
            {
                id: 1, side: 'right', text: '系學會',
                links: [{ name: '系學會網站', url: 'https://sites.google.com/view/cgucmstudent/%E9%A6%96%E9%A0%81?authuser=0' },
                { name: '系學會IG帳號', url: 'https://www.instagram.com/cgu_cm/' },
                { name: '系學會FB粉絲專頁', url: 'https://www.facebook.com/cgu.cmed.sa.tw/?locale=zh_TW' }]
            },
            {
                id: 2, side: 'right', text: '會長/副會長',
                links: [{ name: '系學會辦公室借用表單', url: 'https://docs.google.com/forms/d/e/1FAIpQLScgYP12d7iEDi62UM6B9_EhhJghRKca9743Y14bO6k7sijF7A/viewform?usp=dialo' },
                { name: '系學會辦公室借用紀錄查詢', url: 'https://docs.google.com/spreadsheets/d/1NTBWbQdzTgNTTqf8_Qn_sjRLU3hAgg_vqfX9aPrKywI/edit?usp=sharing' },
                { name: '中醫系學會小樹洞', url: 'https://forms.gle/Gs5WD8jWZjhtCmjt7' },
                { name: '系學會意見回饋表單', url: 'https://docs.google.com/forms/d/e/1FAIpQLSeoa8mpMqOafADUQWC2Il8LO43ke93IjzDo804Y_zOv3rqyAQ/viewform' }]
            },
            {
                id: 3, side: 'right', text: '教學部',
                links: [{ name: '教學部IG帳號', url: 'https://www.instagram.com/cgucm_edu/' },
                { name: '教學部網站', url: 'https://sites.google.com/view/cgucm-education/%E9%A6%96%E9%A0%81?authuser=0' }]
            },
            {
                id: 4, side: 'right', text: '國事部',
                links: [{ name: '國事部IG帳號', url: 'https://www.instagram.com/cgucm_internationalaffairs/' },
                { name: '國事部FB粉絲專頁', url: 'https://www.facebook.com/cgucmksb/?locale=zh_TW' }]
            },
            {
                id: 5, side: 'right', text: '藥園部',
                links: [{ name: '小藥園IG帳號', url: 'https://www.instagram.com/cmherbgarden/' },
                { name: '小藥園改造IG帳號', url: 'https://www.instagram.com/cgucmsmallgarden/' }
                ]
            },
            {
                id: 6, side: 'right', text: '學術部',
                links: [{ name: '學術部IG帳號', url: 'https://www.instagram.com/cgucm_academic/' }]
            },
            {
                id: 7, side: 'right', text: '體器部',
                links: [{ name: '系學會財產借用表單', url: 'https://docs.google.com/forms/d/e/1FAIpQLSeoat09sA1eKfEWx5bRZSazaxjjURF8kS_ib9xJqvfxTKtVnA/viewform?usp=dialog' },
                { name: '系學會財產借用紀錄查詢', url: 'https://docs.google.com/spreadsheets/d/1NeZc938jz_6jwmFqAD40LN3ta7ij8BfF-156M655X4k/edit?usp=sharing' }
                ]
            },
            {
                id: 8, side: 'right', text: '中醫營/中醫週',
                links: [{ name: '中醫營IG帳號', url: 'https://www.instagram.com/cgucmcamp/' },
                { name: '中醫營FB粉絲專頁', url: 'https://www.facebook.com/2023cgucmcamp?locale=zh_TW' },
                { name: '中醫週FB粉絲專頁', url: 'https://www.facebook.com/profile.php?id=100064155604150&locale=zh_TW' }
                ]
            },
            // 下方組
            {
                id: 9, side: 'left', text: '選課系統',
                links: [{ name: 'iCGU', url: 'https://i.cgu.edu.tw/' },
                ]
            },
            {
                id: 10, side: 'left', text: '課務行政單位',
                links: [{ name: '長庚大學網站', url: 'https://www.cgu.edu.tw/' },
                { name: '教務處網站', url: 'https://www.cgu.edu.tw/academic' },
                { name: '通識中心網站', url: 'https://www.cgu.edu.tw/ge' }]
            },
            {
                id: 11, side: 'left', text: '中醫系',
                links: [{ name: '中醫系網站', url: 'https://www.cgu.edu.tw/cm' },
                { name: '中醫系FB粉絲專頁', url: 'https://www.facebook.com/cgutcm/?locale=zh_TW' },
                { name: '中醫藥教學館FB粉絲專頁', url: 'https://www.facebook.com/cgutcmeducenter?locale=zh_TW' }
                ]
            },
        ]

    },

    // 資源中心 - 檔案櫃 (下載專區)
    FILE_CABINET: [
        {
            category: '通識課程/深耕學園相關文件',
            files: [
                { id: 1, name: '114學年度下學期通識課程表.pdf', size: '3.04MB 檢索日期：2026/01/30', type: 'PDF', url: 'https://www.cgu.edu.tw/ge/ServerFile/Get/1ae57026-cf41-49c1-85fd-97c73eeb8fde?nodeId=15270' },
                { id: 2, name: '114學年度上學期通識課程表.pdf', size: '3.04MB 檢索日期：2026/01/30', type: 'PDF', url: 'https://www.cgu.edu.tw/ge/ServerFile/Get/1ae57026-cf41-49c1-85fd-97c73eeb8fde?nodeId=15270' },
                { id: 3, name: '114學年度深耕學園課程說明.pdf', size: '1.21MB 檢索日期：2026/01/30', type: 'PDF', url: 'https://www.cgu.edu.tw/studentaffairs/ServerFile/GetByKindEditor/530709a9-b302-450e-a961-50611f2089f2?subjectId=20522' },
                { id: 4, name: '114學年度通識課程地圖.pdf', size: '2.28MB 檢索日期：2026/01/30', type: 'PDF', url: 'https://www.cgu.edu.tw/ge/ServerFile/Get/71093a84-258e-4301-bbe9-29a65909579c?nodeId=15271' },
                { id: 5, name: '113學年度下學期通識課程表.pdf', size: '3.08MB 檢索日期：2026/01/30', type: 'PDF', url: 'https://www.cgu.edu.tw/ge/ServerFile/Get/1947a4b1-ff72-426d-a17d-847228479cfe?nodeId=15270' },
                { id: 6, name: '113學年度上學期通識課程表.pdf', size: '2.96MB 檢索日期：2026/01/30', type: 'PDF', url: 'https://www.cgu.edu.tw/ge/ServerFile/Get/2311757f-e69b-47e5-93fc-c1ae3028ffc0?nodeId=15270' },
                { id: 7, name: '113學年度深耕學園修課須知.pdf', size: '108KB 檢索日期：2026/01/30', type: 'PDF', url: 'https://www.cgu.edu.tw/studentaffairs/ServerFile/GetByKindEditor/69085918-8725-47f5-b520-8ff8b30a77b9?subjectId=73185' },
                { id: 8, name: '113學年度通識課程地圖.pdf', size: '96.5KB 檢索日期：2026/01/30', type: 'PDF', url: 'https://www.cgu.edu.tw/ge/ServerFile/Get/ddfe5f61-67d2-4c12-8213-322f11cdd006?nodeId=15271' },
            ]
        },

        {
            category: '中醫系課程規劃相關文件',
            files: [
                { id: 1, name: '114學年度入學必選修科目表.pdf', size: '153KB 檢索日期：2026/01/30', type: 'PDF', url: 'https://www.cgu.edu.tw/Uploads/upload/8ab0eb25-c771-4389-a9eb-9e0c9a5b679d.pdf' },
                { id: 2, name: '114學年度雙主修課程地圖.pdf', size: '116KB 檢索日期：2026/01/30', type: 'PDF', url: 'https://www.cgu.edu.tw/Uploads/upload/5d644faf-4f76-4154-a53a-bc3d80b414b8.pdf' },
                { id: 3, name: '114學年度單主修課程地圖.pdf', size: '114KB 檢索日期：2026/01/30', type: 'PDF', url: 'https://www.cgu.edu.tw/Uploads/upload/4048e6b0-ddda-4faa-b1a6-1d5055974cbb.pdf' },
                { id: 4, name: '113學年度入學必選修科目表.pdf', size: '153KB 檢索日期：2026/01/30', type: 'PDF', url: 'https://www.cgu.edu.tw/Uploads/upload/26186db3-c80e-4229-a07e-92eacd3396d3.pdf' },
                { id: 5, name: '113學年度雙主修課程地圖.pdf', size: '116KB 檢索日期：2026/01/30', type: 'PDF', url: 'https://www.cgu.edu.tw/Uploads/upload/265f97d7-9ff9-4972-88f2-0252f42c5834.pdf' },
                { id: 6, name: '113學年度單主修課程地圖.pdf', size: '114KB 檢索日期：2026/01/30', type: 'PDF', url: 'https://www.cgu.edu.tw/Uploads/upload/17dc5446-1ab0-4bc1-a641-8b658b873fd9.pdf' },
                { id: 7, name: '中醫系修業年限.pdf', size: '110KB 檢索日期：2026/01/30', type: 'PDF', url: 'https://www.cgu.edu.tw/Uploads/upload/1d064152-5754-4a53-a588-6ad83ca3d99c.pdf' },
            ]
        },
        {
            category: '中醫系課程修習規範相關文件',
            files: [
                { id: 1, name: '中醫學系修讀醫學系為雙主修辦法.pdf', size: '85.2KB 檢索日期：2026/01/30', type: 'PDF', url: 'https://www.cgu.edu.tw/Uploads/upload/c31ab0d7-fccf-4342-8650-3488cb83db48.pdf' },
                { id: 2, name: '中醫學系修讀醫學系為雙主修審核辦法.pdf', size: '77.9KB 檢索日期：2026/01/30', type: 'PDF', url: 'https://www.cgu.edu.tw/Uploads/upload/2a756174-d43c-43a0-b249-daee96d9dca5.pdf' },
                { id: 3, name: '醫學系暨中醫系轉系細則.pdf', size: '166KB 檢索日期：2026/01/30', type: 'PDF', url: 'https://www.cgu.edu.tw/Uploads/upload/99aec320-4104-41dc-9dd0-9542d50fd40d.pdf' },
                { id: 4, name: '長庚大學學生申請轉系(所)辦法.pdf', size: '204KB 檢索日期：2026/02/01', type: 'PDF', url: 'https://www.cgu.edu.tw/Uploads/upload/c71bf14a-b641-493f-acc9-1724e1de4a98.pdf' },
                { id: 5, name: '中醫系修課（含擋修、暑修）辦法.pdf', size: '77.0KB 檢索日期：2026/02/01', type: 'PDF', url: 'https://www.cgu.edu.tw/Uploads/upload/b103f00e-ac4a-40b1-8695-5c0b66cbf6fe.pdf' },
                { id: 6, name: '醫學系修課（含擋修、暑修）辦法.pdf', size: '164KB 檢索日期：2026/02/01', type: 'PDF', url: 'https://www.cgu.edu.tw/Uploads/upload/040dc775-0d91-4686-97cc-d8508bb088fe.pdf' },
                { id: 7, name: '中醫學系上修課程清單.pdf', size: '54.0KB 檢索日期：2026/02/01', type: 'PDF', url: 'https://www.cgu.edu.tw/Uploads/upload/4087135a-f08a-44e2-b37e-5a3d4ab329a2.pdf' },
                { id: 8, name: '中醫學系替代課程抵修清單.pdf', size: '175KB 檢索日期：2026/02/01', type: 'PDF', url: 'https://www.cgu.edu.tw/Uploads/upload/89552b58-245f-45ac-8884-41f2002fee3b.pdf' },
                { id: 9, name: '中醫系擋修課程清單.pdf', size: '51.0KB 檢索日期：2026/02/01', type: 'PDF', url: 'https://www.cgu.edu.tw/Uploads/upload/040dc775-0d91-4686-97cc-d8508bb088fe.pdf' },
            ]
        },
        {
            category: '中醫系獎學金申請相關文件',
            files: [
                { id: 1, name: '中醫學系獎學金實施辦法.pdf', size: '254KB 檢索日期：2026/02/01', type: 'PDF', url: 'https://www.cgu.edu.tw/Uploads/upload/ead4b58d-aef3-476d-92f5-eca5ed667551.pdf' },
                { id: 2, name: '中醫學系獎學金申請表.pdf', size: '312KB 檢索日期：2026/02/01', type: 'PDF', url: 'https://www.cgu.edu.tw/Uploads/upload/fb564347-eafe-48a9-96cf-6e7edd872c09.pdf' }
            ]
        },
        {
            category: '系學會雲端資料',
            files: [
                { id: 1, name: '大一雲端家書', size: '請勿外流（使用前請先確認已申請開通）', type: 'FILE', url: 'https://drive.google.com/drive/folders/0B0wMcoJ3R-CpbHdqcTlpdmo1dUk?resourcekey=0-chQlckz-KJ3PGKj-WqOv6g&usp=sharing' },
                { id: 2, name: '大二雲端家書', size: '請勿外流（使用前請先確認已申請開通）', type: 'FILE', url: 'https://drive.google.com/drive/folders/0B4omzknqUkbZYVAwaVhvTGpxTGM?resourcekey=0-TbfPALwB77CLM3QBY_o4sQ&usp=sharing' },
                { id: 3, name: '大三雲端家書', size: '請勿外流（使用前請先確認已申請開通）', type: 'FILE', url: 'https://drive.google.com/drive/folders/1Vm052nLBwEriXi2eIe19OFbF3Kn9ORP2?usp=sharing' },
                { id: 4, name: '大四雲端家書', size: '請勿外流（使用前請先確認已申請開通）', type: 'FILE', url: 'https://drive.google.com/drive/folders/1bVvsd9oxeQC2Z4xEwxklaowrXwkFwORi?usp=sharing' },
                { id: 5, name: '國考雲端家書', size: '請勿外流（使用前請先確認已申請開通）', type: 'FILE', url: 'https://drive.google.com/drive/folders/1119JpPTSwEMiC2kc9yoMoVqPcWCRBl4r?usp=sharing' },
            ]
        },
        {
            category: '其他檔案與資料',
            files: [
                { id: 1, name: '修課指引與評鑑查詢系統操作手冊', size: '如有任何問題請聯繫常務副會長', type: 'FILE', url: 'https://drive.google.com/drive/folders/1a6hkCm-nAiMo0fNq00_1AmscYg-vp6Tp?usp=drive_link' },
                { id: 2, name: '神秘小彩蛋', size: '？', type: 'EGG', url: 'https://youtu.be/dQw4w9WgXcQ?si=UZQwOv-5rDBWFKGq' },
            ]
        }
    ]
};

export default config;
