import cors from "cors";
import express from "express";

import { env } from "@/env";
import { errorMiddleware } from "@/middlewares/error.middleware";
import { registerAuthRoutes } from "@/routes/auth.routes";
import { registerAvaliacoesRoutes } from "@/routes/avaliacoes.routes";
import { registerChatRoutes } from "@/routes/chat.routes";
import { registerDocumentsRoutes } from "@/routes/documents.routes";
import { registerHubMembrosRoutes } from "@/routes/hub-membros.routes";
import { registerHubsRoutes } from "@/routes/hubs.routes";
import { registerSolicitacoesRoutes } from "@/routes/solicitacoes.routes";
import { registerVeiculosRoutes } from "@/routes/veiculos.routes";
import { registerRotasRoutes } from "@/routes/rotas.routes";


const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

registerAuthRoutes(app);

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

registerAvaliacoesRoutes(app);
registerSolicitacoesRoutes(app);
registerVeiculosRoutes(app);
registerRotasRoutes(app);
registerHubsRoutes(app);
registerHubMembrosRoutes(app);
registerChatRoutes(app);
registerDocumentsRoutes(app);

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});


