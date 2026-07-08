input_text = input("Digite um texto: ")

length_of_text = len(input_text)

while length_of_text != 0:
    print(input_text[length_of_text - 1])
    length_of_text -= 1