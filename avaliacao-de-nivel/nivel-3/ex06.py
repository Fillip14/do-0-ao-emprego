import csv
import statistics

students = []

with open('notas.csv', mode='r', encoding='utf-8') as file:
    data = csv.reader(file)
    
    for lines in data:
        if "nome" in lines: continue
        students.append({"name": lines[0], "notas": [float(lines[1]), float(lines[2])], "media" : 0})

    for values in students:
        media = statistics.mean(values["notas"])
        values.update({"name": values["name"], "media": media})

        if media > 6:
            print(f"Aluno {values["name"]}. Aprovado com a média: {values["media"]}")
            continue
        
        print(f"Aluno {values["name"]}. Reprovado com a média: {values["media"]}")
        
