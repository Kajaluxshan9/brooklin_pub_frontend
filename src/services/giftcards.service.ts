const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface GiftCardPublicSettings {
  isEnabled: boolean;
  presetAmounts: number[];
  customAmountEnabled: boolean;
  customAmountMin: number;
  customAmountMax: number;
  interac: { email: string | null; recipientName: string | null; instructions: string | null } | null;
  bankDeposit: {
    bankName: string | null;
    accountName: string | null;
    institutionNumber: string | null;
    transitNumber: string | null;
    accountNumber: string | null;
    instructions: string | null;
  } | null;
}

export type GiftCardStatus =
  | "pending_verification"
  | "active"
  | "rejected"
  | "fully_redeemed"
  | "frozen"
  | "void";

export interface GiftCardCheckResult {
  code: string;
  status: GiftCardStatus;
  isLocked: boolean;
  requestedAmount: number;
  approvedAmount: number | null;
  amountAdjusted: boolean;
  rejectionReason: string | null;
  purchasedAt: string;
  activatedAt: string | null;
  pinVerified: boolean;
  balance?: number;
  history?: { type: string; amount: number; balanceAfter: number; date: string }[];
}

export interface PurchaseResult {
  code: string;
  status: GiftCardStatus;
  amount: number;
  message: string;
}

/** Error carrying the HTTP status and any extra fields the API sent (e.g. locked, attemptsRemaining). */
export class GiftCardApiError extends Error {
  status: number;
  locked?: boolean;
  attemptsRemaining?: number;
  constructor(message: string, status: number, extra: Record<string, unknown> = {}) {
    super(message);
    this.status = status;
    this.locked = extra.locked === true || status === 423;
    if (typeof extra.attemptsRemaining === "number") this.attemptsRemaining = extra.attemptsRemaining;
  }
}

async function handle<T>(res: Response): Promise<T> {
  if (res.ok) return res.json();
  let data: Record<string, unknown> = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON error */
  }
  const raw = data.message;
  const message = Array.isArray(raw)
    ? raw.join(". ")
    : typeof raw === "string"
      ? raw
      : res.status === 429
        ? "Too many requests. Please wait a few minutes and try again."
        : "Something went wrong. Please try again.";
  throw new GiftCardApiError(message, res.status, data);
}

export const giftCardsService = {
  getSettings: () =>
    fetch(`${API_BASE_URL}/giftcards/settings`).then((r) => handle<GiftCardPublicSettings>(r)),

  purchase: (form: FormData) =>
    fetch(`${API_BASE_URL}/giftcards/purchase`, { method: "POST", body: form }).then((r) =>
      handle<PurchaseResult>(r),
    ),

  check: (code: string, pin?: string) =>
    fetch(`${API_BASE_URL}/giftcards/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pin ? { code, pin } : { code }),
    }).then((r) => handle<GiftCardCheckResult>(r)),
};

/** Normalises user input like "bpgc 7k3m q9xa" → "BPGC-7K3M-Q9XA". */
export function normalizeGiftCardCode(input: string): string {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const body = raw.startsWith("BPGC") ? raw.slice(4) : raw;
  if (body.length !== 8) return input.trim().toUpperCase();
  return `BPGC-${body.slice(0, 4)}-${body.slice(4)}`;
}
