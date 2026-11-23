import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

import ArticleScrollButtons from "@/components/blog/ArticleScrollButtons";

function setScrollState({
  scrollY = 0,
  innerHeight = 600,
  scrollHeight = 3000,
}: {
  scrollY?: number;
  innerHeight?: number;
  scrollHeight?: number;
}) {
  Object.defineProperty(window, "scrollY", {
    value: scrollY,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(window, "innerHeight", {
    value: innerHeight,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: scrollHeight,
    configurable: true,
    writable: true,
  });
}

async function flushScroll() {
  await act(async () => {
    fireEvent.scroll(window);
    await new Promise((resolve) => setTimeout(resolve, 40));
  });
}

const scrollToMock = vi.fn();
const matchMediaMock = vi.fn();

beforeEach(() => {
  scrollToMock.mockClear();
  matchMediaMock.mockReset();
  matchMediaMock.mockReturnValue({ matches: false });

  vi.stubGlobal("scrollTo", scrollToMock);
  vi.stubGlobal("matchMedia", matchMediaMock);

  setScrollState({});
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ArticleScrollButtons", () => {
  it("hides scroll-to-top at the top and scrolls smoothly to the bottom", async () => {
    render(<ArticleScrollButtons />);

    expect(
      screen.queryByRole("button", { name: "اسکرول به بالای صفحه" }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "اسکرول به انتهای صفحه" }),
    );

    await act(async () => {});

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 3000,
      behavior: "smooth",
    });
  });

  it("shows scroll-to-top after scrolling down and scrolls back smoothly", async () => {
    render(<ArticleScrollButtons />);

    setScrollState({ scrollY: 900 });
    await flushScroll();

    const upButton = screen.getByRole("button", {
      name: "اسکرول به بالای صفحه",
    });
    expect(upButton).toBeInTheDocument();

    fireEvent.click(upButton);

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("hides scroll-to-bottom when the bottom is already reached", async () => {
    render(<ArticleScrollButtons />);

    setScrollState({ scrollY: 2400, innerHeight: 600 });
    await flushScroll();

    expect(
      screen.queryByRole("button", { name: "اسکرول به انتهای صفحه" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "اسکرول به بالای صفحه" }),
    ).toBeInTheDocument();
  });

  it("renders no buttons for short articles that need no scrolling", async () => {
    setScrollState({ scrollHeight: 500, innerHeight: 900 });
    render(<ArticleScrollButtons />);

    expect(
      screen.queryByRole("button", { name: "اسکرول به بالای صفحه" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "اسکرول به انتهای صفحه" }),
    ).not.toBeInTheDocument();
  });

  it("respects reduced-motion preferences", () => {
    matchMediaMock.mockReturnValue({ matches: true });
    render(<ArticleScrollButtons />);

    fireEvent.click(
      screen.getByRole("button", { name: "اسکرول به انتهای صفحه" }),
    );

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 3000,
      behavior: "auto",
    });
  });
});
