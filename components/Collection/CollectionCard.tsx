import Image from "next/image";
import { Collection } from "@/types/singleProduct";
import { ChevronLeftIcon } from "../icons";
import Link from "next/link";

function CollectionCard({
  collection,
  link
}: {
  collection: Collection;
  link:string
}) {
  return (
    <Link
      href={`${link}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-white/6 bg-[#181818] transition-all duration-500 ease-[cubic-bezier(.16,.8,.24,1)] hover:-translate-y-1.5 hover:border-white/[0.16] hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
    >
      {/* Image */}
      <div className="relative h-80 md:h-96 w-full overflow-hidden">
        {collection.image ? (
          <>
            <Image
              src={collection.image}
              alt={collection.title}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/20" />
          </>
        ) : (
          <div className="h-full w-full bg-[#111]" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-8 md:p-9">
        {/* <span
          style={{ direction: "ltr" }}
          className="font-instrument-serif mb-6 block text-lg italic text-[#6b6b6b] transition-colors duration-500 group-hover:text-muted-foreground"
        >
          A{index + 1}
        </span> */}

        <h2 className="mb-3 text-[26px] font-black leading-tight text-foreground md:text-3xl">
          {collection.title}
        </h2>

        {collection.short_description && (
          <p className="mb-8 line-clamp-2 text-sm md:text-base leading-[1.8] text-muted-foreground">
            {collection.short_description}
          </p>
        )}

        <div className="mt-auto">
          <div className="relative h-px w-full bg-white/10">
            <span className="absolute inset-y-0 right-0 w-0 bg-foreground transition-all duration-500 ease-out group-hover:w-full" />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span
              className="eq-bars opacity-0 transition-opacity duration-300 group-hover:opacity-100
             [&>span]:bg-foreground"
            >
              <span />
              <span />
              <span />
              <span />
            </span>

            <span className="flex items-center gap-2 text-[13px] text-foreground">
              مشاهده کالکشن
              <ChevronLeftIcon size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CollectionCard;
