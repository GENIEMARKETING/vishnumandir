import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-responses";
import { strapiCreate, generateTransactionId } from "@/lib/strapi-submit";
import { sendFacilityConfirmation, sendAdminNotification } from "@/lib/email";
import { parseFormDate, formatLongUsDate } from "@/lib/dates";

export const runtime = "nodejs";

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
    const requestedDate = parseFormDate(String(body.requestedDate));
    if (!requestedDate) return errorResponse("Invalid event date", 400);
    const date = formatLongUsDate(requestedDate);

    const result = await strapiCreate("facility-requests", {
      requesterName: body.contactName,
      requesterEmail: body.email,
      requesterPhone: body.phone,
      eventType: body.eventType,
      eventName: body.eventName || null,
      eventDate: requestedDate.toISOString(),
      startTime: body.startTime || null,
      endTime: body.endTime || null,
      numberOfGuests: Number(body.numberOfGuests),
      details: body.details || null,
      requirements: body.requirements || null,
      approvalStatus: "pending",
      transactionId,
    });

    if (!result.ok) {
      console.error("[api/v1/forms/facility-request] Strapi create failed:", {
        transactionId,
        status: result.status,
        error: result.error,
      });

      // Fallback: still email the admin + user so the request isn't lost.
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
          formType: "Facility Request (fallback)",
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
            "Strapi Error": result.error,
          },
          transactionId,
        }),
      ]);

      return successResponse(
        {
          message:
            "We received your request, but our system is temporarily having trouble saving it. A confirmation email has been sent. If you do not hear back within 2 business days, please call (813) 269-7262.",
          transactionId,
        },
        202
      );
    }

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
