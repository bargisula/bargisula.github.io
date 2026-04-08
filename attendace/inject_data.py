import re
import json

def parse_sql(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    unit_map = []
    absence = []
    personal = []
    sick = []
    
    # 提取 unit_map (格式: ('AA00000', 'AA10000', 'AA11907'))
    unit_map_matches = re.findall(r"INSERT INTO unit_map VALUES (.*?);", content, re.S)
    for m in unit_map_matches:
        items = re.findall(r"\('(.*?)', '(.*?)', '(.*?)'\)", m)
        for d, u, p in items:
            unit_map.append({'district_code': d, 'unit_code': u, 'person_id': p})

    # 提取 absence
    absence_matches = re.findall(r"INSERT INTO absence \(.*?\) VALUES (.*?);", content, re.S)
    for m in absence_matches:
        items = re.findall(r"\('(.*?)', '(.*?)', '(.*?)'\)", m)
        for u, p, d in items:
            absence.append({'unit_code': u, 'person_id': p, 'absence_date': d})

    # 提取 personal_leave
    personal_matches = re.findall(r"INSERT INTO personal_leave \(.*?\) VALUES (.*?);", content, re.S)
    for m in personal_matches:
        items = re.findall(r"\('(.*?)', '(.*?)', '(.*?)'\)", m)
        for u, p, d in items:
            personal.append({'unit_code': u, 'person_id': p, 'leave_date': d})

    # 提取 sick_leave
    sick_matches = re.findall(r"INSERT INTO sick_leave \(.*?\) VALUES (.*?);", content, re.S)
    for m in sick_matches:
        items = re.findall(r"\('(.*?)', '(.*?)', '(.*?)'\)", m)
        for u, p, d in items:
            sick.append({'unit_code': u, 'person_id': p, 'leave_date': d})
            
    return unit_map, absence, personal, sick

print("Parsing SQL...")
unit_map, absence, personal, sick = parse_sql('attendance_setup.sql')

print(f"Extraction results: UnitMap={len(unit_map)}, Absence={len(absence)}, Personal={len(personal)}, Sick={len(sick)}")

with open('attendance.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 替換 HTML 中的佔位符
print("Embedding data into HTML...")
html = html.replace('const unitMap = [];', 'const unitMap = ' + json.dumps(unit_map, ensure_ascii=False) + ';')
html = html.replace('const absenceData = [];', 'const absenceData = ' + json.dumps(absence, ensure_ascii=False) + ';')
html = html.replace('const personalLeaveData = [];', 'const personalLeaveData = ' + json.dumps(personal, ensure_ascii=False) + ';')
html = html.replace('const sickLeaveData = [];', 'const sickLeaveData = ' + json.dumps(sick, ensure_ascii=False) + ';')

with open('attendance.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Successfully updated attendance.html")
