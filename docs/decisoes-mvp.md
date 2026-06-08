# Decisões MVP

## Seed de usuários de desenvolvimento

Arquivo: `backend/src/db/seeds/users.seed.ts`

Executar com: `npm run db:seed --workspace backend`

O seed é idempotente — pode ser rodado múltiplas vezes sem duplicar dados.

### Usuários criados

| Nome | Email | Gênero | Verificado | Senha |
|---|---|---|---|---|
| João Teste | joao.teste@email.com | masculino | sim | `senha123` |
| Maria Teste | maria.teste@email.com | feminino | não | `senha123` |

As senhas são armazenadas com **scrypt** via `@better-auth/utils/password` (mesmo algoritmo usado pelo Better-Auth no login). Não usar estas senhas em produção.

## Domínio institucional

O sistema não exige e-mail `@pucpr.edu.br`. Usuários podem se cadastrar com qualquer e-mail válido.
