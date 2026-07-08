# Correção da Avaliação de Nível — 06/07/2026

## Resultado geral

**Você não é "do zero".** Lógica de programação: loops, condicionais, dicionários, arquivos, JSON e funções estão funcionais. O Ex 8 (mini projeto) foi a melhor entrega e mostra que você já constrói programas completos.

**Mas há um padrão claro de erro que se repete em 5 dos 9 exercícios: não seguir o enunciado à risca.** Detalhes abaixo. Em entrevista técnica e no trabalho, isso derruba mais do que não saber sintaxe.

---

## Correção por exercício

### Ex 1 — FizzBuzz — ⚠️ Parcial
Estrutura das condições correta (FizzBuzz antes de Fizz/Buzz ✓). Três desvios do enunciado:

- Imprime o número junto ("Fizz 3") — o enunciado pede Fizz **no lugar** do número.
- Números que não são múltiplos de 3 nem 5 não aparecem — deveriam ser impressos.
- Começa em 0 (e 0 vira "FizzBuzz") — o enunciado pede 1 a 100.

### Ex 2 — Inverter texto — ✅ Quase
A lógica manual com índice está certa. Só sai um caractere por linha em vez do texto inteiro invertido. Pesquise: `print(x, end="")` ou acumular numa string.

### Ex 3 — Contar vogais — ⚠️ Parcial
O enunciado pedia para **ignorar** maiúsculas/minúsculas; você contou só minúsculas e ajustou o texto do print para encaixar. Solução de 1 linha: `if character.lower() in "aeiou"`. Adaptar o enunciado ao código (em vez do contrário) é um hábito a matar cedo.

### Ex 4 — Contagem de palavras — ⚠️ Parcial
A contagem com dicionário está ótima. Faltou a segunda metade: imprimir **da mais frequente para a menos frequente**. Pesquise: `sorted(dicionario.items(), key=..., reverse=True)`.

### Ex 5 — Produtos — ⚠️ Parcial
(a) ✓. (b) pedia **um** valor total do estoque (soma geral) — você imprimiu o total por produto. (c) "produto mais caro" = maior **preço** (monitor, R$ 899,90) — você calculou maior valor de estoque, e só entre itens com estoque.

### Ex 6 — CSV de notas — ✅ Quase
Funciona e está bem resolvido (uso de `csv` e `statistics` ✓). Um bug de fronteira: `media > 6` reprova quem tira exatamente 6.0 — o enunciado diz média ≥ 6. Nenhum dos seus dados testa essa fronteira, então o bug passou invisível.

### Ex 7 — valida_senha — ❌ O mais problemático
1. `len(password) > 8` exige 9+ caracteres; o enunciado pede 8+. Mesmo erro de fronteira do Ex 6 — é padrão, não acaso.
2. O enunciado pede que a função **retorne** `True`/`False`; a sua imprime texto e retorna `None`. Quem chamar `if valida_senha(x):` quebra.
3. **Crash escondido:** com senha de 8 caracteres ou menos, `is_upper` nunca é criada e a linha 8 explode com `NameError`. Seus 4 testes têm todos 9+ caracteres — você não testou exatamente o caso que a função existe para rejeitar. Rode `valida_senha("Ab1")` e veja.

### Ex 8 — Gerenciador de tarefas — ✅ Melhor entrega
Persistência em JSON funcionando, código em funções, `enumerate`, proteção contra JSON corrompido — muito acima do esperado para essa etapa. Pontos a corrigir:

- Digitar `0` em concluir/excluir pega a **última** tarefa (índice -1) — faltou validar `> 0`.
- `menu()` chama `options()` que chama `menu()` de volta: recursão que cresce a pilha a cada navegação. O padrão correto é um único `while True` no menu.
- `task_number` aleatório não é usado para nada; e o template `new_tasks` com `int`/`str` dentro indica confusão sobre como tipos funcionam em Python — vale revisar.

### Ex 9 — JavaScript — ✅ Ok
Tradução fiel do seu Python (herdou os mesmos desvios do Ex 5). `i < 4` fixo em vez de `produtos.length`; variáveis globais sem `let`/`const`. Mas mostra que você transita entre linguagens — bom sinal.

### Ex 10 e 11 + Nível 5 — ❌ Não entregues
Não encontrei servidor da API, prints do Postman nem o `respostas.md` (o Express está instalado na pasta, então algo foi tentado).

---

## Diagnóstico

**Pontos fortes:** lógica funcional, estruturas de dados básicas, arquivos/JSON, organização em funções, persistência, transita entre Python e JS. Nível: **iniciante avançado** em lógica — pode pular o "básico do básico".

**Padrões a corrigir (mais importantes que qualquer conteúdo novo):**

1. **Ler e cumprir o enunciado exatamente.** 5 de 9 exercícios entregaram algo diferente do pedido.
2. **Fronteiras:** `>` vs `>=` errado duas vezes. Sempre teste o valor exato da fronteira.
3. **Testar o caso que deveria falhar**, não só os que passam (Ex 7).
4. **`return` vs `print`** — funções devolvem valores; imprimir é outra coisa.

**Não medido ainda:** conceitos de web/Git/APIs (nível 5) e a prática de API (Ex 10). Isso define se o cronograma começa em "fundamentos web" ou mais à frente.
