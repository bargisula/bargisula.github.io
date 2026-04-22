import csv
import re
from collections import defaultdict

stats = defaultdict(lambda: {'district': '', 'persons': set()})
person_leaves = defaultdict(lambda: {'absences': 0, 'personal': 0, 'sick': 0})

sql_file = 'attendance_setup.sql'

current_table = None
with open(sql_file, 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if 'INSERT INTO unit_map' in line or 'INSERT INTO unit_map' in line.upper(): 
            current_table = 'unit_map'
        elif 'INSERT INTO absence' in line: 
            current_table = 'absence'
        elif 'INSERT INTO personal_leave' in line: 
            current_table = 'personal_leave'
        elif 'INSERT INTO sick_leave' in line: 
            current_table = 'sick_leave'
        
        if line.startswith('INSERT') or line.startswith('('):
            matches = re.findall(r"\('(\w+)', '(\w+)', '([\w\d-]+)'\)", line)
            if not matches:
                # Try simple (col1, col2, col3) format for unit_map without explicit column names
                matches = re.findall(r"\('(\w+)',\s*'(\w+)',\s*'(\w+)'\)", line)

            for m in matches:
                if current_table == 'unit_map':
                    dist, unit, person = m
                    stats[unit]['district'] = dist
                    stats[unit]['persons'].add(person)
                elif current_table == 'absence':
                    unit, person, date = m
                    person_leaves[person]['absences'] += 1
                elif current_table == 'personal_leave':
                    unit, person, date = m
                    person_leaves[person]['personal'] += 1
                elif current_table == 'sick_leave':
                    unit, person, date = m
                    person_leaves[person]['sick'] += 1

# Final aggregation
header = ['區部', '單位', '病假10天以上人數', '事假10天以上人數', '缺勤7天以上人數', '單位人數']
rows = []
sorted_units = sorted(stats.keys(), key=lambda x: (stats[x]['district'], x))

for unit in sorted_units:
    s = stats[unit]
    sick_gt_10 = 0
    personal_gt_10 = 0
    absences_gt_7 = 0
    
    for pid in s['persons']:
        if person_leaves[pid]['sick'] >= 10: sick_gt_10 += 1
        if person_leaves[pid]['personal'] >= 10: personal_gt_10 += 1
        if person_leaves[pid]['absences'] >= 7: absences_gt_7 += 1
        
    rows.append([
        s['district'],
        unit,
        sick_gt_10,
        personal_gt_10,
        absences_gt_7,
        len(s['persons'])
    ])

csv_file = 'attendance_summary.csv'
with open(csv_file, 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(rows)

print(f"Summary CSV generated: {csv_file}")
