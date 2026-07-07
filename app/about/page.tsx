import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "درباره آداجیو",
  description:
    "آداجیو برندی الهام‌گرفته از موسیقی، هنر و مینیمالیسم است. تیشرت‌هایی برای کسانی که موسیقی را زندگی می‌کنند.",
};

const values = [
  {
    title: "الهام از موسیقی",
    description:
      "هر کالکشن از یک احساس، یک داستان و لحظه‌هایی الهام می‌گیرد که پس از پایان آهنگ همچنان باقی می‌مانند.",
  },
  {
    title: "طراحی مینیمال",
    description:
      "طرح‌هایی ساده، تک‌رنگ و ماندگار که به جای دنبال کردن ترندها، هویت مستقل خود را حفظ می‌کنند.",
  },
  {
    title: "کیفیت",
    description:
      "از انتخاب پارچه تا جزئیات چاپ، همه چیز با دقت انتخاب می‌شود تا محصولی ماندگار ساخته شود.",
  },
] as const;


export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar variant="home" />


      {/* Hero */}
      <section className="relative border-b border-white/10 overflow-hidden">

        <div
          className="
          absolute inset-0
          bg-[radial-gradient(circle_at_top,rgba(255,255,255,.08),transparent_40%)]
          "
        />

        <div
          className="
          relative
          mx-auto
          max-w-6xl
          px-6
          py-32
          text-center
          "
        >
          <div className="w-full overflow-hidden p-15 relative flex justify-center items-center">
            <Image src={'/assets/adagio.png'} alt="Adagio"
              className="rounded-md shadow-white logo-shadow "
               width={300} height={300} />
          </div>
          <p
            className="
            text-xs
            tracking-[0.5em]
            text-white/40
            uppercase
            "
          >
            About Adagio
          </p>


          <h1
            className="
            mt-8
            text-5xl
            font-medium
            tracking-tight
            md:text-7xl
            "
          >
            موسیقی‌ای که می‌پوشی
          </h1>


          <p
            className="
            mx-auto
            mt-10
            max-w-3xl
            text-lg
            leading-9
            text-white/50
            "
          >
            آداجیو برندی است که از موسیقی، شب، نوستالژی و هنر الهام می‌گیرد.
            ما باور داریم لباس می‌تواند همان احساسی را منتقل کند که یک قطعه
            موسیقی در ذهن و قلب انسان ایجاد می‌کند.
          </p>

        </div>

      </section>



      {/* Story */}

      <section className="mx-auto max-w-6xl px-6 py-24">

        <div className="grid gap-12 lg:grid-cols-2">


          <header>

            <p className="text-xs tracking-[0.4em] text-white/40">
              OUR STORY
            </p>

            <h2
              className="
              mt-6
              text-4xl
              font-light
              "
            >
              داستان آداجیو
            </h2>

          </header>


          <div
            className="
            space-y-7
            leading-9
            text-white/50
            "
          >

            <p>
              آداجیو از علاقه به موسیقی و طراحی مینیمال متولد شد.
              هر کالکشن با یک احساس آغاز می‌شود، نه یک ترند.
            </p>


            <p>
              شب‌های طولانی، جاده‌های خلوت، تصاویر سیاه‌وسفید و موسیقی‌هایی
              که سال‌ها همراه ما می‌مانند، الهام‌بخش طراحی‌های ما هستند.
            </p>


            <p>
              هدف ما ساخت لباس‌هایی است که فقط یک محصول نباشند؛
              بلکه بخشی از شخصیت و داستان شما باشند.
            </p>

          </div>

        </div>

      </section>



      {/* Values */}

      <section
        className="
        border-y
        border-white/10
        bg-white/[0.02]
        "
      >

        <div
          className="
          mx-auto
          grid
          max-w-6xl
          gap-5
          px-6
          py-24
          md:grid-cols-3
          "
        >

          {values.map((item)=>(

            <article
              key={item.title}
              className="
              border
              border-white/10
              bg-black
              p-8
              transition
              duration-500
              hover:border-white/30
              "
            >

              <h3 className="text-xl font-medium">
                {item.title}
              </h3>


              <p
                className="
                mt-5
                leading-8
                text-white/50
                "
              >
                {item.description}
              </p>


            </article>

          ))}


        </div>

      </section>



      {/* Philosophy */}

      <section className="mx-auto max-w-5xl px-6 py-32 text-center">

        <p className="text-xs tracking-[0.5em] text-white/40">
          PHILOSOPHY
        </p>


        <blockquote
          className="
          mt-10
          text-3xl
          font-light
          leading-relaxed
          md:text-5xl
          "
        >
          «بعضی موسیقی‌ها فقط شنیده نمی‌شوند؛
          <br />
          آن‌ها بخشی از زندگی ما می‌شوند.
          <br />
          ما فقط آن حس را به لباس تبدیل کرده‌ایم.»
        </blockquote>


      </section>



      {/* CTA */}

      <section className="border-t border-white/10">

        <div
          className="
          mx-auto
          max-w-4xl
          px-6
          py-24
          text-center
          "
        >

          <h2 className="text-4xl font-light">
            به دنیای آداجیو خوش آمدید
          </h2>


          <p
            className="
            mt-8
            leading-9
            text-white/50
            "
          >
            کالکشن‌هایی با الهام از موسیقی، نوستالژی و زیبایی مینیمالیسم؛
            برای کسانی که موسیقی را فقط گوش نمی‌دهند، بلکه می‌پوشند.
          </p>


          <Link
            href="/collections"
            className="
            mt-10
            inline-flex
            border
            border-white/20
            px-10
            py-4
            text-sm
            transition
            hover:bg-white
            hover:text-black
            "
          >
            مشاهده کالکشن‌ها
          </Link>

        </div>

      </section>


      <Footer />

    </main>
  );
}