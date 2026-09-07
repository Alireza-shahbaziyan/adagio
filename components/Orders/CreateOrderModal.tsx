"use client";

import { useCreateOrders } from "@/hooks/useOrders";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useAppState } from "@/lib/app-state";


const createOrderSchema = z.object({
  orderDetails: z
    .string()
    .trim()
    .max(500, "توضیحات سفارش نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد")
    .refine(
      (value) => value === "" || value.length >= 3,
      "توضیحات سفارش باید حداقل ۳ کاراکتر باشد",
    ),
});

type CreateOrderFormData = z.infer<typeof createOrderSchema>;

interface CreateOrderModalProps {
  addressId: number;
  open: boolean;
  setOpen: (open: boolean) => void;

  onSuccess?: (orderToken: string) => void;
}

export default function CreateOrderModal({
  addressId,
  open,
  setOpen,
  onSuccess,
}: CreateOrderModalProps) {
  const {
    mutate: createOrder,
    isPending: isCreatingOrder,
    error: createOrderError,
  } = useCreateOrders();

  const { showToast } = useAppState();


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {

      orderDetails: "",
    },
  });

  const isLoading = isCreatingOrder;
  const onSubmit = (data: CreateOrderFormData) => {
    createOrder(
      {
        addressId,
        customerNote: data.orderDetails,
      },
      {
        onSuccess: (order) => {
          setOpen(false);
          onSuccess?.(order.token);
        },
        onError: (err) => {
          const message = err instanceof Error ? err.message : "ثبت سفارش ناموفق بود";
          showToast(message);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        dir="rtl"
        className="max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:max-w-md"
      >
        <DialogHeader className="space-y-2 text-right">
          <DialogTitle className="text-xl font-bold">
            ثبت سفارش
          </DialogTitle>

          <DialogDescription className="text-sm leading-6 text-muted-foreground">
            اطلاعات سفارش را بررسی کنید. پس از ثبت، به صفحه جزئیات سفارش هدایت
            می‌شوید برای انتخاب درگاه پرداخت.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-5">
          {/* Order note */}
          <div className="space-y-2">
            <label
              htmlFor="orderDetails"
              className="text-sm font-medium text-foreground"
            >
              یادداشت سفارش{" "}
              <span className="font-normal text-muted-foreground">
                (اختیاری)
              </span>
            </label>

            <Textarea
              id="orderDetails"
              {...register("orderDetails")}
              placeholder="مثلاً: لطفاً قبل از ارسال با من تماس بگیرید..."
              disabled={isLoading}
              className="mt-3 min-h-32 resize-none rounded-xl px-4 py-3 text-sm leading-6"
            />

            {errors.orderDetails && (
              <p className="text-sm text-destructive">
                {errors.orderDetails.message}
              </p>
            )}
          </div>

          {/* Create order error */}
          {createOrderError && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
              <p className="text-sm leading-6 text-destructive">
                {createOrderError.message || "خطایی در ثبت سفارش رخ داد."}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-xl"
              onClick={() => setOpen(false)}
              disabled={isCreatingOrder}
            >
              انصراف
            </Button>

            <Button
              type="submit"
              className="h-11 flex-1 rounded-xl"
              disabled={
                isCreatingOrder
              }
            >
              {isCreatingOrder ? "در حال ثبت..." : "ثبت و ادامه پرداخت"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}