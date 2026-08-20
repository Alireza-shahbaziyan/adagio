import type { Metadata } from "next";
import { Mail, MapPin, Phone, ArrowUpRight, ArrowUpLeft } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "تماس با ما | آداجیو",
  description:
    "برای ارتباط با تیم آداجیو، دریافت پشتیبانی، همکاری یا ارسال پیشنهادات با ما در ارتباط باشید.",
};

const contactInfo = [
  {
    icon: Phone,
    title: "تلفن",
    value: "09392622300",
    href: "tel:+989392622300",
  },
  {
    icon: Mail,
    title: "ایمیل",
    value: "info@adagiostyle.ir",
    href: "mailto:info@adagiostyle.ir",
  },
  {
    icon: MapPin,
    title: "اصفهان - شاهین شهر",
    value: "ایران",
  },
] as const;

export default function ContactPage() {
  return (
    <main dir="rtl" lang="fa" className="min-h-screen bg-black text-white">
      <Navbar variant="home" />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />

        <div className="relative mx-auto max-w-5xl px-6 py-32 text-center">
          <span className="text-xs uppercase tracking-[0.5em] text-white/40">
            Contact
          </span>

          <h1 className="mt-8 text-5xl font-black tracking-tight md:text-7xl">
            تماس با آداجیو
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-9 text-white/50 md:text-lg">
            برای همکاری، پشتیبانی یا هر سوالی که دارید، با ما در ارتباط باشید.
            داستان آداجیو با ارتباط میان موسیقی و انسان‌ها ساخته می‌شود.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {contactInfo.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                group
                border border-white/10
                bg-white/2
                p-8
                transition-all
                duration-500
                hover:border-white/30
                hover:bg-white/6
                "
              >
                <Icon
                  className="
                  h-6 w-6
                  text-white/50
                  transition
                  group-hover:text-white
                  "
                />

                <h2 className="mt-8 text-lg font-medium">{item.title}</h2>

                {"href" in item ? (
                  <a
                    href={item.href}
                    className="
                    mt-3
                    flex
                    items-center
                    gap-2
                    text-white/50
                    transition
                    hover:text-white
                    "
                  >
                    {item.value}
                    <ArrowUpRight size={14} />
                  </a>
                ) : (
                  <p className="mt-3 text-white/50">{item.value}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-4xl px-6 pb-32">
        <div
          className="
          border
          border-white/10
          bg-white/2
          p-8
          md:p-12
          "
        >
          <div className="mb-10">
            <h2 className="text-3xl font-light">ارسال پیام</h2>

            <p className="mt-3 text-white/40">
              پیام شما را می‌خوانیم و در اولین فرصت پاسخ می‌دهیم.
            </p>
          </div>

          <form className="space-y-7">
            <div className="grid gap-7 md:grid-cols-2">
              {["نام و نام خانوادگی", "ایمیل"].map((label) => (
                <div key={label}>
                  <label className="mb-3 block text-sm text-white/60">
                    {label}
                  </label>

                  <input
                    className="
                    w-full
                    border-b
                    border-white/20
                    bg-transparent
                    py-3
                    text-white
                    outline-none
                    transition
                    focus:border-white
                    "
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="mb-3 block text-sm text-white/60">موضوع</label>

              <input
                className="
                w-full
                border-b
                border-white/20
                bg-transparent
                py-3
                outline-none
                focus:border-white
                "
              />
            </div>

            <div>
              <label className="mb-3 block text-sm text-white/60">پیام</label>

              <textarea
                rows={5}
                className="
                w-full
                resize-none
                border-b
                border-white/20
                bg-transparent
                py-3
                outline-none
                focus:border-white
                "
              />
            </div>

            <button
              className="
              group
              mt-5
              flex
              items-center
              gap-3
              border
              border-white
              px-10
              py-4
              text-sm
              transition
              hover:bg-white
              hover:text-black
              "
            >
              ارسال پیام
              <ArrowUpLeft
                size={16}
                className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </button>
          </form>
        </div>
      </section>
      <MobileBottomNav />
      <Footer />
    </main>
  );
}
