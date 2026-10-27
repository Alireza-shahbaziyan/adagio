import { describe, expect, it } from "vitest";

import type { PaymentGateway } from "@/types/checkout";
import {
  findSelectedGateway,
  getSafePaymentRedirectUrl,
  isOrderExpired,
} from "@/utils/payment";

const gateways: PaymentGateway[] = [
  {
    id: 3,
    title: "درگاه تست",
    badge: null,
    description: null,
    min_amount: null,
    max_amount: null,
  },
];

describe("isOrderExpired", () => {
  it("treats an expired status as expired", () => {
    expect(isOrderExpired({ status: "expired", is_expired: false })).toBe(true);
  });

  it("treats a pending order past expires_at as expired", () => {
    expect(
      isOrderExpired({ status: "pending_payment", is_expired: true }),
    ).toBe(true);
  });

  it("treats a payable order as not expired", () => {
    expect(
      isOrderExpired({ status: "pending_payment", is_expired: false }),
    ).toBe(false);
    expect(isOrderExpired({ status: "paid", is_expired: false })).toBe(false);
  });
});

describe("findSelectedGateway", () => {
  it("returns a gateway that exists in the backend list", () => {
    expect(findSelectedGateway(gateways, 3)).toEqual(gateways[0]);
  });

  it("rejects ids that are not in the loaded list", () => {
    expect(findSelectedGateway(gateways, 0)).toBeNull();
    expect(findSelectedGateway(gateways, 99)).toBeNull();
    expect(findSelectedGateway(undefined, 3)).toBeNull();
    expect(findSelectedGateway(gateways, null)).toBeNull();
  });
});

describe("getSafePaymentRedirectUrl", () => {
  it("accepts absolute http(s) gateway URLs", () => {
    expect(
      getSafePaymentRedirectUrl("https://www.zarinpal.com/pg/StartPay/A000"),
    ).toBe("https://www.zarinpal.com/pg/StartPay/A000");
    expect(getSafePaymentRedirectUrl("http://localhost:8000/callback")).toBe(
      "http://localhost:8000/callback",
    );
  });

  it("rejects missing, relative, or non-http(s) redirect targets", () => {
    expect(getSafePaymentRedirectUrl(undefined)).toBeNull();
    expect(getSafePaymentRedirectUrl(null)).toBeNull();
    expect(getSafePaymentRedirectUrl("")).toBeNull();
    expect(getSafePaymentRedirectUrl("/store/orders")).toBeNull();
    expect(getSafePaymentRedirectUrl("//evil.example/pay")).toBeNull();
    expect(getSafePaymentRedirectUrl("javascript:alert(1)")).toBeNull();
    expect(getSafePaymentRedirectUrl("data:text/html,hello")).toBeNull();
    expect(getSafePaymentRedirectUrl(123)).toBeNull();
  });
});
