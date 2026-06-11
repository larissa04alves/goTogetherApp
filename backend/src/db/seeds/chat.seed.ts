import { chatService } from "@/services/chat.service";

import { CARONA_IDS, USER_IDS } from "./constants";

const participants = [
  { id: USER_IDS.joao, name: "João Teste" },
  { id: USER_IDS.maria, name: "Maria Teste" },
];

const messages = [
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
];

export async function seedChat() {
  await chatService.seedHubConversation(
    CARONA_IDS.joaoAberta,
    participants,
    messages,
  );

  console.log(
    `Seed de chat concluído (canal hub-${CARONA_IDS.joaoAberta}, ${messages.length} mensagens).`,
  );
}
