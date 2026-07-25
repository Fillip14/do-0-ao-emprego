1. Ele vai dizer que tem erro de diferentes tipos de importação, padrões diferentes.
2. SyntaxError: Cannot use import statement outside a module
3. Acertei as previsões
4. Já estão ok
5. require é do Node, funciona em qualquer lugar do código.
   import é padrão da linguagem, só no topo do arquivo.
   .mjs força ESM, .cjs força CommonJS, ignorando o package.json.

6. O resto da etapa vai ser em ESM pois é mais moderno