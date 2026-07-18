import MobileBottomNav from "@/components/MobileBottomNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "راهنمای خرید و ارسال مرسولات | آداجیو",
  description:
    "راهنمای کامل ثبت سفارش، ضمانت محصولات، نحوه ارسال، شرایط بازگشت کالا و پاسخ به سوالات متداول فروشگاه آداجیو.",
  alternates: {
    canonical: "/shipping-guide",
  },
};

const orderSteps = [
  {
    title: "1-ثبت سفارش",
    description:
      "محصول مورد نظر خود را انتخاب کرده و پس از تکمیل اطلاعات، سفارش خود را ثبت کنید.",
  },
  {
    title: "2-بررسی توسط کارشناسان",
    description:
      "سفارش شما توسط تیم آداجیو بررسی و برای آماده‌سازی نهایی تایید می‌شود.",
  },
  {
    title: "3-ارسال سفارش",
    description:
      "پس از آماده‌سازی، سفارش در کوتاه‌ترین زمان ممکن بسته‌بندی و ارسال خواهد شد.",
  },
  {
    title: "4-تحویل سفارش",
    description:
      "مرسوله توسط شرکت حمل به آدرس ثبت‌شده ارسال شده و به شما تحویل داده می‌شود.",
  },
];

const warrantyItems = [
  {
    title: "1. کالا مشکل دارد",
    description:
      "در صورت وجود هرگونه ایراد در محصول، پس از بررسی امکان تعویض یا مرجوعی فراهم خواهد بود.",
  },
  {
    title: "2. ناقص بودن تعداد",
    description:
      "اگر تعداد اقلام سفارش با فاکتور مطابقت نداشته باشد، موضوع را به پشتیبانی اطلاع دهید.",
  },
  {
    title: "3. ارسال کالای اشتباه",
    description:
      "در صورت ارسال محصول اشتباه، هزینه تعویض بر عهده آداجیو خواهد بود.",
  },
  {
    title: "4. عدم فروش",
    description:
      "محصولاتی که استفاده نشده باشند و شرایط اولیه را حفظ کرده باشند، مطابق قوانین امکان بررسی برای مرجوعی دارند.",
  },
  {
    title: "5. مشکل در دوخت",
    description:
      "اگر محصول دارای ایراد در دوخت یا کیفیت تولید باشد، پس از بررسی تعویض خواهد شد.",
  },
  {
    title: "6. به هر دلیلی",
    description:
      "در صورت وجود هرگونه مشکل یا سوال، کافی است با پشتیبانی آداجیو در ارتباط باشید تا بهترین راهکار ارائه شود.",
  },
];

export default function ShippingGuidePage() {
  return (
    <>
      <main className="container mx-auto max-w-5xl px-4 py-12 mt-5">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold md:text-4xl">
            راهنمای خرید و ارسال مرسولات
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground leading-8">
            از ثبت سفارش تا تحویل نهایی، تیم آداجیو تلاش می‌کند خریدی سریع،
            مطمئن و بدون دغدغه را برای شما فراهم کند. در این صفحه می‌توانید
            تمامی مراحل خرید، شرایط ضمانت و قوانین ارسال سفارش‌ها را مشاهده
            کنید.
          </p>
        </header>

        <section className="mb-12 rounded-2xl border p-6">
          <h3 className="mb-4 text-2xl font-semibold">شیوه ثبت سفارش</h3>

          <p className="leading-8 text-muted-foreground">
            سفارش محصولات از طریق وب‌سایت انجام می‌شود. پس از انتخاب محصول، سایز
            مورد نظر را انتخاب کرده و اطلاعات ارسال را تکمیل کنید. پس از ثبت
            موفق سفارش، اطلاعات آن برای بررسی و آماده‌سازی در اختیار تیم آداجیو
            قرار می‌گیرد.
          </p>
        </section>

        <section className="mb-12 rounded-2xl border p-6">
          <h3 className="mb-6 text-2xl font-semibold">ضمانت محصولات</h3>

          <div className="space-y-8">
            {warrantyItems.map((item) => (
              <article key={item.title}>
                <h4 className="mb-2 text-lg font-semibold">{item.title}</h4>

                <p className="leading-8 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-2xl border p-6">
          <h3 className="mb-8 text-2xl font-semibold">ارسال مرسولات</h3>

          <div className="grid gap-6 md:grid-cols-2">
            {orderSteps.map((step) => (
              <article key={step.title} className="rounded-xl border p-5">
                <h3 className="mb-3 text-lg font-semibold">{step.title}</h3>

                <p className="leading-8 text-muted-foreground">
                  {step.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-xl bg-primary/5 p-6">
            <h5 className="text-lg font-bold">
              ارسال سفارشات بدون تاخیر و فوری میباشد. 🚚
            </h5>

            <p className="mt-3 leading-8 text-muted-foreground">
              سفارش‌ها در سریع‌ترین زمان ممکن آماده‌سازی شده و پس از تایید، برای
              ارسال تحویل شرکت حمل می‌شوند تا در کوتاه‌ترین زمان به دست شما
              برسند.
            </p>
          </div>

          <div className="mt-10">
            <h4 className="mb-3 text-xl font-semibold">روش‌های ارسال:</h4>

            <ul className="list-disc space-y-2 pr-5 leading-8 text-muted-foreground">
              <li>ارسال از طریق پست پیشتاز.</li>
              <li>ارسال با تیپاکس در شهرهای تحت پوشش.</li>
              <li>ارسال با باربری یا روش توافقی برای سفارش‌های خاص.</li>
            </ul>
          </div>

          <div className="mt-10">
            <h4 className="mb-3 text-xl font-semibold">نکات قانونی:</h4>

            <ul className="list-disc space-y-2 pr-5 leading-8 text-muted-foreground">
              <li>
                لطفاً هنگام ثبت سفارش، اطلاعات گیرنده را با دقت وارد کنید.
              </li>
              <li>پس از تحویل مرسوله، سلامت بسته‌بندی را بررسی نمایید.</li>
              <li>
                شرایط مرجوعی تنها برای کالاهای استفاده‌نشده و مطابق قوانین
                فروشگاه امکان‌پذیر است.
              </li>
              <li>
                در صورت بروز هرگونه مشکل، پیش از هر اقدامی با پشتیبانی تماس
                بگیرید.
              </li>
            </ul>
          </div>

          <div className="mt-10 rounded-xl border bg-muted/30 p-6">
            <h4 className="mb-3 text-xl font-semibold">پاسخگوی شما هستیم</h4>

            <p className="leading-8 text-muted-foreground">
              اگر درباره ثبت سفارش، وضعیت ارسال، تعویض یا مرجوعی کالا سوالی
              دارید، از طریق اینستاگرام یا راه‌های ارتباطی موجود در سایت با تیم
              پشتیبانی آداجیو در تماس باشید. هدف ما ارائه تجربه‌ای مطمئن، سریع و
              رضایت‌بخش برای تمامی مشتریان است.
            </p>
          </div>
        </section>
      </main>
      <MobileBottomNav />
    </>
  );
}
