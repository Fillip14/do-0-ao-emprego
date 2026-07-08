import os
import json
import random

def open_file():
    if os.path.isfile("tarefas.json"):
        try:
            with open("tarefas.json", "r", encoding='utf-8') as file:
                saved_tasks = json.load(file)
                return saved_tasks["tasks"]
        except json.JSONDecodeError:
            return []
    return []

new_tasks = {"tasks": [{"task_ID": int, "task": str, "check" : False}]}
saved_tasks = []

def save_task(saved_tasks):
    new_tasks["tasks"] = saved_tasks

    with open('tarefas.json', 'w', encoding='utf-8') as file:
        json.dump(new_tasks, file)

def list_tasks():
    saved_tasks = open_file()

    for number, task in enumerate(saved_tasks):
        if task["check"] == True:
            print(f"{number+1} - {task["task"]} ✅")
        elif task["check"] == False:
            print(f"{number+1} - {task["task"]} ❌")

    return saved_tasks

def add_task():
    task = input("Digite a tarefa que você deseja adicionar: ")

    saved_tasks = open_file()
    saved_tasks.append({"task_number": random.randint(0, 1000), "task": task, "check" : False})

    save_task(saved_tasks)

def check_task():
    saved_tasks = list_tasks()

    check_task = input("Qual tarefa deseja concluir? ")

    if check_task.isdigit() and int(check_task) < len(saved_tasks)+1:
        saved_tasks[int(check_task)-1]["check"] = True

    save_task(saved_tasks)
    os.system('clear')
    print("-----------CONCLUIR TAREFAS------------")
    saved_tasks = list_tasks()

def delete_task():
    saved_tasks = list_tasks()

    delete_task = input("Qual tarefa deseja excluir? ")

    if delete_task.isdigit() and int(delete_task) < len(saved_tasks)+1:
        saved_tasks.pop(int(delete_task)-1)

    save_task(saved_tasks)
    os.system('clear')
    print("-----------EXCLUIR TAREFA------------")
    saved_tasks = list_tasks()

def options(option):
    back_menu = False
    while(not back_menu):
        os.system('clear')

        if option.isdigit():
            if int(option) == 1: 
                print("-----------ADICIONAR TAREFA------------")
                add_task()

            elif int(option) == 2: 
                print("-----------LISTA DE TAREFAS------------")
                list_tasks()

            elif int(option) == 3: 
                print("-----------CONCLUIR TAREFAS------------")
                check_task()

            elif int(option) == 4: 
                print("-----------EXCLUIR TAREFA------------")
                delete_task()

            elif int(option) == 5: return

        else: 
            menu()
            return
        
        back_menu = back_to_menu()
    menu()

def menu():
    os.system('clear')
    print("-----------MENU------------")
    print("1 - Adicionar tarefa")
    print("2 - Listar tarefas")
    print("3 - Concluir tarefa")
    print("4 - Apagar tarefa")
    print("5 - Sair")

    option = input("Digite a opção desejada: ")
    options(option)

def back_to_menu():
    is_back = input("Deseja voltar ao menu principal? S/N ")
    if is_back == "S" or is_back == "s": return True
    return False

menu()