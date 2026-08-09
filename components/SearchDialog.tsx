"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { getStoreProducts } from "@/lib/store";
import { queryKeys } from "@/lib/queryKeys";

export default function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setDebounced("");
    }
  }, [open]);

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.products.search(debounced),
    queryFn: () => getStoreProducts({ search: debounced }),
    enabled: debounced.length > 0,
  });

  const results = data?.results ?? [];

  function handleSelect(slug: string) {
    onOpenChange(false);
    router.push(`/store/products/${slug}`);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="جستجوی محصول"
      description="نام محصول مورد نظرت را جستجو کن"
    >
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="جستجوی محصول…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {debounced.length === 0 ? (
            <CommandEmpty>برای جستجو، نام محصول را تایپ کن…</CommandEmpty>
          ) : isLoading ? (
            <div className="flex flex-col gap-2 p-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : isError ? (
            <CommandEmpty>
              مشکلی در جستجو پیش آمد. دوباره امتحان کن.
            </CommandEmpty>
          ) : results.length === 0 ? (
            <CommandEmpty>محصولی با این نام پیدا نشد.</CommandEmpty>
          ) : (
            <CommandGroup heading={`${data?.count ?? results.length} نتیجه`}>
              {results.map((product) => {
                const image = product.images?.[0]?.image;
                const price = product.variants?.[0]?.price;
                return (
                  <CommandItem
                    key={product.id}
                    value={`${product.title} ${product.slug}`}
                    onSelect={() => handleSelect(product.slug)}
                  >
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                      {image && (
                        <Image
                          src={image}
                          alt={product.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col overflow-hidden">
                      <span className="truncate">{product.title}</span>
                      {price != null && (
                        <span
                          style={{ direction: "ltr" }}
                          className="text-xs text-muted-foreground"
                        >
                          ${price}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
