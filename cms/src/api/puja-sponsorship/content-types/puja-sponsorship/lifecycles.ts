/**
 * Puja Sponsorship lifecycle hooks.
 * Sends status update emails to the devotee when the admin changes approvalStatus.
 */

async function sendResendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from   = process.env.SENDER_EMAIL_ADDRESS || "Vishnu Mandir Tampa <no-reply@vishnumandirtampa.com>";

  if (!apiKey) {
    strapi.log.warn("[puja-sponsorship lifecycle] RESEND_API_KEY not set — skipping email");
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      strapi.log.error("[puja-sponsorship lifecycle] Email failed:", err);
    } else {
      strapi.log.info(`[puja-sponsorship lifecycle] Email sent to ${to}`);
    }
  } catch (e) {
    strapi.log.error("[puja-sponsorship lifecycle] Email error:", e);
  }
}

export default {
  async afterUpdate(event: any) {
    try {
      const { result, params } = event;

      // Only trigger when approvalStatus changed
      const newStatus    = result?.approvalStatus;
      const prevStatus   = params?.data?.approvalStatus;

      if (!newStatus || newStatus === prevStatus) return;
      if (!result?.sponsorEmail) return;

      const statusLabels: Record<string, { label: string; message: string; color: string }> = {
        confirmed: { label: "Confirmed ✅", message: "Your puja sponsorship has been <strong>confirmed</strong>. Our priests look forward to performing this sacred service for you and your family.", color: "#16a34a" },
        completed: { label: "Completed 🙏", message: "Your sponsored puja has been <strong>completed</strong>. We pray that Lord Vishnu's blessings bring peace, prosperity, and joy to you and your family.", color: "#8B2E0F" },
        pending:   { label: "Under Review", message: "Your puja sponsorship request is currently under review.", color: "#D97706" },
      };

      const info = statusLabels[newStatus];
      if (!info) return; // Don't send for unknown statuses

      const date = result.requestedDate
        ? new Date(result.requestedDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
        : "To be confirmed";

      const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f5f5f0;font-family:Georgia,serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:40px 20px">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08)">
      <tr><td style="background:#8B2E0F;padding:32px 40px;text-align:center">
        <p style="margin:0;color:#C5A059;font-style:italic;font-size:14px;letter-spacing:2px">🕉 OM NAMO NARAYANAYA 🕉</p>
        <h1 style="margin:8px 0 0;color:#fff;font-size:26px;font-weight:normal">Vishnu Mandir Tampa</h1>
        <p style="margin:4px 0 0;color:#e8c99a;font-size:13px">5803 Lynn Road, Tampa, FL 33624</p>
      </td></tr>
      <tr><td style="background:#C5A059;height:3px"></td></tr>
      <tr><td style="padding:40px">
        <h2 style="color:#8B2E0F;font-size:22px;margin:0 0 20px;font-weight:normal">Puja Status Update</h2>
        <p style="color:#374151;line-height:1.7;margin:0 0 16px">Dear <strong>${result.sponsorName || "Devotee"}</strong>,</p>
        <div style="padding:16px 20px;background:#f9fafb;border-left:4px solid ${info.color};border-radius:4px;margin-bottom:20px">
          <p style="margin:0;color:${info.color};font-weight:bold;font-size:16px">Status: ${info.label}</p>
        </div>
        <p style="color:#374151;line-height:1.7;margin:0 0 20px">${info.message}</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #f0ece5;padding-top:20px;margin-top:20px">
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:160px">Puja Type</td><td style="padding:8px 0;color:#1f2937;font-size:14px;font-weight:bold">${result.pujaServiceName || result.pujaId || "Puja Service"}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px">Requested Date</td><td style="padding:8px 0;color:#1f2937;font-size:14px;font-weight:bold">${date}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px">Transaction ID</td><td style="padding:8px 0;color:#1f2937;font-size:14px;font-weight:bold">${result.transactionId || ""}</td></tr>
        </table>
        <p style="color:#6b7280;font-size:13px;margin-top:24px;padding:16px;background:#fdfbf7;border-left:3px solid #C5A059;border-radius:4px">
          Questions? Call <strong>(813) 269-7262</strong> or email <a href="mailto:info@vishnumandirtampa.com" style="color:#8B2E0F">info@vishnumandirtampa.com</a>
        </p>
      </td></tr>
      <tr><td style="background:#fdfbf7;border-top:1px solid #e8e0d5;padding:24px 40px;text-align:center">
        <p style="margin:0;color:#6b7280;font-size:13px">Vishnu Mandir, Tampa &bull; (813) 269-7262</p>
        <p style="margin:8px 0 0;color:#9ca3af;font-size:12px">This is an automated message. Please do not reply directly.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

      await sendResendEmail(
        result.sponsorEmail,
        `Puja Update: ${info.label} — Vishnu Mandir Tampa`,
        html
      );
    } catch (err) {
      strapi.log.error("[puja-sponsorship lifecycle] afterUpdate error:", err);
    }
  },
};
