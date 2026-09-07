"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaymentGateways, usePayOrder } from "@/lib/checkout";
import { useAppState } from "@/lib/app-state";
import { ApiClientError } from "@/lib/api-client";
import type { Order } from "@/types/checkout";

export default function PaymentAction({ order }: { order: Order }) {
  const { showToast } = useAppState();
  const { data: gateways, isLoading: gatewaysLoading } = usePaymentGateways();
  const payOrder = usePayOrder();
  const [selectedGatewayId, setSelectedGatewayId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (gateways && gateways.length > 0 && selectedGatewayId === null) {
      setSelectedGatewayId(gateways[0].id);
    }
  }, [gateways, selectedGatewayId]);

  function handlePay() {
    if (selectedGatewayId == null) {
      showToast("یک درگاه پرداخت انتخاب کن");
      return;
    }

    payOrder.mutate(
      { token: order.token, gateway_id: selectedGatewayId },
      {
        onSuccess: (data) => {
          if (data.redirect_url) {
            window.location.href = data.redirect_url;
          }
        },
        onError: (err) => {
          const message =
            err instanceof ApiClientError
              ? err.message
              : "شروع پرداخت ناموفق بود";
          showToast(message);
        },
      },
    );
  }

  if (!order.is_payable) {
    return null;
  }

  if (order.is_expired) {
    return (
      <div className="rounded-xl border border-white/8 bg-[#111111] p-4 text-center">
        <p className="text-sm text-muted-foreground">
          این سفارش منقضی شده و قابل پرداخت نیست.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/8 bg-[#111111] p-4">
      <p className="mb-3 text-sm font-bold text-foreground">
        انتخاب درگاه پرداخت
      </p>

      {gatewaysLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full rounded-lg bg-[#181818]" />
          <Skeleton className="h-12 w-full rounded-lg bg-[#181818]" />
        </div>
      ) : gateways && gateways.length > 0 ? (
        <div className="flex flex-col gap-2">
          {gateways.map((gw) => (
            <label
              key={gw.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                selectedGatewayId === gw.id
                  ? "border-foreground/60 ring-1 ring-foreground/30"
                  : "border-white/8 hover:border-white/20"
              }`}
            >
              <input
                type="radio"
                name="order-gateway"
                checked={selectedGatewayId === gw.id}
                onChange={() => setSelectedGatewayId(gw.id)}
                className="h-4 w-4 accent-foreground"
              />
              <div className="flex-1">
                <span className="text-sm font-bold text-foreground">
                  {gw.title}
                </span>
                {gw.badge && (
                  <span className="mr-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-muted-foreground">
                    {gw.badge}
                  </span>
                )}
              </div>
            </label>
          ))}

          <Button
            onClick={handlePay}
            disabled={selectedGatewayId == null || payOrder.isPending}
            className="mt-2 w-full rounded-full py-5"
          >
            {payOrder.isPending ? "در حال اتصال…" : "پرداخت"}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          درگاه پرداختی فعال نیست.
        </p>
      )}
    </div>
  );
}