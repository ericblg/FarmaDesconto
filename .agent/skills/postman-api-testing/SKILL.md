# Postman API Testing

Guia de testes automatizados utilizando as coleções do Postman encontradas no projeto.

## Variáveis de Ambiente
Sempre mantenha as URLs base em variáveis (`{{baseUrl}}`) para alternar entre `localhost:3000` (dev) e o ambiente de staging/produção sem alterar as requisições.

## Scripts de Teste
Adicione validações na aba "Tests" das requisições importantes:

**Status Code:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
```

**Esquema de Resposta (JSON):**
```javascript
pm.test("Response is valid JSON", function () {
    pm.response.to.be.withBody;
    pm.response.to.be.json;
});
```

**Validação de Dados:**
```javascript
pm.test("Should return pharmacy name", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.name).to.be.a('string');
});
```

## Execução via CLI (Newman)
Para rodar os testes sem abrir a interface gráfica:
`npx newman run postman/collection.json -e postman/environment.json`
