import { z } from "zod";

export const periodSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Período inválido");

/** Intervalo UTC [início, fim) do mês `YYYY-MM`. */
export function monthRange(period: string): { gte: Date; lt: Date } {
  const [year, month] = period.split("-").map(Number) as [number, number];
  return {
    gte: new Date(Date.UTC(year, month - 1, 1)),
    lt: new Date(Date.UTC(year, month, 1)),
  };
}

/** Mês atual em UTC no formato `YYYY-MM`. */
export function currentPeriod(now = new Date()): string {
  return now.toISOString().slice(0, 7);
}
