"use client";

import { useState } from "react";
import Link from "next/link";
import { useOrder, useCancelOrder, useUpdateOrderAddress, usePaymentGateways, usePayOrder } from "@/lib/checkout";
import { useAddresses } from "@/lib/addresses";
import { useAppState } from "@/lib/app-state";
import { ApiClientError } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import OrderStatusBadge from "@/components/Orders/OrderStatusBadge";
import AddressCard from "@/components/Addresses/AddressCard";
import AddressModal from "@/components/Addresses/AddressModal";
import type { Address } from "@/types/address";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function OrderCheckout({ token }: { token: string }) {
  const { showToast } = useAppState();
  const { data: order, isLoading: orderLoading, isError: orderError } = useOrder(token);
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const updateAddress = useUpdateOrderAddress();
  const cancelOrder = useCancelOrder();
  const { data: gateways, isLoading: gatewaysLoading } = usePaymentGateways();
  const payOrder = usePayOrder();

  const [selectedGatewayId, setSelectedGatewayId] = useState<number | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addressModal, setAddressModal] = useState<{
    mode: "create" | "view" | "edit";
    address?: Address;
  } | null>(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const isMutating = updateAddress.isPending || cancelOrder.isPending || payOrder.isPending;

  if (orderLoading) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-6 md:px-16 md:pt-20">
        <div className="mb-8">
          <Skeleton className="h-9 w-48 rounded-lg bg-[#181818]" />
        </div>
        <div className="flex flex-col gap-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-[20px] bg-[#181818]" />
          ))}
        </div>
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-6 text-center md:px-16 md:pt-20">
        <div className="rounded-[20px] border border-white/8 bg-[#111111] px-8 py-20">
          <p className="mb-3 text-lg font-bold text-foreground">
            سفارش پیدا نشد
          </p>
          <p className="mb-8 text-sm text-muted-foreground">
            سفارش موردنظر وجود ندارد یا دسترسی به آن امکان‌پذیر نیست.
          </p>
          <Link
            href="/store"
            className="inline-block rounded-full border border-white/25 px-7 py-3 text-sm text-foreground transition-colors hover:border-white/60 hover:bg-white/8"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  function handleAddressChange() {
    if (selectedAddressId == null || selectedAddressId === order!.address.id) return;
    updateAddress.mutate(
      { token: order!.token, address_id: selectedAddressId },
      {
        onSuccess: () => {
          showToast("آدرس سفارش به‌روزرسانی شد");
        },
        onError: (err) => {
          const message = err instanceof ApiClientError ? err.message : "خطا در تغییر آدرس";
          showToast(message);
        },
      },
    );
  }

  function handleCancel() {
    if (!confirmingCancel) {
      setConfirmingCancel(true);
      return;
    }
    cancelOrder.mutate(order!.token, {
      onSuccess: () => {
        showToast("سفارش لغو شد");
        setConfirmingCancel(false);
      },
      onError: (err) => {
        const message = err instanceof ApiClientError ? err.message : "خطا در لغو سفارش";
        showToast(message);
        setConfirmingCancel(false);
      },
    });
  }

  function handlePay() {
    if (selectedGatewayId == null) {
      showToast("یک درگاه پرداخت انتخاب کن");
      return;
    }
    payOrder.mutate(
      { token: order!.token, gateway_id: selectedGatewayId },
      {
        onSuccess: (data) => {
          if (data.redirect_url) {
            window.location.href = data.redirect_url;
          }
        },
        onError: (err) => {
          const message = err instanceof ApiClientError ? err.message : "شروع پرداخت ناموفق بود";
          showToast(message);
        },
      },
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-6 md:px-16 md:pt-20">
      <div className="mb-8 flex items-center gap-3">
        <h1 className="text-[28px] font-black leading-[1.15] text-foreground md:text-[44px]">
          سفارش {order.order_number}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="flex flex-col gap-4">
        {/* Order Summary */}
        <div className="rounded-[20px] border border-white/8 bg-[#111111] p-5">
          <h2 className="mb-3 text-sm font-bold text-foreground">
            خلاصه سفارش
          </h2>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>تاریخ ثبت</span>
              <span>{formatDate(order.created_at)}</span>
            </div>
            {order.paid_at && (
              <div className="flex justify-between">
                <span>تاریخ پرداخت</span>
                <span>{formatDate(order.paid_at)}</span>
              </div>
            )}
            {order.tracking_code && (
              <div className="flex justify-between">
                <span>کد پیگیری</span>
                <span style={{ direction: "ltr" }}>{order.tracking_code}</span>
              </div>
            )}
            {order.shipping_company && (
              <div className="flex justify-between">
                <span>شرکت ارسال</span>
                <span>{order.shipping_company}</span>
              </div>
            )}
            {order.expires_at && (
              <div className="flex justify-between">
                <span>تاریخ انقضا</span>
                <span>{formatDate(order.expires_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Address */}
        <div className="rounded-[20px] border border-white/8 bg-[#111111] p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">
              آدرس ارسال
            </h2>
            {order.is_payable && !order.is_expired && (
              <button
                type="button"
                onClick={() => {
                  setSelectedAddressId(order.address.id);
                }}
                className="text-xs text-muted-foreground underline-offset-2 hover:underline"
              >
                تغییر آدرس
              </button>
            )}
          </div>
          <div className="text-sm leading-[1.8] text-muted-foreground">
            <p>{order.address.recipient_name}</p>
            <p style={{ direction: "ltr" }} className="text-left">
              {order.address.phone}
            </p>
            <p className="truncate">{order.address.address_line}</p>
            <p style={{ direction: "ltr" }} className="text-left">
              {order.address.postal_code}
            </p>
          </div>
        </div>

        {/* Address Selection (shown when changing address) */}
        {selectedAddressId !== null && order.is_payable && !order.is_expired && (
          <div className="rounded-[20px] border border-white/8 bg-[#111111] p-5">
            <h2 className="mb-3 text-sm font-bold text-foreground">
              انتخاب آدرس جدید
            </h2>
            {addressesLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Skeleton className="h-33 w-full rounded-[20px] bg-[#181818]" />
                <Skeleton className="h-33 w-full rounded-[20px] bg-[#181818]" />
              </div>
            ) : addresses && addresses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {addresses.map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      selected={address.id === selectedAddressId}
                      onSelect={() => setSelectedAddressId(address.id)}
                      onOpen={() => setAddressModal({ mode: "view", address })}
                    />
                  ))}
                </div>
                <div className="mt-4 flex gap-3">
                  <Button
                    onClick={handleAddressChange}
                    disabled={selectedAddressId === order.address.id || updateAddress.isPending}
                    className="flex-1 rounded-full py-5"
                  >
                    {updateAddress.isPending ? "در حال ذخیره…" : "ذخیره آدرس"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedAddressId(null)}
                    disabled={updateAddress.isPending}
                    className="flex-1 rounded-full py-5"
                  >
                    انصراف
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                آدرسی ثبت نشده است.
              </p>
            )}
          </div>
        )}

        {/* Order Items */}
        <div className="rounded-[20px] border border-white/8 bg-[#111111] p-5">
          <h2 className="mb-3 text-sm font-bold text-foreground">
            اقلام سفارش
          </h2>
          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <div
                key={item.sku}
                className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm text-foreground">
                    {item.product_title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    سایز: {item.size} — تعداد: {item.quantity}
                  </p>
                </div>
                <div className="text-sm text-foreground">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Details */}
        <div className="rounded-[20px] border border-white/8 bg-[#111111] p-5">
          <h2 className="mb-3 text-sm font-bold text-foreground">
            جزئیات مالی
          </h2>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>جمع اقلام</span>
              <span>{formatPrice(order.subtotal_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>هزینه ارسال</span>
              <span>{formatPrice(order.shipping_amount)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between">
                <span>تخفیف</span>
                <span>-{formatPrice(order.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-white/8 pt-2 font-bold text-foreground">
              <span>مجموع</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Customer Note */}
        {order.customer_note && (
          <div className="rounded-[20px] border border-white/8 bg-[#111111] p-5">
            <h2 className="mb-2 text-sm font-bold text-foreground">
              یادداشت مشتری
            </h2>
            <p className="text-sm text-muted-foreground">
              {order.customer_note}
            </p>
          </div>
        )}

        {/* Payment Section */}
        {order.is_payable && !order.is_expired && !order.paid_at && (
          <div className="rounded-[20px] border border-white/8 bg-[#111111] p-5">
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
        )}

        {/* Expired Notice */}
        {order.is_expired && (
          <div className="rounded-xl border border-white/8 bg-[#111111] p-4 text-center">
            <p className="text-sm text-muted-foreground">
              این سفارش منقضی شده و قابل پرداخت نیست.
            </p>
            <Link
              href="/store"
              className="mt-3 inline-block text-sm font-medium text-foreground underline-offset-2 hover:underline"
            >
              بازگشت به فروشگاه
            </Link>
          </div>
        )}

        {/* Cancel Button */}
        {order.is_payable && !order.is_expired && (
          <div className="flex justify-center">
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isMutating}
              className="rounded-full px-8 py-5"
            >
              {cancelOrder.isPending
                ? "در حال لغو…"
                : confirmingCancel
                  ? "مطمئنید؟ لغو سفارش"
                  : "لغو سفارش"}
            </Button>
          </div>
        )}

        {confirmingCancel && !cancelOrder.isPending && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={() => setConfirmingCancel(false)}
              disabled={isMutating}
              className="text-sm text-muted-foreground"
            >
              انصراف
            </Button>
          </div>
        )}
      </div>

      <AddressModal
        open={addressModal !== null}
        mode={addressModal?.mode ?? "create"}
        address={addressModal?.address}
        onOpenChange={(open) => !open && setAddressModal(null)}
        onModeChange={(mode) =>
          setAddressModal((m) => (m ? { ...m, mode } : m))
        }
      />
    </div>
  );
}
