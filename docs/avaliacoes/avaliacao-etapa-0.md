# Avaliação da Etapa 0 — 08/07/2026

## Veredito: APROVADA ✅ (com uma verificação oral pendente no chat)

A diferença em relação à avaliação inicial é gritante — e era exatamente o objetivo da etapa.

## Critérios

**1. Enunciados à risca — ✅ 5 de 5.** Na avaliação inicial foram 5 de 9 com desvio; aqui, zero desvio. Os checklists em comentário no topo de cada arquivo são o hábito certo — mantenha-os para sempre.

**2. Fronteiras — ✅.** `aprovado` testado com 6.9 / 7 / 7.1; `dentroDoIntervalo` testado nos dois limites exatos e vizinhanças; `classificarIdade` testado em 11/12/17/18. O comentário explicando *por que* cada valor foi testado mostra que o conceito assentou.

**3. Testes negativos — ✅.** `testes.js` roda com `node:assert`, cobre caso inválido de todas as funções, e o `validarSenha` tem a suíte mais completa (3 combinações de erros + 2 válidas). Uso correto de `deepStrictEqual` para comparar objetos.

**4. Git — ✅.** Histórico mostra: commits granulares com mensagens descritivas, branch `experimento` criada/mergeada/deletada, `reset HEAD~1` praticado de verdade, README no repo. Ressalva: os commits se concentram em 2 dias (07–08/07) porque a etapa foi comprimida — o critério de constância (commit diário) fica em observação para a Etapa 1, onde o ritmo será real.

**5. Conceitos com suas palavras — ⏳ pendente.** Responder no chat (ver abaixo).

## Observações de código (nada bloqueia)

- `ex02`: linha de teste duplicada (`'banana'` duas vezes) — provavelmente uma era para ser caso misto tipo `'BaNaNa'`. Testes duplicados dão falsa sensação de cobertura.
- `ex05`: `senha.toString()` protege contra número, mas quebra com `null`/`undefined` — experimente `validarSenha(null)`. Não era exigido; fica como semente para a Etapa 1.
- `ex05`: o truque `password === password.toLowerCase()` para detectar ausência de maiúscula é criativo e correto.
- O padrão `require.main === module` + `module.exports` é avançado para essa fase — entra na verificação oral (abaixo).

## Verificação oral (responder no chat, sem consultar nada)

1. Commit vs push — qual a diferença?
2. `return` vs `console.log` — por que sua nota caiu nisso na avaliação inicial e o que mudou?
3. O commit "Pequenas modificacoes feitas pelo claude": o que exatamente o Claude mudou, e o que faz a linha `if (require.main === module)`?

## Ressalvas de processo

- Velocidade com qualidade é ótimo — mas a Etapa 0 era 80% revisão do que você meio-sabia. A Etapa 1 tem conteúdo novo de verdade; se ela também "acabar em horas", o sinal é de profundidade insuficiente, não de talento.
- Constância ≠ velocidade: o commit diário continua valendo mesmo em dia de conteúdo fácil. O músculo que o mercado quer ver no seu GitHub é o de 6 meses, não o de 1 dia.
