import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../test/test-utils";
import CartView from "@/components/CartView";
import type { Cart } from "@/types/cart";

vi.mock("@/lib/cart", () => ({
  useCart: vi.fn(),
  useUpdateCartItem: vi.fn(),
  useRemoveCartItem: vi.fn(),
}));

vi.mock("@/lib/app-state", () => ({
  useAppState: vi.fn(() => ({
    showToast: vi.fn(),
  })),
}));

vi.mock("@/hooks/useMembership", () => ({
  useMembership: vi.fn(() => ({
    isMember: true,
    isLoading: false,
  })),
}));

vi.mock("@/lib/addresses", () => ({
  useAddresses: vi.fn(),
  useDeleteAddress: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => ""),
}));

import { useCart, useUpdateCartItem, useRemoveCartItem } from "@/lib/cart";
import { useAppState } from "@/lib/app-state";
import { useAddresses } from "@/lib/addresses";

const mockUseCart = vi.mocked(useCart);
const mockUseUpdateCartItem = vi.mocked(useUpdateCartItem);
const mockUseRemoveCartItem = vi.mocked(useRemoveCartItem);
const mockUseAppState = vi.mocked(useAppState);
const mockUseAddresses = vi.mocked(useAddresses);

function makeCart(overrides: Partial<Cart> = {}): Cart {
  return {
    id: 1,
    token: "cart-token-123",
    total_price: 550000,
    items: [
      {
        sku: "SKU-001",
        product_title: "پیراهن مردانه",
        size: "L",
        quantity: 2,
        price: 250000,
      },
    ],
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockUseAppState.mockReturnValue({
    showToast: vi.fn(),
    toastMessage: "",
    toastVisible: false,
  });
  mockUseUpdateCartItem.mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  } as any);
  mockUseRemoveCartItem.mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  } as any);
  mockUseAddresses.mockReturnValue({
    data: [],
    isLoading: false,
  } as any);
});

describe("CartView", () => {
  it("shows loading skeletons while cart loads", () => {
    mockUseCart.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any);

    const { container } = render(<CartView />);
    expect(container.querySelectorAll('[class*="rounded-"]').length).toBeGreaterThan(0);
  });

  it("shows error message when cart fails to load", () => {
    mockUseCart.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any);

    render(<CartView />);
    expect(screen.getByText(/خطا در بارگذاری سبد خرید/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /تلاش دوباره/ })).toBeInTheDocument();
  });

  it("shows empty cart message when cart has no items", () => {
    mockUseCart.mockReturnValue({
      data: makeCart({ items: [], total_price: 0 }),
      isLoading: false,
      isError: false,
    } as any);

    render(<CartView />);
    expect(screen.getByText(/سبد خریدت خالی است/)).toBeInTheDocument();
    expect(screen.getByText(/رفتن به فروشگاه/)).toBeInTheDocument();
  });

  it("displays cart items with correct information", () => {
    mockUseCart.mockReturnValue({
      data: makeCart(),
      isLoading: false,
      isError: false,
    } as any);

    render(<CartView />);
    expect(screen.getByText("پیراهن مردانه")).toBeInTheDocument();
    expect(screen.getByText(/سایز: L/)).toBeInTheDocument();
  });

  it("displays total price", () => {
    mockUseCart.mockReturnValue({
      data: makeCart(),
      isLoading: false,
      isError: false,
    } as any);

    render(<CartView />);
    expect(screen.getByText(/مجموع/)).toBeInTheDocument();
  });

  it("shows quantity controls for each item", () => {
    mockUseCart.mockReturnValue({
      data: makeCart(),
      isLoading: false,
      isError: false,
    } as any);

    render(<CartView />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /−/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /\+/ })).toBeInTheDocument();
  });

  it("calls updateItem.mutate when quantity is increased", async () => {
    const user = userEvent.setup();
    const mutateMock = vi.fn();

    mockUseCart.mockReturnValue({
      data: makeCart(),
      isLoading: false,
      isError: false,
    } as any);
    mockUseUpdateCartItem.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as any);

    render(<CartView />);

    await user.click(screen.getByRole("button", { name: /\+/ }));

    expect(mutateMock).toHaveBeenCalledWith({ sku: "SKU-001", quantity: 3 });
  });

  it("calls removeItem.mutate when quantity decreases below 1", async () => {
    const user = userEvent.setup();
    const removeMutateMock = vi.fn();
    const updateMutateMock = vi.fn();

    mockUseCart.mockReturnValue({
      data: makeCart({
        items: [
          {
            sku: "SKU-001",
            product_title: "پیراهن مردانه",
            size: "L",
            quantity: 1,
            price: 250000,
          },
        ],
      }),
      isLoading: false,
      isError: false,
    } as any);
    mockUseUpdateCartItem.mockReturnValue({
      mutate: updateMutateMock,
      isPending: false,
    } as any);
    mockUseRemoveCartItem.mockReturnValue({
      mutate: removeMutateMock,
      isPending: false,
    } as any);

    render(<CartView />);

    await user.click(screen.getByRole("button", { name: /−/ }));

    expect(removeMutateMock).toHaveBeenCalledWith("SKU-001");
  });

  it("shows continue purchase button", () => {
    mockUseCart.mockReturnValue({
      data: makeCart(),
      isLoading: false,
      isError: false,
    } as any);

    render(<CartView />);
    expect(screen.getByRole("button", { name: /ادامه فرآیند خرید/ })).toBeInTheDocument();
  });

  it("shows address section", () => {
    mockUseCart.mockReturnValue({
      data: makeCart(),
      isLoading: false,
      isError: false,
    } as any);

    render(<CartView />);
    expect(screen.getByText(/آدرس ارسال/)).toBeInTheDocument();
  });
});
