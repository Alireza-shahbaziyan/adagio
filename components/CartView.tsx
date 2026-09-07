"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useCart, useRemoveCartItem, useUpdateCartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import AddressSection from "@/components/Addresses/AddressSection";
import AddressModal from "@/components/Addresses/AddressModal";
import type { Address } from "@/types/address";
import CreateOrderModal from "./Orders/CreateOrderModal";

export default function CartView() {
  const router = useRouter();
  const { data: cart, isLoading, isError, refetch } = useCart();

  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const [ordersOpen, setOrdersOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [addressModal, setAddressModal] = useState<{
    mode: "create" | "view" | "edit";
    address?: Address;
  } | null>(null);

  function handleContinuePurchase() {
    if (selectedAddressId) {
      setOrdersOpen(true);
    }
  }

  function handleOrderSuccess(orderToken: string) {
    router.push(`/store/orders/${orderToken}`);
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
        <h1 className="mb-3 text-2xl font-bold text-foreground">
          خطا در بارگذاری سبد خرید
        </h1>
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
      <>
   
        <div className="mx-auto max-w-3xl px-5 pb-20 pt-20 md:px-16 md:pt-12">
          <div className="rounded-[20px] border border-white/8 bg-[#111111] px-8 py-20 text-center">
            <p className="mb-3 text-lg font-bold text-yellow-400">
              سبد خریدت خالی است
            </p>
            <p className="mb-8 text-sm text-muted-foreground">
              محصولی اضافه نشده — از فروشگاه شروع کن.
            </p>
            <Link
              href="/store"
              className="inline-block rounded-full text-green-400 border border-white/25 px-7 py-3 text-sm transition-colors hover:border-white/60 hover:bg-white/8"
            >
              رفتن به فروشگاه
            </Link>
          </div>
        </div>
      </>
    );
  }

  const mutating = updateItem.isPending || removeItem.isPending;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-6 md:px-16 md:pt-20">


      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/store/orders"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:border-white/30 hover:text-foreground"
        >
          سفارش‌های من
        </Link>
      </div>

      <h2 className="mb-4 text-lg font-bold text-foreground">آدرس ارسال</h2>
      <AddressSection
        selectedId={selectedAddressId}
        onSelectAddress={setSelectedAddressId}
        onCardClick={(address) => setAddressModal({ mode: "view", address })}
        onAddClick={() => setAddressModal({ mode: "create" })}
      />
      <h2 className="mb-4 text-lg font-bold text-foreground">
        محصولات سبد خرید
      </h2>
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
              className="w-24 text-left text-sm text-foreground"
            >
              {formatPrice(item.price * item.quantity)}
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
          className="text-xl font-bold text-foreground"
        >
          {formatPrice(cart?.total_price ?? 0)}
        </span>
      </div>

      <Button
        onClick={handleContinuePurchase}
        className="mt-6 w-full rounded-full py-6 text-[15px] font-bold"
      >
        ادامه فرآیند خرید
      </Button>

      <AddressModal
        open={addressModal !== null}
        mode={addressModal?.mode ?? "create"}
        address={addressModal?.address}
        onOpenChange={(open) => !open && setAddressModal(null)}
        onModeChange={(mode) =>
          setAddressModal((m) => (m ? { ...m, mode } : m))
        }
      />
      <CreateOrderModal
        addressId={selectedAddressId ?? 0}
        open={ordersOpen}
        setOpen={setOrdersOpen}
        onSuccess={handleOrderSuccess}
      />
    </div>
  );
}
