#!/usr/bin/env bash
# Smoke test da Fase 1 (entrar/sair/concluir/membros/listarMeus) contra localhost:3000.
# Pré-requisito: backend rodando (npm run dev:backend) + Postgres up (npm run db:start).
# Uso: bash backend/scripts/smoke-fase1.sh
set -euo pipefail

API="http://localhost:3000"
CA="/tmp/gt-ofertante.txt"   # cookies do ofertante (motorista)
CB="/tmp/gt-passageiro.txt"  # cookies do passageiro
R=$RANDOM
EMAIL_A="ofertante$R@teste.com"
EMAIL_B="passageiro$R@teste.com"

say() { printf "\n\033[1;36m== %s ==\033[0m\n" "$1"; }
ok()  { printf "\033[1;32m  ✓ %s\033[0m\n" "$1"; }

say "1) Cria 2 contas (A = ofertante, B = passageiro)"
curl -s -c "$CA" -o /dev/null -X POST "$API/api/auth/sign-up/email" -H "Content-Type: application/json" \
  -d "{\"name\":\"Ofertante A\",\"email\":\"$EMAIL_A\",\"password\":\"senha12345\",\"gender\":\"masculino\",\"phone\":\"41999990000\",\"emergencyContactName\":\"Mae\",\"emergencyContactPhone\":\"41988880000\"}"
curl -s -c "$CB" -o /dev/null -X POST "$API/api/auth/sign-up/email" -H "Content-Type: application/json" \
  -d "{\"name\":\"Passageiro B\",\"email\":\"$EMAIL_B\",\"password\":\"senha12345\",\"gender\":\"masculino\",\"phone\":\"41999991111\",\"emergencyContactName\":\"Pai\",\"emergencyContactPhone\":\"41988881111\"}"
ok "A=$EMAIL_A  B=$EMAIL_B"

say "2) A cria uma rota"
ROTA_ID=$(curl -s -b "$CA" -X POST "$API/rotas" -H "Content-Type: application/json" \
  -d '{"origem_nome":"PUCPR","origem_endereco":"R. Imac. Conceicao 1155","origem_lat":-25.45,"origem_lng":-49.23,"destino_nome":"Centro","destino_endereco":"Praca Tiradentes","destino_lat":-25.42,"destino_lng":-49.27,"horario_padrao":"18:00","distancia_km":8.5}' \
  | jq -r '.id')
ok "rota_id=$ROTA_ID"

say "3) A cria um hub (rachar_app, 3 vagas) -> deve virar membro MOTORISTA (B1)"
HUB_ID=$(curl -s -b "$CA" -X POST "$API/hubs" -H "Content-Type: application/json" \
  -d "{\"tipo\":\"rachar_app\",\"rota_id\":\"$ROTA_ID\",\"horario_saida\":\"18:00\",\"vagas_max\":3}" \
  | jq -r '.id')
ok "hub_id=$HUB_ID"

say "4) A lista membros do hub -> espera 1 (A motorista)"
curl -s -b "$CA" "$API/hubs/$HUB_ID/membros" | jq '[.[] | {nome, role, status}]'

say "5) B entra no hub (B2) -> vira PASSAGEIRO, vagas 3 -> 2"
curl -s -b "$CB" -X POST "$API/hubs/$HUB_ID/entrar" | jq '{message, vagasDisponiveis: .hub.vagasDisponiveis}'

say "6) A lista membros de novo -> espera 2 (A motorista + B passageiro)"
curl -s -b "$CA" "$API/hubs/$HUB_ID/membros" | jq '[.[] | {nome, role, status}]'

say "7) GET /hubs/me como B -> deve aparecer o hub PARTICIPADO com papel/membros (B4)"
curl -s -b "$CB" "$API/hubs/me" | jq '[.[] | {id, papel, vagasDisponiveis, membros: [.membros[].user.name]}]'

say "8) A conclui o hub (B3) -> status aberta -> concluida"
curl -s -b "$CA" -X PATCH "$API/hubs/$HUB_ID/concluir" | jq '{id, status}'

say "9) B lista avaliacoes pendentes -> deve incluir A (carona concluida + participou)"
curl -s -b "$CB" "$API/avaliacoes/pendentes" | jq '[.[] | {caronaId, avaliar: .usuario.name}]'

say "10) Teste de SAIR (B5): cria hub2, B entra e sai -> vaga volta"
HUB2=$(curl -s -b "$CA" -X POST "$API/hubs" -H "Content-Type: application/json" \
  -d "{\"tipo\":\"rachar_app\",\"rota_id\":\"$ROTA_ID\",\"horario_saida\":\"19:30\",\"vagas_max\":2}" | jq -r '.id')
curl -s -b "$CB" -X POST "$API/hubs/$HUB2/entrar" | jq '{entrou: .message, vagas: .hub.vagasDisponiveis}'
curl -s -b "$CB" -X POST "$API/hubs/$HUB2/sair"   | jq '{saiu: .message, vagas: .hub.vagasDisponiveis}'

printf "\n\033[1;32mSMOKE OK — todos os endpoints da Fase 1 responderam.\033[0m\n"
