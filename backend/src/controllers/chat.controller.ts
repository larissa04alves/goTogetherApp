import type { Request, Response } from "express";
import { z } from "zod";

import { env } from "@/env";
import { chatService } from "@/services/chat.service";

type Session = { user: { id: string; name: string; image?: string | null } };

const joinHubSchema = z.object({
  name: z.string().min(1).optional(),
});

async function token(_req: Request, res: Response): Promise<void> {
  const session = res.locals["session"] as Session;

  const streamToken = await chatService.issueToken({
    id: session.user.id,
    name: session.user.name,
    image: session.user.image ?? undefined,
  });

  res.json({
    apiKey: env.STREAM_API_KEY,
    token: streamToken,
    userId: session.user.id,
  });
}

async function joinHub(req: Request, res: Response): Promise<void> {
  const hubId = Array.isArray(req.params["id"])
    ? req.params["id"][0]
    : req.params["id"];
  if (!hubId) {
    res.status(400).json({ error: "ID do hub obrigatório" });
    return;
  }

  const parsed = joinHubSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dados inválidos" });
    return;
  }

  const session = res.locals["session"] as Session;

  const channel = await chatService.ensureHubChannel(
    hubId,
    session.user.id,
    parsed.data.name,
  );

  res.json(channel);
}

export const chatController = { token, joinHub };
