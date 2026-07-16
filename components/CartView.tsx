"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart, useRemoveCartItem, useUpdateCartItem } from "@/lib/cart";
import { useAddresses } from "@/lib/addresses";
import { useMembership } from "@/hooks/useMembership";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CheckoutModal from "@/components/CheckoutModal";
import AddressSection from "@/components/Addresses/AddressSection";
import AddressModal from "@/components/Addresses/AddressModal";
import type { Address } from "@/types/address";

export default function CartView() {
  const { data: cart, isLoading, isError, refetch } = useCart();
  const { isMember } = useMembership();
  const { data: addresses } = useAddresses();

  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [addressModal, setAddressModal] = useState<{
    mode: "create" | "view" | "edit";
    address?: Address;
  } | null>(null);

  function handleContinuePurchase() {
    if (isMember) {
      const list = addresses ?? [];
      if (list.length === 0) {
        setAddressModal({ mode: "create" });
        return;
      }
      if (selectedAddressId == null) {
        const fallback = list.find((a) => a.is_default) ?? list[0];
        setSelectedAddressId(fallback.id);
      }
    }
    setCheckoutOpen(true);
  }

  function handleQtyChange(sku: string, nextQty: number) {
    if (nextQty < 1) {
      removeItem.mutate(sku);
      return;
    }
    updateItem.mutate({ sku, quantity: nextQty });
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-16 md:pt-40">
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <Skeleton
              key={i}
              className="h-24 w-full rounded-[20px] bg-[#181818]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 text-center md:px-16 md:pt-40">
        <p className="mb-3 text-lg font-bold text-foreground">
          سبد خرید بارگذاری نشد
        </p>
        <p className="mb-8 text-sm text-muted-foreground">
          مشکلی در ارتباط با سرور پیش آمد. لطفاً دوباره تلاش کن.
        </p>
        <Button onClick={() => refetch()}>تلاش دوباره</Button>
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-16 md:pt-40">
        <div className="rounded-[20px] border border-white/8 bg-[#111111] px-8 py-20 text-center">
          <p className="mb-3 text-lg font-bold text-foreground">
            سبد خریدت خالی است
          </p>
          <p className="mb-8 text-sm text-muted-foreground">
            محصولی اضافه نشده — از فروشگاه شروع کن.
          </p>
          <Link
            href="/store"
            className="inline-block rounded-full border border-white/25 px-7 py-3 text-sm text-foreground transition-colors hover:border-white/60 hover:bg-white/8"
          >
            رفتن به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  const mutating = updateItem.isPending || removeItem.isPending;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-6 md:px-16 md:pt-20">
      <h1 className="mb-8 text-[28px] font-black leading-[1.15] text-foreground md:text-[44px]">
        سبد خرید
      </h1>

      <AddressSection
        selectedId={selectedAddressId}
        onSelectAddress={setSelectedAddressId}
        onCardClick={(address) => setAddressModal({ mode: "view", address })}
        onAddClick={() => setAddressModal({ mode: "create" })}
      />
  
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.sku}
            className="flex flex-wrap items-center gap-4 rounded-[20px] border border-white/8 bg-[#111111] p-5"
          >
            <div className="min-w-[140px] flex-1">
              <p className="mb-1 text-[15px] text-foreground">
                {item.product_title}
              </p>
              <p className="text-sm text-muted-foreground">سایز: {item.size}</p>
            </div>

            <div className="flex items-center overflow-hidden rounded-full border border-white/15">
              <button
                type="button"
                disabled={mutating}
                onClick={() => handleQtyChange(item.sku, item.quantity - 1)}
                className="flex h-9 w-9 items-center justify-center bg-transparent text-lg text-foreground disabled:opacity-40"
              >
                −
              </button>
              <span className="w-7 text-center text-sm text-foreground">
                {item.quantity}
              </span>
              <button
                type="button"
                disabled={mutating}
                onClick={() => handleQtyChange(item.sku, item.quantity + 1)}
                className="flex h-9 w-9 items-center justify-center bg-transparent text-lg text-foreground disabled:opacity-40"
              >
                +
              </button>
            </div>

            <div
              style={{ direction: "ltr" }}
              className="w-24 text-left text-sm text-foreground"
            >
              ${item.price * item.quantity}
            </div>

            <Button
              variant="ghost"
              size="icon-sm"
              disabled={mutating}
              aria-label="حذف از سبد خرید"
              onClick={() => removeItem.mutate(item.sku)}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-white/8 pt-6">
        <span className="text-[15px] text-foreground">مجموع</span>
        <span
          style={{ direction: "ltr" }}
          className="text-xl font-bold text-foreground"
        >
          ${cart?.total_price ?? 0}
        </span>
      </div>

      <Button
        onClick={handleContinuePurchase}
        className="mt-6 w-full rounded-full py-6 text-[15px] font-bold"
      >
        ادامه فرآیند خرید
      </Button>

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        totalPrice={cart?.total_price ?? 0}
      />

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
