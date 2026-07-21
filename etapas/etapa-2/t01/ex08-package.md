1. "name": "semana-01-node" - nome do projeto
2. "version": "1.0.0" - versão do projeto
3. "description": "" - descrição do projeto
4. "license": "ISC" - licença do projeto
5. "author": "" - autor do projeto
6. "type": "module" - padrão do JS usado no projeto
7. "scripts": - scripts
8.    "test": "echo \"Error: no test specified\" && exit 1" - script de test
9.    "start": "node ex07-env.js" - script de start do arquivo
10.   "dev": "node --watch ex07-env.js" - script de start que fica observando alterações no arquivo

1. dependencies — o app precisa disso rodando. Express, pg. Vai pra produção. devDependencies — só serve para desenvolver. Vitest, TypeScript, nodemon. Em produção roda-se npm ci --omit=dev e elas não são instaladas.
2. Versão é MAJOR.MINOR.PATCH: ^aceita minor e patch, ~aceita só patch
3. Vai pro git pois ele é a reprodutiblidade do projeto, guarda a versão exata para rodar o projeto em outra máquina.