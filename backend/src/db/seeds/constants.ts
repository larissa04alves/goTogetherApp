export const USER_IDS = {
  demo: "seed-user-demo",
  joao: "seed-user-joao",
  maria: "seed-user-maria",
  carlos: "seed-user-carlos",
  luana: "seed-user-luana",
  ramon: "seed-user-ramon",
  ana: "seed-user-ana",
} as const;

export const VEICULO_IDS = {
  demo: "seed-veiculo-demo",
  joao: "seed-veiculo-joao",
  carlos: "seed-veiculo-carlos",
  ramon: "seed-veiculo-ramon",
} as const;

export const ROTA_IDS = {
  demoCasaPucpr: "seed-rota-demo-casa-pucpr",
  demoPucprCentro: "seed-rota-demo-pucpr-centro",
  joao: "seed-rota-joao-pucpr-centro",
  carlos: "seed-rota-carlos-pucpr-batel",
  luana: "seed-rota-luana-pucpr-cic",
  ramon: "seed-rota-ramon-pucpr-pinhais",
} as const;

export const CARONA_IDS = {
  // abertas de outros usuários — a conta demo ENTRA ao vivo
  joaoAberta: "seed-carona-joao-aberta",
  carlosAberta: "seed-carona-carlos-aberta",
  luanaSoMulheres: "seed-carona-luana-so-mulheres",
  // aberta de outro onde a demo JÁ é passageira (mostra chat + sair)
  ramonComDemo: "seed-carona-ramon-com-demo",
  // aberta da DEMO com passageiros (mostra membros + expulsar + concluir + cancelar)
  demoGerencia: "seed-carona-demo-gerencia",
  // concluída da DEMO como ofertante (avaliar passageiros ao vivo)
  demoConcluidaOfertante: "seed-carona-demo-concluida-ofertante",
  // concluída de outro onde a demo foi passageira (avaliar motorista/co-passageiro)
  joaoConcluidaDemoPassageira: "seed-carona-joao-concluida-demo",
  // cancelada da DEMO (mostra estado cancelado)
  demoCancelada: "seed-carona-demo-cancelada",
} as const;
