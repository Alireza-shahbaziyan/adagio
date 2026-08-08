import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import Navbar from "@/components/Navbar/Navbar";

export const metadata = {
  title: "قوانین و مقررات | ADAGIO",
  description:
    "مطالعه قوانین و مقررات استفاده از فروشگاه اینترنتی ADAGIO، شرایط خرید، ارسال، مرجوعی و حفظ حریم مشتریان.",

};

export default function TermsPage() {
  return (
    <>
      <Navbar variant="default" />
      <main dir="rtl" lang="fa" className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-10 text-center text-6xl font-black ">
          قوانین و مقررات
        </h1>

        <div className="space-y-10 text-base leading-8 text-zinc-100">
          <section>
            <h2 className="mb-3 text-2xl font-semibold">۱. پذیرش قوانین</h2>

            <p>
              استفاده از وب‌سایت ADAGIO و ثبت سفارش به منزله مطالعه، آگاهی و
              پذیرش کامل قوانین و مقررات این فروشگاه است. لطفاً پیش از ثبت
              سفارش، موارد زیر را به دقت مطالعه فرمایید.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">۲. ثبت سفارش</h2>

            <p>
              ثبت سفارش تنها پس از تکمیل اطلاعات مورد نیاز و پرداخت موفق نهایی
              خواهد شد. در صورت بروز هرگونه خطای سیستمی، اشتباه در قیمت‌گذاری یا
              عدم موجودی کالا، فروشگاه این حق را دارد که سفارش را لغو کرده و
              مبلغ پرداخت‌شده را به طور کامل بازگرداند.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">۳. ارسال سفارش</h2>

            <p>
              سفارش‌ها در کوتاه‌ترین زمان ممکن پردازش و ارسال می‌شوند. زمان
              تحویل بسته به شهر مقصد و شرکت حمل‌ونقل ممکن است متفاوت باشد.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              ۴. شرایط مرجوعی و بازگشت کالا
            </h2>

            <p className="mb-4">
              رضایت مشتری برای ما اهمیت بالایی دارد. در صورتی که پس از دریافت
              سفارش قصد بازگرداندن کالا را داشته باشید، شرایط زیر باید رعایت
              شود:
            </p>

            <ul className="list-disc space-y-2 pr-6">
              <li>کالا باید کاملاً در وضعیت اولیه خود باشد.</li>

              <li>کالا نباید استفاده شده، شسته شده یا دچار آسیب شده باشد.</li>

              <li>
                تمامی اتیکت‌ها، بسته‌بندی و متعلقات کالا باید حفظ شده باشند.
              </li>

              <li>
                پس از تأیید شرایط کالا توسط فروشگاه، مبلغ پرداختی به طور کامل به
                مشتری بازگردانده خواهد شد.
              </li>

              <li>
                پیش از ارسال کالا، هماهنگی با پشتیبانی فروشگاه از طریق
                اینستاگرام یا تلگرام الزامی است.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">۵. کیفیت محصولات</h2>

            <p>
              تمامی تصاویر محصولات با هدف نمایش هرچه دقیق‌تر رنگ، طرح و جزئیات
              تهیه شده‌اند. با این حال ممکن است به دلیل تفاوت نمایشگرها، اختلاف
              جزئی در رنگ نهایی محصول وجود داشته باشد.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">۶. حریم خصوصی</h2>

            <p>
              اطلاعات شخصی مشتریان صرفاً برای پردازش سفارش، ارسال کالا و ارائه
              خدمات بهتر استفاده می‌شود و تحت هیچ شرایطی در اختیار اشخاص یا
              مجموعه‌های دیگر قرار نخواهد گرفت؛ مگر در مواردی که قانون الزام
              کرده باشد.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">۷. تغییر قوانین</h2>

            <p>
              فروشگاه ADAGIO این حق را دارد که در صورت نیاز، قوانین و مقررات را
              به‌روزرسانی کند. آخرین نسخه منتشرشده در این صفحه، ملاک استفاده از
              خدمات فروشگاه خواهد بود.
            </p>
          </section>
        </div>
      </main>
      <MobileBottomNav />
      <Footer />
    </>
  );
}
