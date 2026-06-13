import cors from "cors";
import express from "express";

import { env } from "@/env";
import authRoutes, { registerAuthRoutes } from "@/routes/auth.routes";


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

app.use("/auth", authRoutes);

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


