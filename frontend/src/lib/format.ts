const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 123456 → "R$ 1.234,56" (ADR-0003: valores trafegam em centavos). */
export function formatCurrency(cents: number): string {
  return currency.format(cents / 100);
}

/** 123456 → "1.234,56" (sem símbolo; o "R$" fica como prefixo do campo). */
export function formatDecimal(cents: number): string {
  return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100);
}

/** Dígitos digitados formam os centavos: "1599" → 1599 (R$ 15,99). */
export function centsFromInput(value: string): number {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  return digits ? Number.parseInt(digits, 10) : 0;
}

/** Datas são meia-noite UTC; exibir em UTC evita "voltar um dia". */
export function formatDate(iso: string, style: "short" | "long" = "short"): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: style === "short" ? "2-digit" : "numeric",
  }).format(new Date(iso));
}

/** "2026-11-06" (input date) → ISO meia-noite UTC. */
export function dateInputToISO(value: string): string {
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

/** ISO → "2026-11-06" (input date). */
export function isoToDateInput(iso: string): string {
  return iso.slice(0, 10);
}

/** Hoje no formato do input date, no fuso local de quem usa. */
export function todayDateInput(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/** "2026-11" → "Novembro / 2026". */
export function formatPeriod(period: string): string {
  const [year, month] = period.split("-").map(Number) as [number, number];
  const name = new Intl.DateTimeFormat("pt-BR", { month: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} / ${year}`;
}
