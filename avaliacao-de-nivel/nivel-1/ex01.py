contador = 0
while contador < 101:

    if (contador % 3 == 0) and (contador % 5 == 0):
        print("FizzBuzz", contador)
    elif contador % 3 == 0:
        print("Fizz", contador)
    elif contador % 5 == 0:
        print("Buzz", contador)
    contador += 1