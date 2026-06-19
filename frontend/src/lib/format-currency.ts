export function formatPrice(brl: number): string {
  return brl.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
