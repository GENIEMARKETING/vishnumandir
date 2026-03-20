import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-responses";
import { strapiCreate, generateTransactionId } from "@/lib/strapi-submit";
import { sendFormConfirmation, sendAdminNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    if (!body.email) return errorResponse("Email is required", 400);

    const transactionId = generateTransactionId();

    const result = await strapiCreate("form-submissions", {
      formType: "EMAIL_SUBSCRIPTION",
      email: body.email,
      name: body.name || null,
      payload: { action: body.action || "subscribe", preferences: body.preferences || [], frequency: body.frequency || null },
      transactionId,
    });

    if (!result.ok)
      return errorResponse("Unable to update subscription. Please call (813) 269-7262.", 500);

    await Promise.allSettled([
      sendFormConfirmation({ to: body.email, name: body.name || "Devotee", formType: "EMAIL_SUBSCRIPTION", transactionId }),
      sendAdminNotification({ formType: "Email Subscription", submitterName: body.name || "Anonymous", submitterEmail: body.email, details: { "Action": body.action || "subscribe" }, transactionId }),
    ]);

    return successResponse({
      message: body.action === "unsubscribe"
        ? "You have been unsubscribed successfully."
        : "You are now subscribed! You will receive temple updates and event announcements.",
      transactionId,
    }, 201);
  } catch (err) {
    console.error("[api/v1/forms/email-subscription]", err);
    return errorResponse("Internal server error", 500);
  }
}
