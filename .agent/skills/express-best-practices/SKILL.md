# Express 5 Best Practices

Este guia define os padrões para desenvolvimento Backend com Express 5 no projeto FarmaDesconto.

## Princípios Básicos
- **Separação de Preocupações**: Rotas chamam Controllers, Controllers usam Models/Services.
- **Tratamento de Erros**: Centralize o tratamento de erros em um middleware especializado.
- **Async/Await Nativo**: Aproveite o suporte nativo do Express 5 para disparar erros em funções async automaticamente.

## Estrutura Recomendada
- `src/app.js`: Configuração do servidor e middlewares globais.
- `src/routes/`: Definição de endpoints.
- `src/controllers/`: Lógica de requisição/resposta.
- `src/middlewares/`: Auth, Validation, Error Handling.

## Padrões de Resposta
Sempre retorne JSON consistente:
```json
{
  "success": true,
  "data": {},
  "message": "Operação realizada"
}
```

## Middleware de Erro Global
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});
```
