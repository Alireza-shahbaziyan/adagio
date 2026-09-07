import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../test/test-utils";
import PaymentAction from "@/components/Orders/PaymentAction";
import type { Order } from "@/types/checkout";

vi.mock("@/lib/checkout", () => ({
  usePaymentGateways: vi.fn(),
  usePayOrder: vi.fn(),
}));

vi.mock("@/lib/app-state", () => ({
  useAppState: vi.fn(() => ({
    showToast: vi.fn(),
  })),
}));

import { usePaymentGateways, usePayOrder } from "@/lib/checkout";
import { useAppState } from "@/lib/app-state";

const mockUsePaymentGateways = vi.mocked(usePaymentGateways);
const mockUsePayOrder = vi.mocked(usePayOrder);
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
    customer_note: "",
    expires_at: null,
    paid_at: null,
    is_payable: true,
    is_expired: false,
    created_at: "2026-01-01T00:00:00Z",
    address: {
      id: 1,
      title: "خانه",
      recipient_name: "علی",
      phone: "09121234567",
      province: 1,
      city: 1,
      postal_code: "1234567890",
      address_line: "خیابان نمونه",
    },
    items: [],
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
});

describe("PaymentAction", () => {
  it("renders nothing when order is not payable", () => {
    mockUsePaymentGateways.mockReturnValue({
      data: undefined,
      isLoading: false,
    } as any);
    mockUsePayOrder.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as any);

    const { container } = render(
      <PaymentAction order={makeOrder({ is_payable: false })} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("shows expired message when order is expired", () => {
    mockUsePaymentGateways.mockReturnValue({
      data: undefined,
      isLoading: false,
    } as any);
    mockUsePayOrder.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as any);

    render(
      <PaymentAction order={makeOrder({ is_expired: true, is_payable: true })} />,
    );
    expect(screen.getByText(/منقضی شده/)).toBeInTheDocument();
  });

  it("shows loading skeletons while gateways load", () => {
    mockUsePaymentGateways.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);
    mockUsePayOrder.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as any);

    render(<PaymentAction order={makeOrder()} />);
    expect(screen.getByText(/انتخاب درگاه پرداخت/)).toBeInTheDocument();
  });

  it("renders gateway list when gateways are loaded", () => {
    mockUsePaymentGateways.mockReturnValue({
      data: [
        { id: 1, title: "زرین‌پال", badge: "محبوب", description: null, min_amount: null, max_amount: null },
        { id: 2, title: "آی‌دی‌پی", badge: null, description: null, min_amount: null, max_amount: null },
      ],
      isLoading: false,
    } as any);
    mockUsePayOrder.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as any);

    render(<PaymentAction order={makeOrder()} />);
    expect(screen.getByText("زرین‌پال")).toBeInTheDocument();
    expect(screen.getByText("آی‌دی‌پی")).toBeInTheDocument();
    expect(screen.getByText("محبوب")).toBeInTheDocument();
  });

  it("auto-selects first gateway", () => {
    mockUsePaymentGateways.mockReturnValue({
      data: [
        { id: 1, title: "زرین‌پال", badge: null, description: null, min_amount: null, max_amount: null },
      ],
      isLoading: false,
    } as any);

    const mutateMock = vi.fn();
    mockUsePayOrder.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as any);

    render(<PaymentAction order={makeOrder()} />);

    const radio = screen.getByRole("radio", { name: /زرین‌پال/ });
    expect(radio).toBeChecked();
  });

  it("calls payOrder.mutate when pay button is clicked", async () => {
    const user = userEvent.setup();
    const mutateMock = vi.fn();

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

    render(<PaymentAction order={makeOrder()} />);

    await user.click(screen.getByRole("button", { name: /پرداخت/ }));

    expect(mutateMock).toHaveBeenCalledWith(
      { token: "test-token-123", gateway_id: 1 },
      expect.any(Object),
    );
  });

  it("redirects to redirect_url on successful payment", async () => {
    const user = userEvent.setup();
    const mutateMock = vi.fn();
    const showToastMock = vi.fn();

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
    mockUseAppState.mockReturnValue({
      showToast: showToastMock,
      toastMessage: "",
      toastVisible: false,
    });

    delete (window as any).location;
    (window as any).location = { href: "" };

    render(<PaymentAction order={makeOrder()} />);

    await user.click(screen.getByRole("button", { name: /پرداخت/ }));

    const onSuccess = mutateMock.mock.calls[0][1].onSuccess;
    onSuccess({ redirect_url: "https://gateway.example.com/pay" });

    expect(window.location.href).toBe("https://gateway.example.com/pay");
  });

  it("shows toast on payment error", async () => {
    const user = userEvent.setup();
    const mutateMock = vi.fn();
    const showToastMock = vi.fn();

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
    mockUseAppState.mockReturnValue({
      showToast: showToastMock,
      toastMessage: "",
      toastVisible: false,
    });

    render(<PaymentAction order={makeOrder()} />);

    await user.click(screen.getByRole("button", { name: /پرداخت/ }));

    const onError = mutateMock.mock.calls[0][1].onError;
    onError(new Error("network error"));

    expect(showToastMock).toHaveBeenCalledWith("شروع پرداخت ناموفق بود");
  });

  it("disables pay button while payment is pending", () => {
    mockUsePaymentGateways.mockReturnValue({
      data: [
        { id: 1, title: "زرین‌پال", badge: null, description: null, min_amount: null, max_amount: null },
      ],
      isLoading: false,
    } as any);
    mockUsePayOrder.mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    } as any);

    render(<PaymentAction order={makeOrder()} />);
    expect(screen.getByRole("button", { name: /در حال اتصال/ })).toBeDisabled();
  });

  it("shows message when no gateways are available", () => {
    mockUsePaymentGateways.mockReturnValue({
      data: [],
      isLoading: false,
    } as any);
    mockUsePayOrder.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as any);

    render(<PaymentAction order={makeOrder()} />);
    expect(screen.getByText(/درگاه پرداختی فعال نیست/)).toBeInTheDocument();
  });
});
