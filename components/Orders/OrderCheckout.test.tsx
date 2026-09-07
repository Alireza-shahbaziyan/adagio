import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../test/test-utils";
import OrderCheckout from "@/components/Orders/OrderCheckout";
import type { Order } from "@/types/checkout";

vi.mock("@/lib/checkout", () => ({
  useOrder: vi.fn(),
  useCancelOrder: vi.fn(),
  useUpdateOrderAddress: vi.fn(),
  usePaymentGateways: vi.fn(),
  usePayOrder: vi.fn(),
}));

vi.mock("@/lib/addresses", () => ({
  useAddresses: vi.fn(),
  useDeleteAddress: vi.fn(),
}));

vi.mock("@/lib/app-state", () => ({
  useAppState: vi.fn(() => ({
    showToast: vi.fn(),
  })),
}));

import {
  useOrder,
  useCancelOrder,
  useUpdateOrderAddress,
  usePaymentGateways,
  usePayOrder,
} from "@/lib/checkout";
import { useAddresses, useDeleteAddress } from "@/lib/addresses";
import { useAppState } from "@/lib/app-state";

const mockUseOrder = vi.mocked(useOrder);
const mockUseCancelOrder = vi.mocked(useCancelOrder);
const mockUseUpdateOrderAddress = vi.mocked(useUpdateOrderAddress);
const mockUsePaymentGateways = vi.mocked(usePaymentGateways);
const mockUsePayOrder = vi.mocked(usePayOrder);
const mockUseAddresses = vi.mocked(useAddresses);
const mockUseAppState = vi.mocked(useAppState);

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    token: "test-token-123",
    order_number: "1001",
    status: "pending_payment",
    shipping_status: "pending",
    subtotal_amount: 500000,
    shipping_amount: 50000,
    discount_amount: 0,
    total_amount: 550000,
    tracking_code: null,
    shipping_company: null,
    customer_note: "لطفاً سریع ارسال شود",
    expires_at: null,
    paid_at: null,
    is_payable: true,
    is_expired: false,
    created_at: "2026-01-01T00:00:00Z",
    address: {
      id: 1,
      title: "خانه",
      recipient_name: "علی رضایی",
      phone: "09121234567",
      province: 1,
      city: 1,
      postal_code: "1234567890",
      address_line: "تهران، خیابان نمونه، پلاک ۱",
    },
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
  mockUseAddresses.mockReturnValue({
    data: undefined,
    isLoading: false,
  } as any);
  vi.mocked(useDeleteAddress).mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  } as any);
  mockUsePaymentGateways.mockReturnValue({
    data: undefined,
    isLoading: false,
  } as any);
  mockUsePayOrder.mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  } as any);
  mockUseUpdateOrderAddress.mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  } as any);
  mockUseCancelOrder.mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  } as any);
});

describe("OrderCheckout", () => {
  it("shows loading skeletons while order loads", () => {
    mockUseOrder.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any);

    const { container } = render(<OrderCheckout token="test-token-123" />);
    expect(container.querySelectorAll('[class*="rounded-"]').length).toBeGreaterThan(0);
  });

  it("shows not-found message when order is missing", () => {
    mockUseOrder.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any);

    render(<OrderCheckout token="test-token-123" />);
    expect(screen.getByText(/سفارش پیدا نشد/)).toBeInTheDocument();
    expect(screen.getByText(/بازگشت به فروشگاه/)).toBeInTheDocument();
  });

  it("renders order summary with correct details", () => {
    mockUseOrder.mockReturnValue({
      data: makeOrder(),
      isLoading: false,
      isError: false,
    } as any);

    render(<OrderCheckout token="test-token-123" />);
    expect(screen.getByText(/سفارش 1001/)).toBeInTheDocument();
    expect(screen.getByText(/در انتظار پرداخت/)).toBeInTheDocument();
    expect(screen.getByText(/لطفاً سریع ارسال شود/)).toBeInTheDocument();
  });

  it("displays order items with correct information", () => {
    mockUseOrder.mockReturnValue({
      data: makeOrder(),
      isLoading: false,
      isError: false,
    } as any);

    render(<OrderCheckout token="test-token-123" />);
    expect(screen.getByText("پیراهن مردانه")).toBeInTheDocument();
    expect(screen.getByText(/سایز: L/)).toBeInTheDocument();
    expect(screen.getByText(/تعداد: 2/)).toBeInTheDocument();
  });

  it("displays financial breakdown", () => {
    mockUseOrder.mockReturnValue({
      data: makeOrder(),
      isLoading: false,
      isError: false,
    } as any);

    render(<OrderCheckout token="test-token-123" />);
    expect(screen.getByText(/جمع اقلام/)).toBeInTheDocument();
    expect(screen.getByText(/هزینه ارسال/)).toBeInTheDocument();
    expect(screen.getByText(/مجموع/)).toBeInTheDocument();
  });

  it("displays address information", () => {
    mockUseOrder.mockReturnValue({
      data: makeOrder(),
      isLoading: false,
      isError: false,
    } as any);

    render(<OrderCheckout token="test-token-123" />);
    expect(screen.getByText("علی رضایی")).toBeInTheDocument();
    expect(screen.getByText("تهران، خیابان نمونه، پلاک ۱")).toBeInTheDocument();
  });

  it("shows change address button when order is payable", () => {
    mockUseOrder.mockReturnValue({
      data: makeOrder(),
      isLoading: false,
      isError: false,
    } as any);

    render(<OrderCheckout token="test-token-123" />);
    expect(screen.getByText(/تغییر آدرس/)).toBeInTheDocument();
  });

  it("hides change address button when order is not payable", () => {
    mockUseOrder.mockReturnValue({
      data: makeOrder({ is_payable: false }),
      isLoading: false,
      isError: false,
    } as any);

    render(<OrderCheckout token="test-token-123" />);
    expect(screen.queryByText(/تغییر آدرس/)).not.toBeInTheDocument();
  });

  it("expands address selection when change address is clicked", async () => {
    const user = userEvent.setup();
    mockUseOrder.mockReturnValue({
      data: makeOrder(),
      isLoading: false,
      isError: false,
    } as any);
    mockUseAddresses.mockReturnValue({
      data: [
        {
          id: 1,
          title: "خانه",
          recipient_name: "علی",
          phone: "09121234567",
          province: 1,
          city: 1,
          postal_code: "12345",
          address_line: "آدرس اول",
          is_default: true,
          created_at: "",
          updated_at: "",
        },
        {
          id: 2,
          title: "محل کار",
          recipient_name: "علی",
          phone: "09121234567",
          province: 1,
          city: 1,
          postal_code: "67890",
          address_line: "آدرس دوم",
          is_default: false,
          created_at: "",
          updated_at: "",
        },
      ],
      isLoading: false,
    } as any);

    render(<OrderCheckout token="test-token-123" />);

    await user.click(screen.getByText(/تغییر آدرس/));

    expect(screen.getByText(/انتخاب آدرس جدید/)).toBeInTheDocument();
    expect(screen.getByText("خانه")).toBeInTheDocument();
    expect(screen.getByText("محل کار")).toBeInTheDocument();
  });

  it("shows cancel button when order is payable and not expired", () => {
    mockUseOrder.mockReturnValue({
      data: makeOrder(),
      isLoading: false,
      isError: false,
    } as any);

    render(<OrderCheckout token="test-token-123" />);
    expect(screen.getByRole("button", { name: /لغو سفارش/ })).toBeInTheDocument();
  });

  it("requires confirmation for cancel", async () => {
    const user = userEvent.setup();
    mockUseOrder.mockReturnValue({
      data: makeOrder(),
      isLoading: false,
      isError: false,
    } as any);

    render(<OrderCheckout token="test-token-123" />);

    const cancelBtn = screen.getByRole("button", { name: /لغو سفارش/ });
    await user.click(cancelBtn);

    expect(screen.getByText(/مطمئنید.*لغو سفارش/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /انصراف/ })).toBeInTheDocument();
  });

  it("calls cancelOrder.mutate on confirmed cancel", async () => {
    const user = userEvent.setup();
    const mutateMock = vi.fn();

    mockUseOrder.mockReturnValue({
      data: makeOrder(),
      isLoading: false,
      isError: false,
    } as any);
    mockUseCancelOrder.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as any);

    render(<OrderCheckout token="test-token-123" />);

    await user.click(screen.getByRole("button", { name: /لغو سفارش/ }));
    await user.click(screen.getByRole("button", { name: /مطمئنید.*لغو سفارش/ }));

    expect(mutateMock).toHaveBeenCalledWith("test-token-123", expect.any(Object));
  });

  it("shows expired notice for expired orders", () => {
    mockUseOrder.mockReturnValue({
      data: makeOrder({ is_expired: true, is_payable: false }),
      isLoading: false,
      isError: false,
    } as any);

    render(<OrderCheckout token="test-token-123" />);
    expect(screen.getByText(/منقضی شده/)).toBeInTheDocument();
  });

  it("renders payment gateways section when order is payable", () => {
    mockUseOrder.mockReturnValue({
      data: makeOrder(),
      isLoading: false,
      isError: false,
    } as any);
    mockUsePaymentGateways.mockReturnValue({
      data: [
        { id: 1, title: "زرین‌پال", badge: null, description: null, min_amount: null, max_amount: null },
      ],
      isLoading: false,
    } as any);

    render(<OrderCheckout token="test-token-123" />);
    expect(screen.getByText(/انتخاب درگاه پرداخت/)).toBeInTheDocument();
    expect(screen.getByText("زرین‌پال")).toBeInTheDocument();
  });

  it("calls payOrder.mutate when pay button is clicked", async () => {
    const user = userEvent.setup();
    const mutateMock = vi.fn();

    mockUseOrder.mockReturnValue({
      data: makeOrder(),
      isLoading: false,
      isError: false,
    } as any);
    mockUsePaymentGateways.mockReturnValue({
      data: [
        { id: 1, title: "زرین‌پال", badge: null, description: null, min_amount: null, max_amount: null },
      ],
      isLoading: false,
    } as any);
    mockUsePayOrder.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as any);

    render(<OrderCheckout token="test-token-123" />);

    await user.click(screen.getByRole("radio", { name: /زرین‌پال/ }));
    await user.click(screen.getByRole("button", { name: /پرداخت/ }));

    expect(mutateMock).toHaveBeenCalledWith(
      { token: "test-token-123", gateway_id: 1 },
      expect.any(Object),
    );
  });

  it("redirects to redirect_url on successful payment", async () => {
    const user = userEvent.setup();
    const mutateMock = vi.fn();

    mockUseOrder.mockReturnValue({
      data: makeOrder(),
      isLoading: false,
      isError: false,
    } as any);
    mockUsePaymentGateways.mockReturnValue({
      data: [
        { id: 1, title: "زرین‌پال", badge: null, description: null, min_amount: null, max_amount: null },
      ],
      isLoading: false,
    } as any);
    mockUsePayOrder.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as any);

    delete (window as any).location;
    (window as any).location = { href: "" };

    render(<OrderCheckout token="test-token-123" />);

    await user.click(screen.getByRole("radio", { name: /زرین‌پال/ }));
    await user.click(screen.getByRole("button", { name: /پرداخت/ }));

    const onSuccess = mutateMock.mock.calls[0][1].onSuccess;
    onSuccess({ redirect_url: "https://gateway.example.com/pay" });

    expect(window.location.href).toBe("https://gateway.example.com/pay");
  });
});
