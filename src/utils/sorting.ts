export function sortRows<TRow>(
  rows: TRow[],
  columnKey: string,
  direction: 'asc' | 'desc',
): TRow[] {
  const factor = direction === 'asc' ? 1 : -1;

  return [...rows].sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[columnKey];
    const bVal = (b as Record<string, unknown>)[columnKey];

    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * factor;
    }

    return String(aVal).localeCompare(String(bVal)) * factor;
  });
}
