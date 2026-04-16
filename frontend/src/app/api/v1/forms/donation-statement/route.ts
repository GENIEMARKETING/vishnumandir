import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-responses";
import { strapiCreate, generateTransactionId } from "@/lib/strapi-submit";
import { sendFormConfirmation, sendAdminNotification } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    if (!body.email) return errorResponse("Email is required", 400);
    if (!body.name)  return errorResponse("Full name is required", 400);

    const transactionId = generateTransactionId();

    const result = await strapiCreate("form-submissions", {
      formType: "DONATION_STATEMENT",
      email: body.email,
      name: body.name,
      payload: { period: body.period || null, startDate: body.startDate || null, endDate: body.endDate || null, delivery: body.delivery || null, address: body.address || null },
      transactionId,
    });

    if (!result.ok) {
      console.error("[api/v1/forms/donation-statement] Strapi create failed:", {
        transactionId,
        status: result.status,
        error: result.error,
      });

      await Promise.allSettled([
        sendFormConfirmation({
          to: body.email,
          name: body.name,
          formType: "DONATION_STATEMENT",
          transactionId,
        }),
        sendAdminNotification({
          formType: "Donation Statement Request (fallback)",
          submitterName: body.name,
          submitterEmail: body.email,
          details: {
            Period: body.period || null,
            "Delivery Method": body.delivery || null,
            "Strapi Error": result.error,
          },
          transactionId,
        }),
      ]);

      return successResponse(
        {
          message:
            "Donation statement request received! We will send it within 5 business days.",
          transactionId,
        },
        202
      );
    }

    await Promise.allSettled([
      sendFormConfirmation({ to: body.email, name: body.name, formType: "DONATION_STATEMENT", transactionId }),
      sendAdminNotification({ formType: "Donation Statement Request", submitterName: body.name, submitterEmail: body.email, details: { "Period": body.period || null, "Delivery Method": body.delivery || null }, transactionId }),
    ]);

    return successResponse({ message: "Donation statement request received! We will send it within 5 business days.", transactionId }, 201);
  } catch (err) {
    console.error("[api/v1/forms/donation-statement]", err);
    return errorResponse("Internal server error", 500);
  }
}
