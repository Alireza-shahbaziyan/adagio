"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  // DialogHeader,
  // DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppState } from "@/lib/app-state";
import { useDeleteAddress } from "@/lib/addresses";
import { useProvinces, useCities } from "@/lib/locations";
import AddressForm from "@/components/Addresses/AddressForm";
import type { Address } from "@/types/address";

type Mode = "create" | "view" | "edit";

export default function AddressModal({
  open,
  mode,
  address,
  onOpenChange,
  onModeChange,
}: {
  open: boolean;
  mode: Mode;
  address?: Address;
  onOpenChange: (open: boolean) => void;
  onModeChange: (mode: Mode) => void;
}) {
  
  const { showToast } = useAppState();
  const deleteAddress = useDeleteAddress();

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { data: provinces } = useProvinces();
  
  const { data: cities } = useCities(address?.province ?? null);

  useEffect(() => {
    if (!open) setConfirmingDelete(false);
  }, [open]);

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) setConfirmingDelete(false);
  }

  function handleDelete() {
    if (!address) return;
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    deleteAddress.mutate(address.id, {
      onSuccess: () => {
        showToast("آدرس حذف شد");
        handleOpenChange(false);
      },
      onError: (err) => {
        showToast(err.message);
        setConfirmingDelete(false);
      },
    });
  }

  const provinceName = provinces?.find((p) => p.id === address?.province)?.name;
  const cityName = cities?.find((c) => c.id === address?.city)?.id;

  // const titles: Record<Mode, string> = {
  //   create: "افزودن آدرس جدید",
  //   view: "جزئیات آدرس",
  //   edit: "ویرایش آدرس",
  // };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-md">
        {/* <DialogHeader>
          <DialogTitle>{titles[mode]}</DialogTitle>
          {mode === "create" && (
            <DialogDescription>
              یک آدرس جدید برای ارسال سفارش ثبت کن.
            </DialogDescription>
          )}
        </DialogHeader> */}

        {mode === "view" && address ? (
          <div className="flex flex-col gap-5">
            <div className="text-sm leading-[1.9] text-muted-foreground">
              <p className="mb-1 text-[15px] font-bold text-foreground">
                {address.title}
              </p>
              <p>{address.recipient_name}</p>
              <p style={{ direction: "ltr" }} className="text-right">
                {address.phone}
              </p>
              <div>
                {provinceName ?? (
                  <Skeleton className="inline-block h-4 w-16 align-middle" />
                )}
                {"، "}
                {cityName ?? (
                  <Skeleton className="inline-block h-4 w-16 align-middle" />
                )}
              </div>
              <p style={{ direction: "ltr" }} className="text-right">
                {address.postal_code}
              </p>
              <p>{address.address_line}</p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-full py-5"
                onClick={() => onModeChange("edit")}
              >
                ویرایش
              </Button>
              <Button
                variant="destructive"
                disabled={deleteAddress.isPending}
                className="flex-1 rounded-full py-5"
                onClick={handleDelete}
              >
                {deleteAddress.isPending
                  ? "در حال حذف…"
                  : confirmingDelete
                    ? "مطمئنی؟"
                    : "حذف آدرس"}
              </Button>
            </div>
          </div>
        ) : (
          <AddressForm
            address={mode === "edit" ? address : undefined}
            onSuccess={() => handleOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
