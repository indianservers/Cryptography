export interface GcdStep {
  a: bigint;
  b: bigint;
  q: bigint;
  r: bigint;
}

export interface ExtendedGcdStep extends GcdStep {
  oldS: bigint;
  s: bigint;
  oldT: bigint;
  t: bigint;
}

export interface Factor {
  prime: bigint;
  exponent: number;
}

export const parseBigInt = (value: string, fallback = 0n) => {
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  try {
    return BigInt(trimmed);
  } catch {
    return fallback;
  }
};

export const mod = (value: bigint, modulus: bigint) => {
  if (modulus === 0n) return 0n;
  const positive = modulus < 0n ? -modulus : modulus;
  return ((value % positive) + positive) % positive;
};

export function gcdSteps(left: bigint, right: bigint) {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  const steps: GcdStep[] = [];
  while (b !== 0n) {
    const q = a / b;
    const r = a % b;
    steps.push({ a, b, q, r });
    a = b;
    b = r;
  }
  return { gcd: a, steps };
}

export function extendedGcd(left: bigint, right: bigint) {
  let oldR = left;
  let r = right;
  let oldS = 1n;
  let s = 0n;
  let oldT = 0n;
  let t = 1n;
  const steps: ExtendedGcdStep[] = [];

  while (r !== 0n) {
    const q = oldR / r;
    const nextR = oldR - q * r;
    steps.push({ a: oldR, b: r, q, r: nextR, oldS, s, oldT, t });
    [oldR, r] = [r, nextR];
    [oldS, s] = [s, oldS - q * s];
    [oldT, t] = [t, oldT - q * t];
  }

  return { gcd: oldR < 0n ? -oldR : oldR, x: oldS, y: oldT, steps };
}

export function modInverse(value: bigint, modulus: bigint) {
  const positive = modulus < 0n ? -modulus : modulus;
  if (positive <= 1n) return null;
  const result = extendedGcd(mod(value, positive), positive);
  return result.gcd === 1n ? mod(result.x, positive) : null;
}

export function modPowTrace(base: bigint, exponent: bigint, modulus: bigint) {
  const rows: { bit: string; base: bigint; result: bigint; action: string }[] = [];
  if (modulus === 0n) return { value: 0n, rows };
  let result = 1n;
  let currentBase = mod(base, modulus);
  let currentExponent = exponent < 0n ? 0n : exponent;
  while (currentExponent > 0n) {
    const bit = currentExponent & 1n;
    const action = bit === 1n ? "multiply, then square" : "square only";
    if (bit === 1n) result = (result * currentBase) % modulus;
    rows.push({ bit: bit.toString(), base: currentBase, result, action });
    currentBase = (currentBase * currentBase) % modulus;
    currentExponent >>= 1n;
  }
  return { value: result, rows };
}

export function factorizeTrial(value: bigint, limit = 100000n) {
  let n = value < 0n ? -value : value;
  const factors: Factor[] = [];
  if (n < 2n) return factors;
  let divisor = 2n;
  while (divisor * divisor <= n && divisor <= limit) {
    let exponent = 0;
    while (n % divisor === 0n) {
      n /= divisor;
      exponent += 1;
    }
    if (exponent) factors.push({ prime: divisor, exponent });
    divisor = divisor === 2n ? 3n : divisor + 2n;
  }
  if (n > 1n) factors.push({ prime: n, exponent: 1 });
  return factors;
}

export function isPrimeTrial(value: bigint, limit = 100000n) {
  const n = value < 0n ? -value : value;
  if (n < 2n) return { prime: false, witness: null as bigint | null, checkedTo: 1n };
  if (n === 2n) return { prime: true, witness: null as bigint | null, checkedTo: 2n };
  if (n % 2n === 0n) return { prime: false, witness: 2n, checkedTo: 2n };
  let divisor = 3n;
  let checkedTo = 2n;
  while (divisor * divisor <= n && divisor <= limit) {
    checkedTo = divisor;
    if (n % divisor === 0n) return { prime: false, witness: divisor, checkedTo };
    divisor += 2n;
  }
  return { prime: divisor * divisor > n, witness: null as bigint | null, checkedTo };
}

export function eulerPhi(value: bigint) {
  const n = value < 0n ? -value : value;
  if (n === 0n) return 0n;
  return factorizeTrial(n).reduce((result, factor) => result / factor.prime * (factor.prime - 1n), n);
}

export function sieve(limit: number) {
  const safeLimit = Math.max(2, Math.min(10000, Math.floor(limit)));
  const composite = Array<boolean>(safeLimit + 1).fill(false);
  const primes: number[] = [];
  for (let candidate = 2; candidate <= safeLimit; candidate += 1) {
    if (composite[candidate]) continue;
    primes.push(candidate);
    for (let multiple = candidate * candidate; multiple <= safeLimit; multiple += candidate) {
      composite[multiple] = true;
    }
  }
  return primes;
}

export function chineseRemainder(rows: { remainder: bigint; modulus: bigint }[]) {
  const clean = rows.filter((row) => row.modulus > 1n);
  const product = clean.reduce((acc, row) => acc * row.modulus, 1n);
  const steps = clean.map((row) => {
    const partial = product / row.modulus;
    const inverse = modInverse(partial, row.modulus);
    const term = inverse === null ? 0n : row.remainder * partial * inverse;
    return { ...row, partial, inverse, term };
  });
  const solution = mod(steps.reduce((sum, step) => sum + step.term, 0n), product);
  const pairwiseCoprime = clean.every((row, index) => clean.every((other, otherIndex) => index >= otherIndex || gcdSteps(row.modulus, other.modulus).gcd === 1n));
  return { solution, modulus: product, steps, pairwiseCoprime };
}

export function discreteLogBruteForce(base: bigint, target: bigint, modulus: bigint, maxExponent = 2000) {
  const rows: { exponent: bigint; value: bigint; match: boolean }[] = [];
  let value = 1n;
  for (let exponent = 0n; exponent <= BigInt(maxExponent); exponent += 1n) {
    const match = value === mod(target, modulus);
    rows.push({ exponent, value, match });
    if (match) return { exponent, rows };
    value = (value * mod(base, modulus)) % modulus;
  }
  return { exponent: null as bigint | null, rows };
}

export function multiplicativeOrder(base: bigint, modulus: bigint, maxExponent = 10000) {
  if (gcdSteps(base, modulus).gcd !== 1n) return null;
  let value = 1n;
  for (let exponent = 1n; exponent <= BigInt(maxExponent); exponent += 1n) {
    value = (value * mod(base, modulus)) % modulus;
    if (value === 1n) return exponent;
  }
  return null;
}

export function primitiveRootRows(modulus: bigint) {
  const phi = eulerPhi(modulus);
  const candidates = Array.from({ length: Number(modulus > 200n ? 200n : modulus - 1n) }, (_, index) => BigInt(index + 1));
  return candidates.map((candidate) => {
    const order = multiplicativeOrder(candidate, modulus, Number(phi));
    return { candidate, order, generator: order === phi };
  });
}

export function gf256Multiply(a: number, b: number, polynomial = 0x11b) {
  let left = a & 0xff;
  let right = b & 0xff;
  let result = 0;
  const steps: { round: number; left: number; right: number; result: number; action: string }[] = [];
  for (let round = 0; round < 8; round += 1) {
    const action = (right & 1) ? "xor left into result" : "shift only";
    if (right & 1) result ^= left;
    steps.push({ round, left, right, result, action });
    const carry = left & 0x80;
    left = (left << 1) & 0xff;
    if (carry) left ^= polynomial & 0xff;
    right >>= 1;
  }
  return { value: result & 0xff, steps };
}

export interface CurvePoint {
  x: bigint;
  y: bigint;
}

export function isOnCurve(point: CurvePoint, a: bigint, b: bigint, p: bigint) {
  return mod(point.y * point.y, p) === mod(point.x * point.x * point.x + a * point.x + b, p);
}

export function ecAdd(left: CurvePoint | null, right: CurvePoint | null, a: bigint, p: bigint) {
  if (!left) return { point: right, slope: null as bigint | null, note: "left is point at infinity" };
  if (!right) return { point: left, slope: null as bigint | null, note: "right is point at infinity" };
  if (left.x === right.x && mod(left.y + right.y, p) === 0n) return { point: null, slope: null as bigint | null, note: "vertical line gives point at infinity" };
  const numerator = left.x === right.x && left.y === right.y ? 3n * left.x * left.x + a : right.y - left.y;
  const denominator = left.x === right.x && left.y === right.y ? 2n * left.y : right.x - left.x;
  const inverse = modInverse(denominator, p);
  if (inverse === null) return { point: null, slope: null as bigint | null, note: "slope denominator has no inverse" };
  const slope = mod(numerator * inverse, p);
  const x = mod(slope * slope - left.x - right.x, p);
  const y = mod(slope * (left.x - x) - left.y, p);
  return { point: { x, y }, slope, note: left.x === right.x && left.y === right.y ? "point doubling" : "point addition" };
}

export function ecScalarMultiply(point: CurvePoint, scalar: bigint, a: bigint, p: bigint) {
  let result: CurvePoint | null = null;
  let addend: CurvePoint | null = point;
  let k = scalar;
  const steps: { bit: string; result: string; addend: string; action: string }[] = [];
  const show = (value: CurvePoint | null) => value ? `(${value.x}, ${value.y})` : "O";
  while (k > 0n) {
    const bit = (k & 1n).toString();
    let action = "double addend";
    if (k & 1n) {
      result = ecAdd(result, addend, a, p).point;
      action = "add result + addend, then double";
    }
    steps.push({ bit, result: show(result), addend: show(addend), action });
    addend = ecAdd(addend, addend, a, p).point;
    k >>= 1n;
  }
  return { point: result, steps };
}
