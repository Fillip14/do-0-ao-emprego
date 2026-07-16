# Avaliação — Etapa 1 (JavaScript sólido + fundamentos web)

**Data:** 16/07/2026 (antecipada — a data confirmada era 21/07)
**Formato:** escrita + oral, sem consulta
**Resultado:** **APROVADA** (pendência levantada na hora, fechada no mesmo dia via reteste)

## Como foi

- **Parte A (escrita, 10 questões):** previsão de saída/coerção, `reduce` sem valor inicial, `map`/`forEach`, imutabilidade/cópia, `this` de chamada solta, classe × função pura, prototype, contrato/mensagem de erro à risca, `404` × `500` no `fetch`, default do Node (CommonJS × ESM).
- **Parte B (oral, 5 tópicos):** closure, promise × async/await, CommonJS × ESM, fluxo do projeto (evento→lib→save→render) e por que a lib é pura/separada, `map` × `forEach`.
- **Drill final da watchlist** (varredura dos erros da etapa) rodado antes.

## O que ficou firme

Coerção e `typeof`, referência × cópia, `this` de chamada solta, `404` × `500` no fetch (o fetch trata 404 como sucesso; checa `res.ok`/`res.status`), default do Node, closure, promise/async-await, CommonJS × ESM, métodos de array, e o projeto web rodando ponta a ponta (adicionar/toggle/remover, sobrevive ao F5, lib pura testada no Node, erros visíveis na página).

## Pendências levantadas — e como fecharam (mesmo dia)

Três lacunas no núcleo do T12 + conceito de pureza:

1. **prototype** — inicialmente disse que os métodos ficam no `constructor`. Correto: ficam no **prototype**, uma única cópia compartilhada por todas as instâncias. Reteste limpo (`p.show === q.show` é `true` justamente porque é a mesma função).
2. **definição de função pura** — sabia usar (a lib do t17) mas não verbalizar. Fechou com as **duas** regras: determinística (mesma entrada → mesma saída) **e** sem efeito colateral. Só classificou `Math.random()`/`Date.now()` como impuras após reforço da regra da determinística.
3. **`this` método × arrow** — arrow não tem `this` próprio (herda do escopo léxico); método normal recebe o `this` de quem chama. Reteste limpo.

**Deslizes menores** (não bloquearam): `typeof null` é `"object"`; `[].reduce(fn, 0)` retorna `0` (não `[0]`); no fluxo do projeto faltou citar o `saveTasks`.

**Ponto de postura registrado:** houve pedido de "marcar como feito" uma questão não respondida — mesmo padrão de afrouxar a régua quando a medição pega algo. Mantido o gate; o item ficou como não demonstrado até o reteste.

## Veredito

Aprovado. Fundamentos sólidos na maior parte; as três lacunas eram concentradas (T12 + pureza) e foram fechadas com revisão focada + mini-reteste no mesmo dia. **Etapa 2 liberada** (Node a fundo + primeira API).
