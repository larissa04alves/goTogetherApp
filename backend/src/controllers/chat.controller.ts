import type { Request, Response } from "express";
import { z } from "zod";

import { env } from "@/env";
import { chatService } from "@/services/chat.service";
import { AppError } from "@/utils/app-error";

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
  const raw = req.params["id"];
  const hubId = Array.isArray(raw) ? raw[0] : raw;
  if (!hubId) {
    throw new AppError(400, "ID do hub obrigatório");
  }

  const parsed = joinHubSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "Dados inválidos", parsed.error.flatten());
  }

  const session = res.locals["session"] as Session;

  const channel = await chatService.ensureHubChannel(
    {
      id: session.user.id,
      name: session.user.name,
      image: session.user.image ?? undefined,
    },
    hubId,
    parsed.data.name,
  );

  res.json(channel);
}

export const chatController = { token, joinHub };
