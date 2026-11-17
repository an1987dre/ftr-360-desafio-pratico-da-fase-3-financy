/** Últimos `count` meses (inclui o atual) no formato YYYY-MM, do mais recente ao mais antigo. */
export function recentPeriods(count = 12, now = new Date()): string[] {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(Date.UTC(now.getFullYear(), now.getMonth() - i, 1));
    return date.toISOString().slice(0, 7);
  });
}
