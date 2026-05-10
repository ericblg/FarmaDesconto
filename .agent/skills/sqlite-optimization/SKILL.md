# SQLite Optimization

Como otimizar o banco de dados SQLite para uso em produção no FarmaDesconto.

## Modo WAL (Write-Ahead Logging)
O SQLite por padrão bloqueia o banco inteiro para escrita. O modo WAL permite múltiplos leitores e um escritor simultâneo, melhorando drasticamente a performance em APIs.

**Habilitar no Sequelize:**
```javascript
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  dialectOptions: {
    mode: 'WAL'
  }
});
// Ou via query direta no início da app:
// await sequelize.query('PRAGMA journal_mode=WAL;');
```

## Pragma Settings
Configure estes parâmetros para estabilidade:
- `busy_timeout`: 5000 (ms) - Evita erros de "SQLITE_BUSY" em picos de tráfego.
- `synchronous`: NORMAL - Reduz overhead de IO sem sacrificar integridade em caso de crash da app.
- `temp_store`: MEMORY - Acelera ordenações complexas e joins temporários.

## Índices
- Certifique-se de indexar colunas usadas frequentemente no `WHERE` (como `pharmacy_id` ou `discount_code`).
- Use `EXPLAIN QUERY PLAN` para validar se os índices estão sendo usados.
