/**
 * Email helper using Resend REST API.
 * Used by Next.js API routes to send confirmation and notification emails.
 */

const RESEND_API_URL = "https://api.resend.com/emails";

function getConfig() {
  return {
    apiKey:      process.env.RESEND_API_KEY || "",
    fromAddress: process.env.SENDER_EMAIL_ADDRESS || "Vishnu Mandir Tampa <no-reply@vishnumandirtampa.com>",
    adminEmail:  process.env.ADMIN_EMAIL_ADDRESS || "vishnumandirtampa@gmail.com",
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Core send function — calls Resend REST API */
async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const { apiKey, fromAddress } = getConfig();
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping email");
    return false;
  }
  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ from: fromAddress, to, subject, html }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[email] Resend error:", err);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[email] fetch error:", e);
    return false;
  }
}

/** Shared HTML wrapper with Vishnu Mandir branding */
function emailWrapper(content: string, title: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:Georgia,serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
        <!-- Header -->
        <tr><td style="background:#8B2E0F;padding:32px 40px;text-align:center">
          <p style="margin:0;color:#C5A059;font-style:italic;font-size:14px;letter-spacing:2px">🕉 OM NAMO NARAYANAYA 🕉</p>
          <h1 style="margin:8px 0 0;color:#ffffff;font-size:26px;font-weight:normal;letter-spacing:1px">Vishnu Mandir Tampa</h1>
          <p style="margin:4px 0 0;color:#e8c99a;font-size:13px">5803 Lynn Road, Tampa, FL 33624</p>
        </td></tr>
        <!-- Gold divider -->
        <tr><td style="background:#C5A059;height:3px"></td></tr>
        <!-- Content -->
        <tr><td style="padding:40px">
          <h2 style="color:#8B2E0F;font-size:22px;margin:0 0 20px;font-weight:normal">${title}</h2>
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#fdfbf7;border-top:1px solid #e8e0d5;padding:24px 40px;text-align:center">
          <p style="margin:0;color:#6b7280;font-size:13px">Vishnu Mandir, Tampa &bull; (813) 269-7262 &bull; <a href="mailto:info@vishnumandirtampa.com" style="color:#8B2E0F">info@vishnumandirtampa.com</a></p>
          <p style="margin:8px 0 0;color:#9ca3af;font-size:12px">This is an automated message. Please do not reply directly to this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function field(label: string, value: string | null | undefined) {
  if (!value) return "";
  const safeLabel = escapeHtml(label);
  const safeValue = escapeHtml(value);
  return `<tr>
    <td style="padding:8px 0;color:#6b7280;font-size:14px;width:160px;vertical-align:top">${safeLabel}</td>
    <td style="padding:8px 0;color:#1f2937;font-size:14px;font-weight:bold">${safeValue}</td>
  </tr>`;
}

function infoTable(rows: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #f0ece5;margin-top:20px;padding-top:20px">${rows}</table>`;
}

function ctaButton(text: string, url: string) {
  const safeText = escapeHtml(text);
  const safeUrl = escapeHtml(url);
  return `<div style="margin-top:28px;text-align:center">
    <a href="${safeUrl}" style="background:#8B2E0F;color:#ffffff;padding:14px 32px;border-radius:50px;text-decoration:none;font-size:15px;font-weight:bold">${safeText}</a>
  </div>`;
}

// ─── PUJA SPONSORSHIP ────────────────────────────────────────────────────────

export async function sendPujaConfirmation(opts: {
  to: string; name: string; pujaType: string; date: string;
  location: string; transactionId: string;
}) {
  const name = escapeHtml(opts.name);
  const content = `
    <p style="color:#374151;line-height:1.7;margin:0 0 16px">Dear <strong>${name}</strong>,</p>
    <p style="color:#374151;line-height:1.7;margin:0 0 20px">
      Thank you for your puja sponsorship request. We have received your submission and our team will review it shortly.
      You will receive a confirmation email once your puja is confirmed.
    </p>
    ${infoTable(
      field("Puja Type", opts.pujaType) +
      field("Requested Date", opts.date) +
      field("Location", opts.location) +
      field("Transaction ID", opts.transactionId)
    )}
    <p style="color:#6b7280;font-size:13px;margin-top:24px;padding:16px;background:#fdfbf7;border-left:3px solid #C5A059;border-radius:4px">
      If you have questions, call us at <strong>(813) 269-7262</strong> and mention your Transaction ID.
    </p>`;

  return sendEmail(opts.to, "Puja Sponsorship Request Received — Vishnu Mandir Tampa", emailWrapper(content, "Puja Sponsorship Request Received ✨"));
}

export async function sendPujaStatusUpdate(opts: {
  to: string; name: string; pujaType: string; date: string;
  status: string; transactionId: string;
}) {
  const name = escapeHtml(opts.name);
  const statusMessages: Record<string, { label: string; message: string; color: string }> = {
    confirmed: { label: "Confirmed ✅", message: "Your puja sponsorship has been <strong>confirmed</strong>. Our priests are looking forward to performing this sacred service for you and your family.", color: "#16a34a" },
    completed: { label: "Completed 🙏", message: "Your sponsored puja has been <strong>completed</strong>. We pray that Lord Vishnu's blessings bring peace, prosperity, and joy to you and your family.", color: "#8B2E0F" },
    pending:   { label: "Under Review", message: "Your puja sponsorship is currently being reviewed by our team.", color: "#D97706" },
  };
  const info = statusMessages[opts.status] ?? { label: opts.status, message: "Your puja request has been updated.", color: "#6b7280" };

  const content = `
    <p style="color:#374151;line-height:1.7;margin:0 0 16px">Dear <strong>${name}</strong>,</p>
    <div style="padding:16px 20px;background:#f0fdf4;border-left:4px solid ${info.color};border-radius:4px;margin-bottom:20px">
      <p style="margin:0;color:${info.color};font-weight:bold;font-size:16px">Status: ${info.label}</p>
    </div>
    <p style="color:#374151;line-height:1.7;margin:0 0 20px">${info.message}</p>
    ${infoTable(
      field("Puja Type", opts.pujaType) +
      field("Requested Date", opts.date) +
      field("Transaction ID", opts.transactionId)
    )}`;

  return sendEmail(opts.to, `Puja Update: ${info.label} — Vishnu Mandir Tampa`, emailWrapper(content, `Puja Status Update`));
}

// ─── FACILITY REQUEST ────────────────────────────────────────────────────────

export async function sendFacilityConfirmation(opts: {
  to: string; name: string; eventType: string; date: string;
  guests: number; transactionId: string;
}) {
  const name = escapeHtml(opts.name);
  const content = `
    <p style="color:#374151;line-height:1.7;margin:0 0 16px">Dear <strong>${name}</strong>,</p>
    <p style="color:#374151;line-height:1.7;margin:0 0 20px">
      Thank you for your facility rental request. We have received your submission and will review availability.
      You will hear back from us within 2 business days.
    </p>
    ${infoTable(
      field("Event Type", opts.eventType) +
      field("Requested Date", opts.date) +
      field("Expected Guests", String(opts.guests)) +
      field("Transaction ID", opts.transactionId)
    )}
    <p style="color:#6b7280;font-size:13px;margin-top:24px;padding:16px;background:#fdfbf7;border-left:3px solid #C5A059;border-radius:4px">
      For urgent inquiries, call us at <strong>(813) 269-7262</strong>.
    </p>`;

  return sendEmail(opts.to, "Facility Request Received — Vishnu Mandir Tampa", emailWrapper(content, "Facility Request Received 🏛️"));
}

export async function sendFacilityStatusUpdate(opts: {
  to: string; name: string; eventType: string; date: string;
  status: string; transactionId: string;
}) {
  const name = escapeHtml(opts.name);
  const statusMessages: Record<string, { label: string; message: string; color: string }> = {
    approved: { label: "Approved ✅", message: "Great news! Your facility request has been <strong>approved</strong>. Please contact us to finalize arrangements and discuss any requirements.", color: "#16a34a" },
    rejected: { label: "Unable to Accommodate", message: "Unfortunately, we are unable to accommodate your facility request for the requested date. Please contact us to discuss alternative dates.", color: "#dc2626" },
    pending:  { label: "Under Review", message: "Your facility request is currently being reviewed by our team.", color: "#D97706" },
  };
  const info = statusMessages[opts.status] ?? { label: opts.status, message: "Your facility request has been updated.", color: "#6b7280" };

  const content = `
    <p style="color:#374151;line-height:1.7;margin:0 0 16px">Dear <strong>${name}</strong>,</p>
    <div style="padding:16px 20px;background:#f9fafb;border-left:4px solid ${info.color};border-radius:4px;margin-bottom:20px">
      <p style="margin:0;color:${info.color};font-weight:bold;font-size:16px">Status: ${info.label}</p>
    </div>
    <p style="color:#374151;line-height:1.7;margin:0 0 20px">${info.message}</p>
    ${infoTable(
      field("Event Type", opts.eventType) +
      field("Requested Date", opts.date) +
      field("Transaction ID", opts.transactionId)
    )}
    ${ctaButton("Contact Us", "mailto:info@vishnumandirtampa.com")}`;

  return sendEmail(opts.to, `Facility Request Update: ${info.label} — Vishnu Mandir Tampa`, emailWrapper(content, "Facility Request Update"));
}

// ─── GENERIC FORM SUBMISSION ─────────────────────────────────────────────────

export async function sendFormConfirmation(opts: {
  to: string; name: string; formType: string; transactionId: string;
}) {
  const formLabels: Record<string, { label: string; message: string }> = {
    DONATION_STATEMENT: { label: "Donation Statement Request", message: "We have received your donation statement request. Your statement will be prepared and sent within 5 business days." },
    CHANGE_OF_ADDRESS:  { label: "Change of Address",          message: "We have received your address update request. Your records will be updated within 3 business days." },
    EMAIL_SUBSCRIPTION: { label: "Email Subscription",         message: "Your newsletter subscription preferences have been updated. You'll receive temple updates and event announcements." },
  };
  const info = formLabels[opts.formType] ?? { label: "Request", message: "We have received your request and will follow up shortly." };
  const name = escapeHtml(opts.name || "Devotee");

  const content = `
    <p style="color:#374151;line-height:1.7;margin:0 0 16px">Dear <strong>${name}</strong>,</p>
    <p style="color:#374151;line-height:1.7;margin:0 0 20px">${info.message}</p>
    ${infoTable(
      field("Request Type", info.label) +
      field("Transaction ID", opts.transactionId)
    )}
    <p style="color:#6b7280;font-size:13px;margin-top:24px;padding:16px;background:#fdfbf7;border-left:3px solid #C5A059;border-radius:4px">
      Reference your Transaction ID if you need to follow up with us.
    </p>`;

  return sendEmail(opts.to, `${info.label} Confirmed — Vishnu Mandir Tampa`, emailWrapper(content, `${info.label} Confirmed ✅`));
}

// ─── ADMIN NOTIFICATION ──────────────────────────────────────────────────────

export async function sendAdminNotification(opts: {
  formType: string; submitterName: string; submitterEmail: string;
  details: Record<string, string | null | undefined>; transactionId: string;
}) {
  const { adminEmail } = getConfig();
  const submitterName = escapeHtml(opts.submitterName);
  const submitterEmail = escapeHtml(opts.submitterEmail);
  const rows = Object.entries(opts.details)
    .filter(([, v]) => v)
    .map(([k, v]) => field(k, v ?? ""))
    .join("");

  const content = `
    <p style="color:#374151;margin:0 0 16px">A new <strong>${escapeHtml(opts.formType)}</strong> was submitted on the Vishnu Mandir website.</p>
    ${infoTable(
      field("Submitted By", submitterName) +
      field("Email", submitterEmail) +
      field("Transaction ID", opts.transactionId) +
      rows
    )}
    ${ctaButton("View in Strapi Admin", "https://cms.vishnumandirtampa.com/admin")}`;

  return sendEmail(adminEmail, `New ${opts.formType} Submission — ${opts.submitterName}`, emailWrapper(content, `New Submission: ${opts.formType}`));
}
