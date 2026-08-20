"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, SearchIcon } from "@/components/icons";
import {
  ORDERING_OPTIONS,
  buildStoreQuery,
  type StoreQueryState,
} from "@/lib/store";
import type { Collection } from "@/types/singleProduct";

const FEATURED_OPTIONS: { value: "" | "true" | "false"; label: string }[] = [
  { value: "", label: "همه" },
  { value: "true", label: "ویژه" },
  { value: "false", label: "غیرویژه" },
];

function pillClass(active: boolean) {
  return cn(
    "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[13px] transition-colors",
    active
      ? "border-foreground bg-foreground text-primary-foreground font-bold"
      : "border-white/[0.15] text-muted-foreground hover:border-white/40 hover:text-foreground",
  );
}

export default function StoreFilters({
  collections,
  activeCollectionSlug,
  queryState,
  resultCount,
}: {
  collections: Collection[];
  activeCollectionSlug?: string;
  queryState: StoreQueryState;
  resultCount: number;
}) {
  const router = useRouter();
  const basePath = activeCollectionSlug
    ? `/store/collection/${activeCollectionSlug}`
    : "/store";

  const [searchValue, setSearchValue] = useState(queryState.search ?? "");
  const [collectionOpen, setCollectionOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchValue(queryState.search ?? "");
  }, [queryState.search]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function navigate(path: string, overrides: Partial<StoreQueryState>) {
    router.push(`${path}${buildStoreQuery(queryState, overrides)}#featured`);
  }

  function handleSearchChange(value: string) {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      navigate(basePath, { search: value, page: "1" });
    }, 400);
  }

  function handleCollectionSelect(slug?: string) {
    setCollectionOpen(false);
    navigate(slug ? `/store/collection/${slug}` : "/store", { page: "1" });
  }

  const activeCollection = collections.find(
    (c) => c.slug === activeCollectionSlug,
  );
  const activeOrdering =
    ORDERING_OPTIONS.find((option) => option.value === queryState.ordering) ??
    ORDERING_OPTIONS[0];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#6b6b6b]">
            <SearchIcon size={16} />
          </span>
          <input
            type="search"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              if (debounceRef.current) clearTimeout(debounceRef.current);
              navigate(basePath, { search: searchValue, page: "1" });
            }}
            placeholder="جستجوی محصول…"
            aria-label="جستجوی محصول"
            className="h-12 w-full rounded-full border border-white/12 bg-[#111111] py-2 pr-11 pl-5 text-sm text-foreground outline-none transition-colors placeholder:text-[#6b6b6b] focus:border-white/40"
          />
        </div>

        {/* Collection combobox */}
        <Popover open={collectionOpen} onOpenChange={setCollectionOpen}>
          <PopoverTrigger className="flex h-12 min-w-45 items-center justify-between gap-2 rounded-full border border-white/[0.12] bg-[#111111] px-5 text-sm text-foreground transition-colors hover:border-white/40">
            <span className="truncate">
              {activeCollection ? activeCollection.title : "همه کالکشن‌ها"}
            </span>
            <ChevronDownIcon size={14} />
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-70 border-white/1 bg-[#181818] p-0 text-foreground"
          >
            <Command className="bg-transparent">
              <CommandInput placeholder="جستجوی کالکشن…" />
              <CommandList>
                <CommandEmpty className="text-muted-foreground">
                  کالکشنی پیدا نشد
                </CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="همه کالکشن‌ها all"
                    data-checked={!activeCollectionSlug}
                    onSelect={() => handleCollectionSelect(undefined)}
                  >
                    همه کالکشن‌ها
                  </CommandItem>
                  {collections.map((collection) => (
                    <CommandItem
                      key={collection.id}
                      value={`${collection.title} ${collection.slug}`}
                      data-checked={collection.slug === activeCollectionSlug}
                      onSelect={() => handleCollectionSelect(collection.slug)}
                    >
                      {collection.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Ordering */}
        <div className="flex flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="مرتب‌سازی بر اساس"
              className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/[0.15] bg-transparent px-4 py-2 text-[13px] text-muted-foreground outline-none transition-colors hover:border-white/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-popup-open:border-white/40 data-popup-open:text-foreground"
            >
              {activeOrdering.label}
              <ChevronDownIcon size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              sideOffset={2}
              align="start"
              collisionAvoidance={{ side: "none" }}
              className="w-auto min-w-40 border-white/10 bg-[#181818] text-foreground"
            >
              <DropdownMenuRadioGroup
                value={activeOrdering.value}
                onValueChange={(value) =>
                  navigate(basePath, { ordering: value, page: "1" })
                }
              >
                {ORDERING_OPTIONS.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                    closeOnClick
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Featured */}
        <div className="flex gap-2">
          {FEATURED_OPTIONS.map((option) => (
            <Link
              key={option.value || "all"}
              href={`${basePath}${buildStoreQuery(queryState, { featured: option.value || undefined, page: "1" })}#featured`}
              className={pillClass(
                (queryState.featured ?? "") === option.value,
              )}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      <p style={{ direction: "ltr" }} className="text-sm text-muted-foreground">
        {resultCount} محصول
      </p>
    </div>
  );
}
