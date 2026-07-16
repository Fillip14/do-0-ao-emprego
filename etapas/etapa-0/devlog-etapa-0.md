## 06/07 - Dia 0

**Anotações**

1. pwd (mostra o path que estou agora)
2. ls (lista o que tem na pasta)
3. mkdir (make directory)
4. mv (move origem final)
5. `*` (ele casa com qualquer sequencia de caracteres, exemplo `*`.md)
6. Tab (autocomplete para o terminal)
7. nano (abre o editor de texto do arquivo), ctrl O (salva as edicoes do texto no terminal) e ctrl x (sai do arquivo no terminal).

**Fechamento**

- O que aprendi: usar os comandos das anotações e reorganizar as pastas no repo local.
- Travei/faltou: nada
- Amanhã: Vou aprender o dia 1 da etapa 0

## 07/07 - Dia 1

**Anotações**

1. git config cria uma "assinatura" dos commits, usa o email e nome configurado, global significa que vai servir para todos repos da maquina.
2. git init transforma a pasta num repositório.
3. .gitignore adiciona pastas e arquivos que quer ignorar para nao commitar.
4. git remote add origin conecta o repo local ao repo do github.
5. git add. adiciona tudo que quer que entre no commit.
6. git commit comita com mensagem o que quero salvar.
7. git branch -M renomei a branch atual.
8. git push -u envia os commites para o github e memoriza o destino.
9. git status me mostra o status dos arquivos, quais mudaram e não entraram no add, o que ja esta pronto para commit.
10. git log --oneline mostra o meu log de commit em uma linha

**Fechamento**

- O que aprendi: comandos git no terminal
- Travei/faltou: ainda há muitos comandos que não conheço
- Amanhã: realizar os exercicios propostos

## 08/07 - Dias 2, 3, 4, 5, 6 e 7

**Anotações**

1. É possível retornar diretamente na arrow function sem precisar abrir chaves. Ex.: const aprovado = (nota) => nota >= 7;
2. assert.strictEqual(atual, esperado). No atual voce coloca o que deseja testar e no esperado vai o que voce espera que aquilo retorne. Se a comparacao for true ele passa, se for false ele quebra e exibe o erro.
3. git switch -c experimento: cria e muda branch experimento
4. git switch main: muda para branch main
5. git merge experimento: faz um merge da branch experimento para a atual
6. git branch -d experimento: deleta a branch experimento
7. git restore arquivo: descarta todas mudanças nao commitadas do arquivo.
8. git reset HEAD~1: desfaz o ultimo commit
9. git ele por si só é uma forma de backup
10. Comparações === e ==: com 3 = ele compara tambem typeof.

**Fechamento**

- O que aprendi: melhorei os testes de fronteira, arrow functions reduzidas, aprendi assert, aprendo novos comandos git.
- Travei/faltou: acredito que o assert ainda tenha mais coisas para aprender. Aprender regex.
- Amanhã: avançar para etapa 1.