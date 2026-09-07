"use client";

import Link from "next/link";
import { useMembership } from "@/hooks/useMembership";
import { useAddresses } from "@/lib/addresses";
import { Skeleton } from "@/components/ui/skeleton";
import AddressList from "@/components/Addresses/AddressList";
import type { Address } from "@/types/address";
import { findDefault } from "@/utils/findDefault";
import { useEffect } from "react";

export default function AddressSection({
  selectedId,
  onSelectAddress,
  onCardClick,
  onAddClick,
}: {
  selectedId: number | null;
  onSelectAddress: (id: number) => void;
  onCardClick: (address: Address) => void;
  onAddClick: () => void;
}) {
  const { isMember, isLoading: memberLoading } = useMembership();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const defaultAddress = addresses ? findDefault(addresses) : null;
  useEffect(() => {
    if (defaultAddress) {
      onSelectAddress(defaultAddress.id);
    }
  }, [defaultAddress, onSelectAddress]);
  if (memberLoading || (isMember && addressesLoading)) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="h-33 w-full rounded-[20px] bg-[#181818]" />
        <Skeleton className="h-33 w-full rounded-[20px] bg-[#181818]" />
      </div>
    );
  }
  if (!isMember) {
    return (
      <div className="mb-8 rounded-[20px] border border-white/8 bg-[#111111] px-8 py-10 text-center">
        <p className="mb-2 text-[15px] font-bold text-foreground">
          برای مدیریت آدرس‌ها وارد شو
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          برای انتخاب یا ثبت آدرس ارسال، ابتدا وارد حساب کاربری‌ات شو.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-full border border-white/25 px-7 py-3 text-sm text-foreground transition-colors hover:border-white/60 hover:bg-white/8"
        >
          ورود به حساب کاربری
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <AddressList
        addresses={addresses ?? []}
        selectedId={selectedId}
        onSelect={onSelectAddress}
        onCardClick={onCardClick}
        onAddClick={onAddClick}
      />
    </div>
  );
}
