import { chatService } from "@/services/chat.service";

import { CARONA_IDS, USER_IDS } from "./constants";

type ChatParticipant = { id: string; name: string };
type ChatMessage = { userId: string; text: string };
type SeedConversation = {
  caronaId: string;
  participants: ChatParticipant[];
  messages: ChatMessage[];
};

const PARTICIPANTS = {
  demo: { id: USER_IDS.demo, name: "Demo" },
  joao: { id: USER_IDS.joao, name: "João Teste" },
  maria: { id: USER_IDS.maria, name: "Maria Teste" },
  carlos: { id: USER_IDS.carlos, name: "Carlos Souza" },
  ramon: { id: USER_IDS.ramon, name: "Ramon Dino" },
  ana: { id: USER_IDS.ana, name: "Ana Paula" },
} as const;

const conversations: SeedConversation[] = [
  {
    // hub aberto da demo (ela é motorista) com Maria e Carlos
    caronaId: CARONA_IDS.demoGerencia,
    participants: [PARTICIPANTS.demo, PARTICIPANTS.maria, PARTICIPANTS.carlos],
    messages: [
      {
        userId: USER_IDS.demo,
        text: "Oi pessoal! Saída às 8h na portaria, combinado?",
      },
      { userId: USER_IDS.maria, text: "Combinado! Já estou a caminho 🙂" },
      {
        userId: USER_IDS.carlos,
        text: "Perfeito, chego em 5 min. Obrigado pela carona!",
      },
      {
        userId: USER_IDS.demo,
        text: "Estou em um Onix branco bem na frente 🚗",
      },
    ],
  },
  {
    // carona concluída onde a demo foi passageira do João
    caronaId: CARONA_IDS.joaoConcluidaDemoPassageira,
    participants: [PARTICIPANTS.joao, PARTICIPANTS.demo, PARTICIPANTS.carlos],
    messages: [
      {
        userId: USER_IDS.joao,
        text: "Pessoal, saída às 23h na frente da PUC, combinado?",
      },
      { userId: USER_IDS.demo, text: "Confirmado! Já estou descendo." },
      { userId: USER_IDS.carlos, text: "Cheguei no ponto 👋" },
      { userId: USER_IDS.demo, text: "Valeu pela carona, João! 🙏" },
    ],
  },
  {
    // hub aberto do Ramon onde a demo JÁ é passageira (mostra chat + sair)
    caronaId: CARONA_IDS.ramonComDemo,
    participants: [PARTICIPANTS.ramon, PARTICIPANTS.demo],
    messages: [
      {
        userId: USER_IDS.ramon,
        text: "Bom dia! Saída 7h30 lá no Cajuru, pode ser?",
      },
      { userId: USER_IDS.demo, text: "Pode sim! Te encontro na esquina 👍" },
      {
        userId: USER_IDS.ramon,
        text: "Show. Tô num Civic preto, placa termina em 42.",
      },
      { userId: USER_IDS.demo, text: "Beleza, já tô descendo!" },
    ],
  },
  {
    // carona concluída onde a demo foi a motorista (Maria e Ana de passageiras)
    caronaId: CARONA_IDS.demoConcluidaOfertante,
    participants: [PARTICIPANTS.demo, PARTICIPANTS.maria, PARTICIPANTS.ana],
    messages: [
      {
        userId: USER_IDS.demo,
        text: "Oi meninas! Saída 19h na frente da PUC 🚗",
      },
      { userId: USER_IDS.maria, text: "Perfeito, já estou aqui." },
      { userId: USER_IDS.ana, text: "Chegando em 2 min!" },
      {
        userId: USER_IDS.demo,
        text: "Obrigada pela companhia, foi ótimo! Até a próxima 💜",
      },
      { userId: USER_IDS.ana, text: "Valeu, Demo! Dirige super bem 🙌" },
    ],
  },
];

export async function seedChat() {
  for (const conversation of conversations) {
    await chatService.seedHubConversation(
      conversation.caronaId,
      conversation.participants,
      conversation.messages,
    );
  }

  const totalMessages = conversations.reduce(
    (sum, conversation) => sum + conversation.messages.length,
    0,
  );

  console.log(
    `Seed de chat concluído (${conversations.length} conversas, ${totalMessages} mensagens).`,
  );
}
