import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import QuickAddToCart from "@/components/ProductCard/QuickAddToCart";
import { AppStateProvider } from "@/lib/app-state";
import type { Product, ProductVariant } from "@/types/products";

const { mutateMock, mutationState, refreshMock } = vi.hoisted(() => ({
  mutateMock: vi.fn(),
  mutationState: { pending: false },
  refreshMock: vi.fn(),
}));

vi.mock("@/lib/cart", () => ({
  useAddCartItem: () => ({
    mutate: mutateMock,
    isPending: mutationState.pending,
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("ResizeObserver", ResizeObserverStub);

window.matchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
})) as unknown as typeof window.matchMedia;

Element.prototype.scrollIntoView = vi.fn();

function makeVariant(
  overrides: Partial<ProductVariant> = {},
): ProductVariant {
  return {
    id: 1,
    sku: "SKU-M",
    size: null,
    size_name: "M",
    price: 1000,
    compare_price: null,
    stock: 3,
    is_active: true,
    ...overrides,
  };
}

function makeProduct(variants: ProductVariant[]): Product {
  return {
    id: 1,
    title: "پیراهن مردانه کلاسیک",
    slug: "classic-shirt",
    short_description: "",
    status: "active",
    featured: false,
    audio: null,
    published_at: "",
    images: [],
    collections_list: [],
    variants,
  };
}

function renderQuickAdd(product: Product, onParentClick?: () => void) {
  return render(
    <AppStateProvider>
      {/* Simulates the surrounding product card link. */}
      <a href={`/store/products/${product.slug}`} onClick={onParentClick}>
        <QuickAddToCart product={product} />
      </a>
    </AppStateProvider>,
  );
}

beforeEach(() => {
  mutateMock.mockClear();
  refreshMock.mockClear();
  mutationState.pending = false;
});

describe("QuickAddToCart", () => {
  it("adds a single-variant product directly without opening a picker", () => {
    const product = makeProduct([makeVariant({ sku: "SKU-ONLY" })]);
    renderQuickAdd(product);

    const button = screen.getByRole("button", {
      name: "افزودن پیراهن مردانه کلاسیک به سبد خرید",
    });
    fireEvent.click(button);

    expect(mutateMock).toHaveBeenCalledTimes(1);
    expect(mutateMock.mock.calls[0][0]).toEqual({
      sku: "SKU-ONLY",
      quantity: 1,
    });
    expect(screen.queryByText("انتخاب سایز")).not.toBeInTheDocument();
  });

  it("opens the size sheet for multi-variant products and adds the picked SKU", () => {
    const product = makeProduct([
      makeVariant({ id: 1, sku: "SKU-M", size_name: "M" }),
      makeVariant({ id: 2, sku: "SKU-XL", size_name: "XL" }),
    ]);
    renderQuickAdd(product);

    fireEvent.click(
      screen.getByRole("button", {
        name: "افزودن پیراهن مردانه کلاسیک به سبد خرید",
      }),
    );

    expect(mutateMock).not.toHaveBeenCalled();
    expect(screen.getByText("انتخاب سایز")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "افزودن سایز XL به سبد خرید",
      }),
    );

    expect(mutateMock).toHaveBeenCalledTimes(1);
    expect(mutateMock.mock.calls[0][0]).toEqual({
      sku: "SKU-XL",
      quantity: 1,
    });
  });

  it("does not render for products without a purchasable variant", () => {
    const product = makeProduct([
      makeVariant({ sku: "SKU-OUT", stock: 0 }),
      makeVariant({ id: 2, sku: "SKU-OFF", is_active: false }),
    ]);
    renderQuickAdd(product);

    expect(
      screen.queryByRole("button", { name: /افزودن/ }),
    ).not.toBeInTheDocument();
    expect(mutateMock).not.toHaveBeenCalled();
  });

  it("never offers out-of-stock sizes as purchasable choices", () => {
    const product = makeProduct([
      makeVariant({ id: 1, sku: "SKU-M", size_name: "M", stock: 2 }),
      makeVariant({ id: 2, sku: "SKU-L", size_name: "L", stock: 2 }),
      makeVariant({ id: 3, sku: "SKU-XL", size_name: "XL", stock: 0 }),
    ]);
    renderQuickAdd(product);

    fireEvent.click(
      screen.getByRole("button", {
        name: "افزودن پیراهن مردانه کلاسیک به سبد خرید",
      }),
    );

    expect(
      screen.getByRole("button", {
        name: "XL - ناموجود",
      }),
    ).toBeDisabled();

    fireEvent.click(
      screen.getByRole("button", {
        name: "XL - ناموجود",
      }),
    );
    expect(mutateMock).not.toHaveBeenCalled();
  });

  it("stops click propagation and prevents card navigation", () => {
    const onParentClick = vi.fn();
    const product = makeProduct([makeVariant({ sku: "SKU-ONLY" })]);
    renderQuickAdd(product, onParentClick);

    const button = screen.getByRole("button", {
      name: "افزودن پیراهن مردانه کلاسیک به سبد خرید",
    });

    const notCancelled = fireEvent.click(button);

    // preventDefault: the surrounding product card link must not navigate.
    expect(notCancelled).toBe(false);
    // stopPropagation: the card link handler must not run.
    expect(onParentClick).not.toHaveBeenCalled();
  });

  it("ignores duplicate taps while a submission is pending", () => {
    mutationState.pending = true;
    const product = makeProduct([makeVariant({ sku: "SKU-ONLY" })]);
    renderQuickAdd(product);

    const button = screen.getByRole("button", {
      name: "افزودن پیراهن مردانه کلاسیک به سبد خرید",
    });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(mutateMock).not.toHaveBeenCalled();
  });
});
