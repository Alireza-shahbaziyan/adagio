import type { Order, PaymentGateway } from "@/types/checkout";

/**
 * The backend can mark an order as expired either by flipping its status to
 * `expired` (the periodic expiry task) or by leaving it `pending_payment`
 * while `expires_at` has passed (`is_expired`). Both mean the same thing for
 * the payment UI.
 */
export function isOrderExpired(
  order: Pick<Order, "status" | "is_expired">,
): boolean {
  return order.status === "expired" || order.is_expired;
}

/**
 * Never send a gateway id that did not come from the gateway list currently
 * loaded from the backend. The selected id may be stale if the list changed
 * while the checkout page was open.
 */
export function findSelectedGateway(
  gateways: PaymentGateway[] | undefined,
  gatewayId: number | null,
): PaymentGateway | null {
  if (gatewayId === null || !gateways) {
    return null;
  }

  return gateways.find((gateway) => gateway.id === gatewayId) ?? null;
}

/**
 * A payment gateway may only be opened as a full-page navigation to an
 * absolute http(s) URL. Anything else (missing, relative, javascript:, ...)
 * must not be assigned to `window.location.href`.
 */
export function getSafePaymentRedirectUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}
