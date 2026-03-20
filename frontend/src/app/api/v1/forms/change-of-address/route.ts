import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-responses";
import { strapiCreate, generateTransactionId } from "@/lib/strapi-submit";
import { sendFormConfirmation, sendAdminNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    if (!body.email) return errorResponse("Email is required", 400);
    if (!body.name)  return errorResponse("Full name is required", 400);

    const transactionId = generateTransactionId();

    const result = await strapiCreate("form-submissions", {
      formType: "CHANGE_OF_ADDRESS",
      email: body.email,
      name: body.name,
      payload: { phone: body.phone || null, street: body.street || null, city: body.city || null, state: body.state || null, zip: body.zip || null },
      transactionId,
    });

    if (!result.ok)
      return errorResponse("Unable to update address. Please call (813) 269-7262.", 500);

    await Promise.allSettled([
      sendFormConfirmation({ to: body.email, name: body.name, formType: "CHANGE_OF_ADDRESS", transactionId }),
      sendAdminNotification({ formType: "Change of Address", submitterName: body.name, submitterEmail: body.email, details: { "New Address": [body.street, body.city, body.state, body.zip].filter(Boolean).join(", ") || null, "New Phone": body.phone || null }, transactionId }),
    ]);

    return successResponse({ message: "Address update request received! Your records will be updated within 3 business days.", transactionId }, 201);
  } catch (err) {
    console.error("[api/v1/forms/change-of-address]", err);
    return errorResponse("Internal server error", 500);
  }
}
