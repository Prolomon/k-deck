export interface InitializePaystackOptions {
  email: string;
  amountInNaira: number;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
  reference?: string;
}

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    status: string; // 'success'
    reference: string;
    amount: number; // in kobo
    gateway_response: string;
    customer: {
      email: string;
    };
    metadata?: Record<string, unknown>;
  };
}

export async function initializePaystackPayment(
  options: InitializePaystackOptions
): Promise<PaystackInitResponse> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey || secretKey.startsWith("sk_test_xxx")) {
    // Development / demo fallback
    const mockRef = options.reference || `demo_ref_${Date.now()}`;
    return {
      status: true,
      message: "Development Mock Authorization URL generated",
      data: {
        authorization_url: `/events/payment-success?reference=${mockRef}`,
        access_code: `mock_code_${Date.now()}`,
        reference: mockRef,
      },
    };
  }

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: options.email,
      amount: Math.round(options.amountInNaira * 100), // convert to kobo
      callback_url: options.callbackUrl,
      metadata: options.metadata,
      reference: options.reference,
    }),
  });

  return (await response.json()) as PaystackInitResponse;
}

export async function verifyPaystackPayment(
  reference: string
): Promise<PaystackVerifyResponse> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey || secretKey.startsWith("sk_test_xxx") || reference.startsWith("demo_ref_")) {
    return {
      status: true,
      message: "Development Mock Payment Verified",
      data: {
        status: "success",
        reference,
        amount: 500000,
        gateway_response: "Approved",
        customer: {
          email: "attendee@example.com",
        },
      },
    };
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    }
  );

  return (await response.json()) as PaystackVerifyResponse;
}
