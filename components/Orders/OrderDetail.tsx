"use client";

import type { Order } from "@/types/checkout";
import OrderStatusBadge from "@/components/Orders/OrderStatusBadge";
import PaymentAction from "@/components/Orders/PaymentAction";
import { formatPrice } from "@/lib/utils";

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

export default function OrderDetail({ order }: { order: Order }) {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-6 md:px-16 md:pt-20">
      <div className="mb-8 flex items-center gap-3">
        <h1 className="text-[28px] font-black leading-[1.15] text-foreground md:text-[44px]">
          سفارش {order.order_number}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="flex flex-col gap-4">
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
                <span style={{ direction: "ltr" }}>
                  {order.tracking_code}
                </span>
              </div>
            )}
            {order.shipping_company && (
              <div className="flex justify-between">
                <span>شرکت ارسال</span>
                <span>{order.shipping_company}</span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[20px] border border-white/8 bg-[#111111] p-5">
          <h2 className="mb-3 text-sm font-bold text-foreground">
            آدرس ارسال
          </h2>
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
                <div
                  className="text-sm text-foreground"
                >
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] border border-white/8 bg-[#111111] p-5">
          <h2 className="mb-3 text-sm font-bold text-foreground">
            جزئیات مالی
          </h2>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>جمع اقلام</span>
              <span>
                {formatPrice(order.subtotal_amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>هزینه ارسال</span>
              <span>
                {formatPrice(order.shipping_amount)}
              </span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between">
                <span>تخفیف</span>
                <span>
                  -{formatPrice(order.discount_amount)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-white/8 pt-2 font-bold text-foreground">
              <span>مجموع</span>
              <span>
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </div>
        </div>

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

        {order.is_payable && !order.paid_at && (
          <PaymentAction order={order} />
        )}
      </div>
    </div>
  );
}
