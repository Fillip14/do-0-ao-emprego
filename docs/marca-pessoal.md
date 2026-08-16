# Trilha de Marca Pessoal

> Painel de acompanhamento da presença pública (GitHub, LinkedIn, Twitch, posts) e **fonte única** da trilha de marca pessoal.
> Última atualização: **16/08/2026** — Etapa 4 aberta (capstone em repo separado), camada 4 destravada. **Nenhum post saiu desde 27/07** — o acervo só cresce.

## 📊 Progresso das camadas

```
Etapa 1 · Fundação (perfil + rede)    ██████████████████████  100%  ✅ concluída
Etapa 2 · Conteúdo (posts + rede)     ████░░░░░░░░░░░░░░░░░░   20%  ⏸️ parada desde 27/07
Etapa 3 · Demo (posts com demo)       ░░░░░░░░░░░░░░░░░░░░░░    0%  🔓 aberta em 11/08, não usada
Etapa 4 · Build in public (capstone)  ░░░░░░░░░░░░░░░░░░░░░░    0%  🔓 aberta em 16/08, não usada
Etapa 5 · Colheita (aplicações)       ░░░░░░░░░░░░░░░░░░░░░░    0%  🔒 bloqueada
```

| Etapa | Camada | Foco | Estado |
|:---:|---|---|:---:|
| **1** | Fundação | Consertar perfis 1x + iniciar rede + post nº1 | ✅ Concluída |
| **2** | Conteúdo | 2–3 posts/semana (nunca diário) + 10 min/dia comentando | ⏸️ Parada |
| **3** | Demo | Posts com demo visual do front React + 1º full stack rodando | 🔓 **Aberta** — o front está no ar desde 11/08 |
| **4** | Build in public | Capstone "reporte-aqui" vira série de posts | 🔓 **Aberta** — a Etapa 4 começou em 16/08 |
| **5** | Colheita | Perfil e rede já prontos → só currículo, aplicações, entrevistas | 🔒 Bloqueada |

> ⚠️ **O estado real, dito sem enfeite (11/08):** duas semanas de trabalho denso — front inteiro, deploy, testes, motion — e **zero post**. A camada 3 abriu com o link público e não foi usada. Isso não é atraso de cronograma, é o risco central da trilha: *sem link público não conta como terminado*, e a Etapa 5 só é colheita se a rede estiver aquecida antes. O acervo de matéria-prima nunca esteve tão cheio; falta publicar.

### 🗓️ Cronograma de posts da etapa

| Semana | Posts (2–3) |
|:---:|---|
| **S1** (21–27/07) | ✅ **Por que reiniciei a etapa** *(21/07)* · ✅ **Testes verdes ≠ API correta** *(27/07)* |
| **S2–S4** (28/07–10/08) | ❌ **Nada publicado.** Eram: SQL injection na própria API · primeira API respondendo · a decisão de pausar o back · o que o TS strict pegou. Nenhum caducou — viraram acervo |
| **S5** (11–17/08) | ⬜ **Meu primeiro full stack: a tela falando com o meu banco** *(marco — o link público)* · ⬜ **Por que pausei o back-end no meio e fui pro front** *(a decisão mais honesta do acervo, e agora com o resultado na mão)* · ⬜ Os 4 estados que toda tela tem — e o que ninguém testa |
| **S6** (18–24/08) | ⬜ **O teste que achou o bug que 12 temas de clique não viram** *(o `aria-live` que nunca chegou ao DOM)* · ⬜ CORS visto do lado de quem apanha · ⬜ `useEffect`: o difícil é saber quando **não** usar |
| **S7** (25–31/08) | ⬜ **Otimizei o bundle e ele ficou maior** *(o veredito do `LazyMotion`: −25 kB no caminho crítico, +2,55 kB no total)* · ⬜ Testando front como usuário, não como programador *(Testing Library + MSW)* · ⬜ **Nada memoizado porque nada precisou** *(medir antes de otimizar)* |
| **S8+** (set) | ⬜ A retomada do back-end vira pauta: camadas · migration vs CREATE TABLE · auth e timing attacks · **URL pública da API** *(marco: o sistema fecha de ponta a ponta)* · Docker + CI. Acervo de manutenção: SQL injection · TS strict · Etapa 0 *(hábitos antes de conteúdo)* · projeto web da Etapa 1 |

> 🔁 **Rebalanceado em 11/08.** A regra de sempre continua valendo: **post de matéria-prima técnica só sai depois que a coisa aconteceu de verdade** — e agora aconteceu muita coisa. Os posts de camadas e auth já têm matéria-prima (Temas 6 e 8 fecharam em 11/08); os de migration, deploy e Docker/CI **perderam a origem** — a Etapa 2 encerrou sem esses temas. Eles voltam pela Etapa 4, quando o `reporte-aqui` precisar deles de verdade.

## ➡️ Próximas camadas

**Etapa 3 — Demo (aberta desde 11/08):** posts com demo visual — o front React está no ar, o CRUD roda de ponta a ponta contra o Postgres, e o app se move. É GIF de graça, e o link já existe.

**Etapa 4 — Build in public (aberta desde 16/08):** capstone [`reporte-aqui`](https://github.com/Fillip14/reporte-aqui) vira série (decisões, erros, code review, deploy) · README + série contam a mesma história da entrevista. Pauta nova e forte desde já: **como é programar com um agente** — especificar, revisar, validar — que é exatamente a pergunta de entrevista da moda.

**Etapa 5 — Colheita:** perfil pronto e rede aquecida → foco em currículo, aplicações e entrevistas.
