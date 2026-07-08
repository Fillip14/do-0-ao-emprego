input_text = input("Digite um texto: ")
counter = 0

for character in (input_text):
    if character in ("aeiou") and character.islower():
        counter += 1

print("O texto digitado possui", counter, "vogais minúsculas.")