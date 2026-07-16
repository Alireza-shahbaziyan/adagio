"use client";

import { Badge } from "@/components/ui/badge";
import type { Address } from "@/types/address";

export default function AddressCard({
  address,
  selected,
  onSelect,
  onOpen,
}: {
  address: Address;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}) {
  return (
    <div
      onClick={onOpen}
      className={`flex cursor-pointer flex-col gap-3 rounded-[20px] border p-5 transition-colors ${
        selected
          ? "border-foreground/60 bg-[#111111] ring-1 ring-foreground/30"
          : "border-white/8 bg-[#111111] hover:border-white/20"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <label
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="radio"
            name="shipping-address"
            checked={selected}
            onChange={onSelect}
            className="h-4 w-4 accent-foreground"
          />
          <span className="text-[15px] font-bold text-foreground">
            {address.title}
          </span>
        </label>
        {address.is_default && <Badge variant="secondary">پیش‌فرض</Badge>}
      </div>

      <div className="text-sm leading-[1.8] text-muted-foreground">
        <p>{address.recipient_name}</p>
        <p style={{ direction: "ltr" }} className="text-left">
          {address.phone}
        </p>
        <p className="truncate">{address.address_line}</p>
      </div>
    </div>
  );
}
