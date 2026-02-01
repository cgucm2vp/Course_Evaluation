import requests
import pandas as pd

def set_params(termid):
    api_url = "https://catalog.cgu.edu.tw/IsService/api/Course/GetCourseSections"

    params = {
        "termid": termid,
        "departmentid": "",
        "call_id": "",
        "keyward": "",
        "sectionid": "",
        "teaName": "",
        "cName": "",
        "year": "",
        "fieldid": "",
        "week": "",
        "stime": "",
        "etime": "",
        "stid": ""
    }
    return api_url,params

def first_or_second(termid: int) -> int:
    remainder = (termid+1) % 3
    if remainder==0:
        remainder=3
    return remainder

def get_course_information(url,param):
    response = requests.get(url=url, params=param)
    data = response.json()
    df = pd.json_normalize(data)
    df=course_information_tidyup(df)
    return df

def course_information_tidyup(df):

    columns_to_keep = ["ACADMICYEAR", "ACADMICTERM", "CCOURSENAME", "NAME", "ANNOTATION", "CLASSIFICATIONCATNAME"]
    df = df[columns_to_keep]

    df["修課學期"] = df["ACADMICYEAR"].astype(str) + "-" + df["ACADMICTERM"].astype(str)
    df = df.drop(columns=["ACADMICYEAR", "ACADMICTERM"])
    df = df.rename(columns={"CCOURSENAME": "課程名稱"})
    df = df.rename(columns={"NAME": "授課教師"})
    df = df.rename(columns={"ANNOTATION": "備註"})
    df = df.rename(columns={"CLASSIFICATIONCATNAME": "必選修類別"})

    new_order = ["修課學期", "課程名稱", "授課教師","備註","必選修類別"]
    df = df[new_order] 
    return df

def filterout_course(df,column_name,key_word):
    df_filtered = df[df[column_name].str.contains(key_word)]
    return df_filtered


def course_information_packed(df):
    df.to_excel("課程資料.xlsx", index=False)
    print("已存成 Excel！")

def empty_df():
    column_ids=["修課學期", "課程名稱", "授課教師","備註","必選修類別"]
    empty_df=pd.DataFrame(columns=column_ids)
    return empty_df


def pipeline(termid):
    url,params=set_params(termid)
    termid_num=first_or_second(termid)
    params["departmentid"]="A610"
    df1=get_course_information(url,params)
    df1=filterout_course(df1,"必選修類別","選修")
    params["year"]=1
    df2=get_course_information(url,params)
    params["year"]=2
    df3=get_course_information(url,params)
    params["year"]=""
    params["departmentid"]="2670"
    df4=get_course_information(url,params)
    df4=filterout_course(df4,"備註","中醫")
    params["departmentid"]="G000"
    df5=get_course_information(url,params)
    params["departmentid"]="27B0"
    df6=get_course_information(url,params)
    params["departmentid"]="2E00"
    df7=get_course_information(url,params)
    if termid>67:
        params["departmentid"]="D120"
        df8= get_course_information(url,params)
    else:
        df8= empty_df()
    if termid_num==2:
        params["departmentid"]="A110"
        params["year"]=3
        df9=get_course_information(url,params)
        df9=filterout_course(df9,"備註","醫學人文")
        params["year"]=2
        df10=get_course_information(url,params)
        df10=filterout_course(df10,"備註","醫學人文")
    else:
        df9=empty_df()
        df10=empty_df()
    df_all = pd.concat([df1, df2,df3,df4,df5,df6,df7,df8,df9,df10], ignore_index=True)
    return df_all




if __name__=='__main__':
    termids=(input("請輸入學期代碼：（一次下載多學期請以「,」隔開）"))
    #學期代碼參考：114-1 -> 69；114-2 -> 70；114-3 -> 71；115-1 -> 72
    termids_split=termids.split(",")
    df_out=empty_df()
    for termid in range(len(termids_split)):
        termid=int(termids_split[termid-1])
        df_all=pipeline(termid)
        df_out=pd.concat([df_out,df_all], ignore_index=True)
    course_information_packed(df_out)