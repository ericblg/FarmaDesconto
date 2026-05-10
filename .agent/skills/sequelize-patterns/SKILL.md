# Sequelize Patterns

Padrões de uso do ORM Sequelize para garantir performance e manutenibilidade no projeto FarmaDesconto.

## Definição de Modelos
- Utilize `init` ou classes que estendam `Model`.
- Mantenha os nomes das tabelas em snake_case e atributos em camelCase.

## Associações (Relacionamentos)
- Sempre defina `foreignKey` explicitamente.
- Use `as` para apelidar associações e facilitar as queries `include`.

Exemplo:
```javascript
Pharmacy.hasMany(Discount, { foreignKey: 'pharmacy_id', as: 'discounts' });
Discount.belongsTo(Pharmacy, { foreignKey: 'pharmacy_id', as: 'pharmacy' });
```

## Migrations
- **MANDATÓRIO**: Nunca use `sync({ force: true })` em produção.
- Todas as alterações de schema devem ser feitas via arquivos de migration no Sequelize CLI.

## Queries & Performance
- Use `attributes` para selecionar apenas as colunas necessárias.
- Utilize `defaultScope` para ocultar campos sensíveis (ex: passwords) ou filtrar registros inativos por padrão.
- Sempre use `transaction` para operações que envolvem múltiplas tabelas.
