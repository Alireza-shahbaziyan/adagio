"use client";

import { Plus } from "lucide-react";
import AddressCard from "@/components/Addresses/AddressCard";
import type { Address } from "@/types/address";

export default function AddressList({
  addresses,
  selectedId,
  onSelect,
  onCardClick,
  onAddClick,
}: {
  addresses: Address[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onCardClick: (address: Address) => void;
  onAddClick: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          selected={address.id === selectedId}
          onSelect={() => onSelect(address.id)}
          onOpen={() => onCardClick(address)}
        />
      ))}

      <button
        type="button"
        onClick={onAddClick}
        className="flex min-h-[132px] flex-col items-center justify-center gap-2 rounded-[20px] border border-dashed border-white/20 p-5 text-sm text-muted-foreground transition-colors hover:border-white/40 hover:text-foreground"
      >
        <Plus size={20} />
        افزودن آدرس
      </button>
    </div>
  );
}
