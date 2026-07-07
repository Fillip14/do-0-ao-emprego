# Avaliação de Nível — Do 0 ao Emprego

Objetivo: mapear onde você está de verdade para montar o cronograma real.
Tempo estimado: 1 a 2 sessões de estudo (3–6h no total).

## Regras (importantes)

1. **Sem IA para resolver.** Pode usar documentação oficial do Python e busca no Google. Não pode pedir a solução (nem pra mim). A avaliação só funciona se medir VOCÊ.
2. **Anote o tempo** que levou em cada exercício.
3. **Travou de verdade?** Tente por 20 minutos, depois marque "travei" e pule para o próximo. Travar não é falha — é dado.
4. Salve cada solução em um arquivo `.py` nesta pasta (ex: `ex01.py`, `ex02.py`).
5. Ao terminar (ou terminar parcialmente), me avise que eu corrijo e monto o cronograma.

---

## Nível 1 — Lógica básica

**Ex 1.** Escreva um programa que imprima os números de 1 a 100, mas: múltiplos de 3 imprimem "Fizz", múltiplos de 5 imprimem "Buzz", múltiplos de ambos imprimem "FizzBuzz".

**Ex 2.** Peça um texto ao usuário e imprima-o invertido, **sem** usar `[::-1]` ou `reversed()`.

**Ex 3.** Peça um texto e conte quantas vogais ele tem (ignorando maiúsculas/minúsculas).

## Nível 2 — Estruturas de dados

**Ex 4.** Dada a frase `"o rato roeu a roupa do rei de roma e o rei nao gostou"`, monte um dicionário que conte quantas vezes cada palavra aparece e imprima da mais frequente para a menos frequente.

**Ex 5.** Dada esta lista:

```python
produtos = [
    {"nome": "teclado", "preco": 120.0, "estoque": 3},
    {"nome": "mouse", "preco": 55.5, "estoque": 0},
    {"nome": "monitor", "preco": 899.9, "estoque": 7},
    {"nome": "cabo hdmi", "preco": 25.0, "estoque": 0},
]
```

Imprima: (a) só os produtos com estoque, (b) o valor total do estoque (preço × quantidade), (c) o produto mais caro.

## Nível 3 — Funções e arquivos

**Ex 6.** Crie um arquivo `notas.csv` com este conteúdo:

```
nome,nota1,nota2
ana,7.5,8.0
bruno,4.0,6.5
carla,9.0,9.5
```

Escreva um programa que leia o arquivo e imprima o nome, a média e "APROVADO" (média ≥ 6) ou "REPROVADO" de cada aluno.

**Ex 7.** Escreva uma função `valida_senha(senha)` que retorna `True` se a senha tem 8+ caracteres, pelo menos 1 número e pelo menos 1 letra maiúscula. Teste com 4 senhas diferentes.

## Nível 4 — Mini projeto

**Ex 8.** Gerenciador de tarefas no terminal:

- Menu: adicionar tarefa, listar tarefas, marcar como concluída, apagar tarefa, sair.
- As tarefas devem ser salvas em um arquivo `tarefas.json` — ao fechar e abrir o programa, as tarefas continuam lá.
- Organize o código em funções.

Este é o exercício mais importante da avaliação. Pode levar algumas horas — normal.

## Nível 5 — Conceitos (responder por escrito, com suas palavras)

Crie um arquivo `respostas.md` e responda curto (2–4 linhas cada). Sem pesquisar primeiro — escreva o que sabe, e se não sabe, escreva "não sei":

1. O que é Git e para que serve um commit?
2. O que acontece por baixo dos panos quando você digita um site no navegador e aperta Enter?
3. O que é uma API?
4. Qual a diferença entre front-end e back-end?
5. O que é um banco de dados e por que não guardar tudo em arquivos?

---

## Nível 6 — JavaScript e back-end (opcional, mas faça se conseguir)

Você mencionou que já usou JavaScript e Postman num back-end. Esta seção mede o que ficou disso.

**Ex 9.** Refaça o Ex 5 (lista de produtos) em JavaScript, rodando com Node (`node ex09.js`). Use `filter`, `reduce` ou loops — o que souber.

**Ex 10.** Crie uma API mínima com Node (Express ou o módulo `http` puro) com duas rotas:

- `GET /tarefas` — retorna uma lista de tarefas em JSON (pode ser um array em memória).
- `POST /tarefas` — recebe `{"titulo": "..."}` e adiciona à lista.

Teste as duas rotas com o Postman e tire um print de cada teste funcionando (salve os prints na pasta).

**Ex 11.** No `respostas.md`, adicione (com suas palavras, sem pesquisar):

6. Qual a diferença entre GET e POST?
7. O que significa um status 200, 404 e 500?
8. O que é JSON e por que as APIs o utilizam?
9. No projeto do site que não foi concluído: o que você fez de fato, e onde travou/parou?

A pergunta 9 é a mais valiosa — seja específico.

---

## Entrega

Quando terminar, me diga: "terminei a avaliação" (ou "parei no ex X"). Vou corrigir os arquivos desta pasta, identificar seu nível real e montar o cronograma de etapas com base nisso.
