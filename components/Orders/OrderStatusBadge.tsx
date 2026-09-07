import type { OrderStatus } from "@/types/checkout";

const STATUS_MAP: Record<
  string,
  { label: string; className: string }
> = {
  pending_payment: {
    label: "در انتظار پرداخت",
    className: "bg-yellow-500/10 text-yellow-500",
  },
  paid: {
    label: "پرداخت شده",
    className: "bg-green-500/10 text-green-500",
  },
  cancelled: {
    label: "لغو شده",
    className: "bg-red-500/10 text-red-500",
  },
  expired: {
    label: "منقضی شده",
    className: "bg-gray-500/10 text-gray-500",
  },
};

function getDefaultStatus(status: OrderStatus) {
  return {
    label: status || "نامشخص",
    className: "bg-white/10 text-muted-foreground",
  };
}

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_MAP[status] ?? getDefaultStatus(status);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
