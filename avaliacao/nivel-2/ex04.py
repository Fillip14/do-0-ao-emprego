text = "o rato roeu a roupa do rei de roma e o rei nao gostou"
repetead_words = {}

for word in text.split():
    if word in repetead_words:
        repetead_words[word] += 1
    else:
        repetead_words[word] = 1

for word, count in repetead_words.items():
    print(f"{word}: {count}")