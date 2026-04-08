import random
from datetime import date, timedelta

def generate_random_dates(year, count):
    if count <= 0: return []
    start_date = date(year, 1, 1)
    end_date = date(year, 12, 31)
    delta = end_date - start_date
    all_dates = [start_date + timedelta(days=i) for i in range(delta.days + 1)]
    return random.sample(all_dates, min(count, len(all_dates)))

districts = ['AA00000', 'BB00000', 'CC00000']
unit_names_template = [
    ['AA', 'AB', 'AC', 'AD', 'AE'],
    ['BA', 'BB', 'BC', 'BD', 'BE'],
    ['CA', 'CB', 'CC', 'CD', 'CE']
]

# 儲存結構
all_units_data = [] # List of {unit_code, district_code, persons: [(pid, sick_count, personal_count, absence_count)]}

for d_idx, d_code in enumerate(districts):
    for u_prefix in unit_names_template[d_idx]:
        unit_code = f"{u_prefix}10000"
        pop_count = random.randint(60, 80)
        
        # 生成人員代號
        unit_persons = []
        used_suffixes = set()
        for _ in range(pop_count):
            while True:
                r1 = random.randint(1, 97)
                r2 = random.randint(1, 97)
                suffix = f"{r1:02d}{r2:02d}"
                if suffix not in used_suffixes:
                    used_suffixes.add(suffix)
                    break
            unit_persons.append(f"{unit_code[:3]}{suffix}")
        
        # 分配長假名單
        # 病假 10+ : 3人
        sick_long_pids = random.sample(unit_persons, 3)
        # 事假 10+ : 2人
        personal_long_pids = random.sample([p for p in unit_persons if p not in sick_long_pids], 2)
        # 缺勤 7+ : 5人
        absence_long_pids = random.sample([p for p in unit_persons if p not in sick_long_pids and p not in personal_long_pids], 5)
        
        person_configs = []
        for pid in unit_persons:
            # 病假天數控制
            if pid in sick_long_pids:
                s_count = random.randint(10, 20)
            else:
                s_count = random.randint(0, 9)
                
            # 事假天數控制
            if pid in personal_long_pids:
                p_count = random.randint(10, 20)
            else:
                p_count = random.randint(0, 9)
                
            # 缺勤天數控制
            if pid in absence_long_pids:
                a_count = random.randint(7, 15)
            else:
                a_count = random.randint(0, 6)
                
            person_configs.append((pid, s_count, p_count, a_count))
            
        all_units_data.append({
            'district_code': d_code,
            'unit_code': unit_code,
            'persons': person_configs
        })

# 開始寫入 SQL
with open('attendance_setup.sql', 'w', encoding='utf-8') as f:
    f.write("-- 一、單位對照表 (unit_map)\n")
    f.write("CREATE TABLE unit_map (district_code CHAR(7), unit_code CHAR(7), person_id CHAR(7), PRIMARY KEY (person_id));\n\n")
    f.write("-- 二、缺勤表 (absence)\n")
    f.write("CREATE TABLE absence (unit_code CHAR(7), person_id CHAR(7), absence_date DATE, PRIMARY KEY (person_id, absence_date));\n\n")
    f.write("-- 三、事假表 (personal_leave)\n")
    f.write("CREATE TABLE personal_leave (unit_code CHAR(7), person_id CHAR(7), leave_date DATE, PRIMARY KEY (person_id, leave_date));\n\n")
    f.write("-- 四、病假表 (sick_leave)\n")
    f.write("CREATE TABLE sick_leave (unit_code CHAR(7), person_id CHAR(7), leave_date DATE, PRIMARY KEY (person_id, leave_date));\n\n")

    # 1. 插入 unit_map
    for unit in all_units_data:
        vals = [f"('{unit['district_code']}', '{unit['unit_code']}', '{p[0]}')" for p in unit['persons']]
        for i in range(0, len(vals), 500):
            f.write(f"INSERT INTO unit_map VALUES {', '.join(vals[i:i+500])};\n")
    
    # 2. 插入各類假別 (分批寫入)
    for table_name, idx_in_config in [('absence', 3), ('personal_leave', 2), ('sick_leave', 1)]:
        f.write(f"\n-- 插入 {table_name} 資料\n")
        batch = []
        date_col = 'absence_date' if table_name == 'absence' else 'leave_date'
        
        for unit in all_units_data:
            u_code = unit['unit_code']
            for p_config in unit['persons']:
                p_id = p_config[0]
                count = p_config[idx_in_config]
                dates = generate_random_dates(2025, count)
                for d in dates:
                    batch.append(f"('{u_code}', '{p_id}', '{d}')")
                    if len(batch) >= 1000:
                        f.write(f"INSERT INTO {table_name} (unit_code, person_id, {date_col}) VALUES {', '.join(batch)};\n")
                        batch = []
        if batch:
            f.write(f"INSERT INTO {table_name} (unit_code, person_id, {date_col}) VALUES {', '.join(batch)};\n")

print("SQL script generated with precise controls.")
