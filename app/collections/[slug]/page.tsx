import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import Navbar from "@/components/Navbar";
import { CollectionResponse } from "@/types/collections";
import { Callection } from "@/types/singleCollection";
import { backend } from "@/utils/getURL";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const res = await fetch(`${backend}/api/collections/?page=1&page_size=100`);

  if (!res.ok) return [];

  const collections: CollectionResponse = await res.json();

  return collections.results.map((item) => ({
    slug: item.slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(`${backend}/api/collections/${slug}`, {
    next: {
      revalidate: 300,
    },
  });

  if (!res.ok) notFound();

  const collection: Callection = await res.json();

  return (
    <main className="relative overflow-hidden bg-light-in-dark text-white">
      <Navbar variant="default" />
      {/* background */}
      <div
        className="absolute left-1/2 top-0 h-125 w-175 -translate-x-1/2
       rounded-full bg-white/5 blur-lg"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-8">
        {/* Breadcrumb */}

        <div className="mb-10 text-sm text-neutral-500">
          <Link href="/" className="transition hover:text-white">
            خانه
          </Link>

          <span className="mx-2">/</span>

          <Link href="/collections" className="transition hover:text-white">
            کالکشن ها
          </Link>

          <span className="mx-2">/</span>

          <span className="text-neutral-300">{collection.title}</span>
        </div>

        {/* Hero */}

        <section className="max-w-4xl">
          <p className="mb-4 text-end uppercase tracking-[0.45em] text-neutral-500">
            Collection
          </p>

          <h1 className="text-4xl font-semibold leading-14 tracking-tight md:text-7xl">
            {collection.title}
          </h1>

          {collection.short_description && (
            <p className="mt-8 max-w-2xl leading-8 text-neutral-300">
              {collection.short_description}
            </p>
          )}
        </section>

        {/* Description */}

        {collection.description && (
          <section className="mt-24 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <h2 className="text-end text-sm uppercase tracking-[0.4em] text-neutral-500">
                About
              </h2>
            </div>

            <div className="lg:col-span-9">
              <div className="rounded-3xl border border-white/10 bg-white/3 p-8 backdrop-blur-sm">
                <p className="whitespace-pre-line leading-9 text-neutral-300">
                  {collection.description}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Children */}

        {collection.children.length > 0 && (
          <section className="mt-24">
            <h2 className="mb-8 text-2xl font-semibold">Categories</h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {collection.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/collections/${child.slug}`}
                  className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.06]"
                >
                  <h3 className="text-xl font-medium transition group-hover:text-white">
                    {child.title}
                  </h3>

                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-neutral-400">
                    {child.short_description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer/>
      <MobileBottomNav />
    </main>
  );
}
