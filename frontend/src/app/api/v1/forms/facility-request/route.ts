import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-responses";
import { strapiCreate, generateTransactionId } from "@/lib/strapi-submit";
import { sendFacilityConfirmation, sendAdminNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body.contactName)    return errorResponse("Contact name is required", 400);
    if (!body.email)          return errorResponse("Email is required", 400);
    if (!body.phone)          return errorResponse("Phone number is required", 400);
    if (!body.eventType)      return errorResponse("Event type is required", 400);
    if (!body.requestedDate)  return errorResponse("Event date is required", 400);
    if (!body.numberOfGuests) return errorResponse("Number of guests is required", 400);

    const transactionId = generateTransactionId();
    const date = new Date(body.requestedDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    const result = await strapiCreate("facility-requests", {
      requesterName: body.contactName,
      requesterEmail: body.email,
      requesterPhone: body.phone,
      eventType: body.eventType,
      eventName: body.eventName || null,
      eventDate: new Date(body.requestedDate).toISOString(),
      startTime: body.startTime || null,
      endTime: body.endTime || null,
      numberOfGuests: Number(body.numberOfGuests),
      details: body.details || null,
      requirements: body.requirements || null,
      approvalStatus: "pending",
      transactionId,
    });

    if (!result.ok)
      return errorResponse("Unable to submit request. Please call (813) 269-7262.", 500);

    await Promise.allSettled([
      sendFacilityConfirmation({
        to: body.email,
        name: body.contactName,
        eventType: body.eventType,
        date,
        guests: Number(body.numberOfGuests),
        transactionId,
      }),
      sendAdminNotification({
        formType: "Facility Request",
        submitterName: body.contactName,
        submitterEmail: body.email,
        details: {
          "Event Type": body.eventType,
          "Event Name": body.eventName || null,
          "Requested Date": date,
          "Start Time": body.startTime || null,
          "End Time": body.endTime || null,
          "Guests": String(body.numberOfGuests),
          "Details": body.details || null,
        },
        transactionId,
      }),
    ]);

    return successResponse({
      message: "Facility request submitted! A confirmation email has been sent. We will contact you within 2 business days.",
      transactionId,
    }, 201);
  } catch (err) {
    console.error("[api/v1/forms/facility-request]", err);
    return errorResponse("Internal server error", 500);
  }
}
