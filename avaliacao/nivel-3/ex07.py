def valida_senha(password):

    if len(password) > 8:
        is_upper = any(char.isupper() for char in password)
        is_lower = any(char.islower() for char in password)
        is_digit = any(char.isdigit() for char in password)
    
    if is_upper and is_lower and is_digit:
        print("True")
        return
    print("False")

valida_senha("1234567Aa")
valida_senha("1234567Aa.")
valida_senha("jiodjasiod0")
valida_senha(".;-090-9-0das")