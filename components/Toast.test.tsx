import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

import Toast from "@/components/Toast";
import { AppStateProvider, useAppState } from "@/lib/app-state";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

function TriggerToast({ message }: { message: string }) {
  const { showToast } = useAppState();
  return (
    <button type="button" onClick={() => showToast(message)}>
      show toast
    </button>
  );
}

function renderToast(message: string) {
  return render(
    <AppStateProvider>
      <TriggerToast message={message} />
      <Toast />
    </AppStateProvider>,
  );
}

afterEach(() => {
  vi.useRealTimers();
});

describe("shared Toast", () => {
  it("wraps long Persian messages instead of overflowing", () => {
    const message =
      "۲ عدد اضافه شد — پیراهن مردانه آستین بلند با طرح کلاسیک و عنوان بسیار طولانی برای تست، سایز XL";

    renderToast(message);
    fireEvent.click(screen.getByRole("button", { name: "show toast" }));

    const toast = screen.getByRole("status");
    expect(toast).toHaveTextContent(message);

    const className = toast.className;
    expect(className).toContain("min-w-0");
    // Width is capped below the viewport width so nothing can overflow.
    expect(className).toContain("max-w-[calc(");
    expect(className).toContain("env(safe-area-inset-left)");

    // The message itself wraps instead of forcing the pill wider.
    const messageNode = screen.getByText(message);
    expect(messageNode.className).toContain("whitespace-normal");
    expect(messageNode.className).toContain("break-words");
    expect(messageNode.className).toContain("overflow-wrap");
    expect(messageNode.className).toContain("min-w-0");
    expect(messageNode.className).toContain("flex-1");
  });

  it("keeps the message text shrinkable so it wraps inside the pill", () => {
    renderToast("پیام کوتاه");
    fireEvent.click(screen.getByRole("button", { name: "show toast" }));

    const messageNode = screen.getByText("پیام کوتاه");
    expect(messageNode.className).toContain("whitespace-normal");
    expect(messageNode.className).toContain("break-words");
    expect(messageNode.className).toContain("min-w-0");
    expect(messageNode.className).toContain("flex-1");
  });

  it("can be dismissed with the close button", () => {
    renderToast("پیام تست");
    fireEvent.click(screen.getByRole("button", { name: "show toast" }));
    expect(screen.getByRole("status")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "بستن پیام" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("still auto-dismisses after the existing delay", () => {
    vi.useFakeTimers();
    renderToast("پیام تست");
    fireEvent.click(screen.getByRole("button", { name: "show toast" }));
    expect(screen.getByRole("status")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2200);
    });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
