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
  joao: { id: USER_IDS.joao, name: "João Teste" },
  maria: { id: USER_IDS.maria, name: "Maria Teste" },
  carlos: { id: USER_IDS.carlos, name: "Carlos Souza" },
  ana: { id: USER_IDS.ana, name: "Ana Paula" },
} as const;

const conversations: SeedConversation[] = [
  {
    caronaId: CARONA_IDS.joaoAberta,
    participants: [PARTICIPANTS.joao, PARTICIPANTS.maria],
    messages: [
      {
        userId: USER_IDS.joao,
        text: "Oi Maria! Confirmando a carona de hoje às 23h?",
      },
      {
        userId: USER_IDS.maria,
        text: "Oi João! Confirmado, te encontro na portaria 🙂",
      },
      {
        userId: USER_IDS.joao,
        text: "Perfeito, estou em um Fit branco. Até mais tarde 🚗",
      },
      { userId: USER_IDS.maria, text: "Combinado, obrigada!" },
    ],
  },
  {
    caronaId: CARONA_IDS.joaoConcluida,
    participants: [PARTICIPANTS.joao, PARTICIPANTS.carlos, PARTICIPANTS.ana],
    messages: [
      {
        userId: USER_IDS.joao,
        text: "Pessoal, saída às 23h na frente da PUC, combinado?",
      },
      { userId: USER_IDS.carlos, text: "Combinado! Já estou descendo." },
      {
        userId: USER_IDS.ana,
        text: "Cheguei no ponto, tô de casaco vermelho 👋",
      },
      { userId: USER_IDS.joao, text: "Te vi, Ana. Carlos, falta você." },
      { userId: USER_IDS.carlos, text: "Chegando em 2 min!" },
      { userId: USER_IDS.ana, text: "Valeu pela carona, João! 🙏" },
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
