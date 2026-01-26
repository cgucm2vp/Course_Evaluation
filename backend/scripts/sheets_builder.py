# 請在此貼上您的 Python 建置腳本內容
# 該腳本用於協助建置 Google Sheets 內容
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill

def create_excel(file_path, worksheets_info):
    """
    file_path: 要儲存的 Excel 檔案路徑，例如 "test.xlsx"
    worksheets_info: dict，每個 key 是 worksheet 名稱，value 是表頭 list
    """
    wb = Workbook()
    
    # 先刪掉 openpyxl 建立的預設 worksheet
    if "Sheet" in wb.sheetnames:
        std = wb["Sheet"]
        wb.remove(std)
    
    for ws_name, headers in worksheets_info.items():
        ws = wb.create_sheet(ws_name)
        
        # 寫入表頭
        for col, header in enumerate(headers, start=1):
            cell = ws.cell(row=1, column=col, value=header)
            # 加粗 + 灰底
            cell.font = Font(bold=True)
            cell.fill = PatternFill(start_color="DDDDDD", end_color="DDDDDD", fill_type="solid")
    
    wb.save(file_path)
    print(f"Excel 已建立: {file_path}")

# -------------------
# 範例使用
# -------------------
if __name__ == "__main__":
    worksheets_info = {
        "課程資料庫": ["母分類", "子分類", "課程名稱", "授課教師"],
        "評鑑資料庫": ["母分類", "子分類", "課程名稱", "授課教師", "學年"],
        "課程評鑑回覆": ["核准並移動", "學年", "母分類", "子分類", "課程名稱", "授課教師"]
    }

    create_excel("本地測試.xlsx", worksheets_info)
