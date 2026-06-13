import cors from "cors";
import express from "express";

import { env } from "@/env";
import { registerAuthRoutes } from "@/routes/auth.routes";
import { registerAvaliacoesRoutes } from "@/routes/avaliacoes.routes";
import { registerSolicitacoesRoutes } from "@/routes/solicitacoes.routes";
import { registerChatRoutes } from "@/routes/chat.routes";
import { registerVeiculosRoutes } from "@/routes/veiculos.routes";
import { registerDocumentsRoutes } from "@/routes/documents.routes";
import { errorMiddleware } from "@/middlewares/error.middleware";

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
registerChatRoutes(app);
registerDocumentsRoutes(app);

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
