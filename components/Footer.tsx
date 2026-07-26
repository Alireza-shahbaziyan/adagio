import Link from "next/link";

export default function Footer({
  mobileBottomPad = false,
}: {
  mobileBottomPad?: boolean;
}) {
  return (
    <footer
      className={`border-t border-white/8 px-5 pt-16 md:px-16 md:pt-24 ${
        mobileBottomPad ? "pb-24 md:pb-8" : "pb-8"
      }`}
    >
      <div className="mb-16 grid grid-cols-2 gap-10 md:grid-cols-4">
        {/* Brand */}
        <section aria-label="درباره آداجیو">
          <p
            style={{ direction: "ltr" }}
            className="mb-4 font-instrument-serif text-[28px] italic text-foreground"
          >
            Adagio
          </p>

          <p className="max-w-60 text-sm leading-[1.8] text-muted-foreground">
            آداجیو، فروشگاه تیشرت‌های اورسایز و مینیمال با الهام از موسیقی، هنر
            و استایل‌های نوستالژیک.
          </p>
        </section>

        {/* Store */}
        <nav aria-label="فروشگاه">
          <p className="mb-5 text-[13px] text-foreground">فروشگاه</p>

          <Link
            href="/store#featured"
            title="محصولات ویژه آداجیو"
            className="mb-3.5 block text-sm text-muted-foreground"
          >
            ویژه
          </Link>

          <Link
            href="/store/product"
            title="مشاهده محصولات آداجیو"
            className="mb-3.5 block text-sm text-muted-foreground"
          >
            محصولات
          </Link>

          <Link
            href="/collections"
            title="کالکشن های آداجیو"
            className="mb-3.5 block text-sm text-muted-foreground"
          >
            کالکشن‌ها
          </Link>

          <Link
            href="/category"
            title="دسته بندی محصولات"
            className="block text-sm text-muted-foreground"
          >
            دسته‌بندی‌ها
          </Link>
        </nav>

        {/* About */}
        <nav aria-label="اطلاعات آداجیو">
          <p className="mb-5 text-[13px] text-foreground">درباره ما</p>

          <Link
            href="/about"
            title="درباره برند آداجیو"
            className="mb-3.5 block text-sm text-muted-foreground"
          >
            درباره
          </Link>

          <Link
            href="/contact-me"
            title="تماس با آداجیو"
            className="mb-3.5 block text-sm text-muted-foreground"
          >
            تماس
          </Link>

          <Link
            href="/terms"
            title="قوانین و مقررات خرید"
            className="block text-sm text-muted-foreground"
          >
            قوانین و مقررات
          </Link>
        </nav>

        {/* Customer */}
        <nav aria-label="راهنمای خرید">
          <p className="mb-5 text-[13px] text-foreground">راهنما</p>

          <Link
            href="/shipping"
            title="شرایط ارسال سفارش"
            className="mb-3.5 block text-sm text-muted-foreground"
          >
            ارسال سفارش
          </Link>

          <Link
            href="/returns"
            title="شرایط بازگشت کالا"
            className="block text-sm text-muted-foreground"
          >
            مرجوعی کالا
          </Link>
        </nav>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/8 pt-8">
        <p className="text-[13px] text-[#5a5a5a]">
          © ۲۰۲۶ آداجیو. تمامی حقوق محفوظ است.
        </p>

        <div className="flex gap-3.5" aria-label="شبکه های اجتماعی آداجیو">
          <Link
            href="https://instagram.com/adagio_style"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Adagio"
            className="flex h-9.5 w-9.5 items-center justify-center rounded-full border border-white/[0.15] text-[11px] tracking-[0.5px] text-muted-foreground"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                  fill="#ffff"
                ></path>{" "}
                <path
                  d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"
                  fill="#ffff"
                ></path>{" "}
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"
                  fill="#ffff"
                ></path>{" "}
              </g>
            </svg>
          </Link>

          <Link
            href="#"
            aria-label="TikTok Adagio"
            className="  flex h-9.5 w-9.5 items-center justify-center rounded-full border border-white/[0.15] text-[11px] tracking-[0.5px] text-muted-foreground"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M21.997 12C21.997 17.5228 17.5198 22 11.997 22C6.47415 22 1.99699 17.5228 1.99699 12C1.99699 6.47715 6.47415 2 11.997 2C17.5198 2 21.997 6.47715 21.997 12ZM12.3553 9.38244C11.3827 9.787 9.43876 10.6243 6.52356 11.8944C6.05018 12.0827 5.8022 12.2669 5.77962 12.4469C5.74147 12.7513 6.12258 12.8711 6.64155 13.0343C6.71214 13.0565 6.78528 13.0795 6.86026 13.1038C7.37085 13.2698 8.05767 13.464 8.41472 13.4717C8.7386 13.4787 9.10009 13.3452 9.49918 13.0711C12.2229 11.2325 13.629 10.3032 13.7172 10.2831C13.7795 10.269 13.8658 10.2512 13.9243 10.3032C13.9828 10.3552 13.977 10.4536 13.9708 10.48C13.9331 10.641 12.4371 12.0318 11.6629 12.7515C11.4216 12.9759 11.2504 13.135 11.2154 13.1714C11.137 13.2528 11.0571 13.3298 10.9803 13.4038C10.506 13.8611 10.1502 14.204 11 14.764C11.4083 15.0331 11.7351 15.2556 12.0611 15.4776C12.4171 15.7201 12.7722 15.9619 13.2317 16.2631C13.3487 16.3398 13.4605 16.4195 13.5694 16.4971C13.9837 16.7925 14.3559 17.0579 14.8158 17.0155C15.083 16.991 15.359 16.7397 15.4992 15.9903C15.8305 14.2193 16.4817 10.382 16.6322 8.80081C16.6454 8.66228 16.6288 8.48498 16.6154 8.40715C16.6021 8.32932 16.5743 8.21842 16.4731 8.13633C16.3533 8.03911 16.1683 8.01861 16.0856 8.02C15.7095 8.0267 15.1324 8.22735 12.3553 9.38244Z"
                  stroke="#ffff"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}
