CREATE TABLE "veiculo" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"marca" text NOT NULL,
	"modelo" text NOT NULL,
	"placa" text NOT NULL,
	"cor" text NOT NULL,
	"capacidade" integer NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "veiculo" ADD CONSTRAINT "veiculo_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "veiculo_placa_unique_idx" ON "veiculo" USING btree ("placa");--> statement-breakpoint
CREATE INDEX "veiculo_userId_idx" ON "veiculo" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "carona" ADD CONSTRAINT "carona_veiculo_id_veiculo_id_fk" FOREIGN KEY ("veiculo_id") REFERENCES "public"."veiculo"("id") ON DELETE set null ON UPDATE no action;