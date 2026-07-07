const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/tarefas', (req, res) => {
  res.json({
    mensagem: 'Requisição GET realizada com sucesso!',
    status: 200,
  });
});

app.post('/tarefas', (req, res) => {
  const dadosRecebidos = req.body;

  res.json({
    mensagem: 'Dados recebidos via POST com sucesso!',
    dados: dadosRecebidos,
  });
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
