export function metaClamp(value: string | undefined, max: number): string | undefined {
  if (!value) return value;
  if (value.length <= max) return value;
  return value.slice(0, max - 1).trimEnd() + '…';
}

export function formatPrice(value: number | undefined, currency: string | undefined): string | undefined {
  if (value === undefined || currency === undefined) return undefined;
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
}


