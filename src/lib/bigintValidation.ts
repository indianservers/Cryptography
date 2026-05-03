export interface BigIntParseResult {
  ok: boolean;
  value: bigint;
  error: string;
}

export function parseBigIntStrict(value: string, label: string, options: { min?: bigint; max?: bigint } = {}): BigIntParseResult {
  const trimmed = value.trim();
  if (!trimmed) return { ok: false, value: 0n, error: `${label} is required.` };
  if (!/^-?\d+$/.test(trimmed)) return { ok: false, value: 0n, error: `${label} must be a base-10 integer.` };
  const parsed = BigInt(trimmed);
  if (options.min !== undefined && parsed < options.min) return { ok: false, value: parsed, error: `${label} must be at least ${options.min}.` };
  if (options.max !== undefined && parsed > options.max) return { ok: false, value: parsed, error: `${label} must be at most ${options.max}.` };
  return { ok: true, value: parsed, error: "" };
}
