# Devlog — Etapa 3 (Front-end: React)

> Inversão do cronograma · 28/07/2026 — Etapa 2 pausada no meio do Tema 5, front antecipado. O back volta do ponto onde parou. Motivo e consequências no [`plano.md`](plano.md).

## 28/07

- **⏸️ Etapa 2** — pausada no meio do Tema 5 (Testes a fundo). Temas 5 a 10 ficam de pé, congelados.
- **📄 Etapa 3** — plano detalhado escrito: 14 temas, app vivo em `web/`, avaliação alvo 12/08.
- **🔀 Plano reordenado no mesmo dia**, depois do diagnóstico de perfil de programação: estilo subiu do T11 para o **T3**, entrou o tema novo de **Motion (T10)**, e o **deploy desceu do T13 para o T11** — link público com quatro temas ainda pela frente.

- **🗣️ Parte C virou defesa oral** — 6 a 8 perguntas no meio do tema, faladas, com contra-argumento; no devlog fica uma linha por pergunta, só o que ficou de pé. O questionário escrito de 30+ perguntas no fim do dia não pegou (o do T4 da Etapa 2 ficou sem resposta). Aplicado no `studie-t01` e na regra 6 do plano.

**Anotações**

1. O front consome a API **local**, sem auth e sem URL pública — consequência escolhida da inversão. Login e deploy da API entram quando o back voltar.
2. Exceção única ao congelamento do back: habilitar CORS para `http://localhost:5173`, no Tema 7.
3. Duas decisões ficaram pendentes de escolha minha, dentro dos temas: **qual sistema de estilo** (T3) e **Framer Motion ou GSAP** (T10). As duas vão para o `web/README.md` quando eu decidir.
4. Custos assumidos da reordenação: estilizar lista estática no T3 gera retrabalho de CSS depois do CRUD, e os testes ficaram por último (T14) — mesmo padrão do questionário pendente do T4 da Etapa 2. A regra 1 segura até lá.

- Amanhã: abrir o Tema 1 (React e ferramental).
