CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"genero" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carona" (
	"id" text PRIMARY KEY NOT NULL,
	"ofertante_id" text NOT NULL,
	"rota_id" text NOT NULL,
	"tipo" text NOT NULL,
	"veiculo_id" text,
	"horario_saida" text NOT NULL,
	"vagas_max" integer NOT NULL,
	"vagas_disponiveis" integer NOT NULL,
	"valor_por_pessoa" integer,
	"so_mulheres" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'aberta' NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carona_membro" (
	"carona_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "carona_membro_carona_id_user_id_pk" PRIMARY KEY("carona_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "avaliacao" (
	"id" text PRIMARY KEY NOT NULL,
	"carona_id" text NOT NULL,
	"avaliador_id" text NOT NULL,
	"avaliado_id" text NOT NULL,
	"nota" integer NOT NULL,
	"comentario" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solicitacao" (
	"id" text PRIMARY KEY NOT NULL,
	"carona_id" text NOT NULL,
	"solicitante_id" text NOT NULL,
	"status" text DEFAULT 'pendente' NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"respondido_em" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carona" ADD CONSTRAINT "carona_ofertante_id_user_id_fk" FOREIGN KEY ("ofertante_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carona_membro" ADD CONSTRAINT "carona_membro_carona_id_carona_id_fk" FOREIGN KEY ("carona_id") REFERENCES "public"."carona"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carona_membro" ADD CONSTRAINT "carona_membro_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_carona_id_carona_id_fk" FOREIGN KEY ("carona_id") REFERENCES "public"."carona"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_avaliador_id_user_id_fk" FOREIGN KEY ("avaliador_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_avaliado_id_user_id_fk" FOREIGN KEY ("avaliado_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solicitacao" ADD CONSTRAINT "solicitacao_carona_id_carona_id_fk" FOREIGN KEY ("carona_id") REFERENCES "public"."carona"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solicitacao" ADD CONSTRAINT "solicitacao_solicitante_id_user_id_fk" FOREIGN KEY ("solicitante_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "carona_ofertanteId_idx" ON "carona" USING btree ("ofertante_id");--> statement-breakpoint
CREATE UNIQUE INDEX "avaliacao_unique_idx" ON "avaliacao" USING btree ("carona_id","avaliador_id","avaliado_id");--> statement-breakpoint
CREATE INDEX "avaliacao_avaliadoId_idx" ON "avaliacao" USING btree ("avaliado_id");--> statement-breakpoint
CREATE INDEX "solicitacao_caronaId_idx" ON "solicitacao" USING btree ("carona_id");--> statement-breakpoint
CREATE INDEX "solicitacao_solicitanteId_idx" ON "solicitacao" USING btree ("solicitante_id");