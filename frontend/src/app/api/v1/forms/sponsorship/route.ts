import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-responses";
import { strapiCreate, generateTransactionId } from "@/lib/strapi-submit";
import { sendPujaConfirmation, sendAdminNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let fields: Record<string, string> = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        if (typeof value === "string") fields[key] = value;
      });
    } else {
      fields = await request.json().catch(() => ({}));
    }

    if (!fields.devoteeName && !fields.sponsorName)
      return errorResponse("Devotee name is required", 400);
    if (!fields.email)
      return errorResponse("Email address is required", 400);

    const transactionId = generateTransactionId();
    const sponsorName = fields.devoteeName || fields.sponsorName;
    const pujaType = fields.pujaId || "General Puja";
    const date = fields.sponsorshipDate
      ? new Date(fields.sponsorshipDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
      : "To be confirmed";

    const result = await strapiCreate("puja-sponsorships", {
      pujaId: pujaType,
      pujaServiceName: pujaType,
      sponsorName,
      sponsorEmail: fields.email,
      sponsorPhone: fields.phone || null,
      requestedDate: fields.sponsorshipDate
        ? new Date(fields.sponsorshipDate).toISOString()
        : new Date().toISOString(),
      location: fields.location || "At Temple",
      notes: [fields.specialInstructions, fields.notes].filter(Boolean).join("\n\n") || null,
      approvalStatus: "pending",
      transactionId,
    });

    if (!result.ok)
      return errorResponse("Unable to submit request. Please try again or call (813) 269-7262.", 500);

    // Send emails (non-blocking — don't fail the request if email fails)
    await Promise.allSettled([
      sendPujaConfirmation({
        to: fields.email,
        name: sponsorName,
        pujaType,
        date,
        location: fields.location || "At Temple",
        transactionId,
      }),
      sendAdminNotification({
        formType: "Puja Sponsorship",
        submitterName: sponsorName,
        submitterEmail: fields.email,
        details: {
          "Puja Type": pujaType,
          "Requested Date": date,
          "Phone": fields.phone || null,
          "Location": fields.location || "At Temple",
          "Notes": fields.specialInstructions || fields.notes || null,
        },
        transactionId,
      }),
    ]);

    return successResponse({
      message: "Puja sponsorship request submitted! A confirmation email has been sent to your inbox.",
      transactionId,
    }, 201);
  } catch (err) {
    console.error("[api/v1/forms/sponsorship]", err);
    return errorResponse("Internal server error", 500);
  }
}
