import nodemailer, { type SendMailOptions } from "nodemailer";
import path from "path";
import fs from "fs";

const zohoHost = process.env.ZOHO_HOST || "smtppro.zoho.com";
const zohoPort = Number(process.env.ZOHO_PORT || 465);
const zohoSecure = process.env.ZOHO_SECURE !== "false";
const zohoUser = process.env.ZOHO_USER || "it.service@kdeckprofessionalservices.com.ng";
const zohoPassword = process.env.ZOHO_PASSWORD;

const isZohoConfigured = Boolean(
  zohoUser && zohoPassword && !zohoPassword.includes("your_zoho")
);

export const zohoTransporter = nodemailer.createTransport({
  host: zohoHost,
  port: zohoPort,
  secure: zohoSecure,
  auth: {
    user: zohoUser,
    pass: zohoPassword || "",
  },
});

export const DEFAULT_FROM =
  process.env.EMAIL_FROM ||
  `K-DECK Professional Services <${zohoUser}>`;

export interface SendMailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Check for local logo file to attach via CID
const logoFilePath = path.join(process.cwd(), "public", "images", "k-deck.png");
const hasLogoFile = fs.existsSync(logoFilePath);

// Internal sender helper that attaches the official logo and logs simulation if offline
async function sendEmailSafely(options: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  attachments?: SendMailOptions["attachments"];
}): Promise<SendMailResult> {
  const from = options.from || DEFAULT_FROM;
  const recipients = Array.isArray(options.to) ? options.to.join(", ") : options.to;

  const attachments: SendMailOptions["attachments"] = options.attachments || [];

  if (hasLogoFile) {
    attachments.push({
      filename: "k-deck.png",
      path: logoFilePath,
      cid: "kdecklogo",
    });
  }

  if (!isZohoConfigured) {
    console.log("=================================================");
    console.log(`[ZOHO MAIL SIMULATION] To: ${recipients}`);
    console.log(`[ZOHO MAIL SIMULATION] From: ${from}`);
    console.log(`[ZOHO MAIL SIMULATION] Subject: ${options.subject}`);
    console.log(`[ZOHO MAIL SIMULATION] Server: ${zohoHost}:${zohoPort} (Secure: ${zohoSecure})`);
    console.log(`[ZOHO MAIL SIMULATION] Body length: ${options.html.length} chars`);
    console.log("=================================================");
    return {
      success: true,
      messageId: `mock_zoho_msg_${Date.now()}`,
    };
  }

  try {
    const info = await zohoTransporter.sendMail({
      from,
      to: recipients,
      subject: options.subject,
      html: options.html,
      attachments,
    });

    return { success: true, messageId: info.messageId };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Zoho Mail send failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Shared Professional Corporate Email Wrapper
 * Guarantees consistent typography, brand header, high contrast body,
 * and standard footer with Company Name, Subtitle, Office Address & Company Logo.
 */
function wrapEmailTemplate(options: {
  badgeText: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  bodyHtml: string;
  accentColor?: string;
}): string {
  const currentYear = new Date().getFullYear();
  const badgeBg = options.badgeBgColor || "#1e3a8a";
  const badgeText = options.badgeTextColor || "#93c5fd";
  const accent = options.accentColor || "#2563eb";

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>K-DECK Professional Services</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 36px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; background-color: #ffffff; border-radius: 18px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);">
            
            <!-- TOP BRAND HEADER -->
            <tr>
              <td style="background-color: #030712; padding: 28px 24px 24px; text-align: center; border-bottom: 2px solid ${accent};">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                  <tr>
                    <td style="vertical-align: middle; padding-right: 12px;">
                      <img src="cid:kdecklogo" alt="K-Deck Logo" width="38" height="38" style="display: block; border-radius: 8px; border: 1px solid #1f2937; background-color: #ffffff; padding: 2px;" />
                    </td>
                    <td style="vertical-align: middle; text-align: left;">
                      <div style="font-size: 16px; font-weight: 900; color: #ffffff; letter-spacing: 0.5px; text-transform: uppercase; line-height: 1.2;">
                        K-DECK PROFESSIONAL
                      </div>
                      <div style="font-size: 10px; font-weight: 700; color: #60a5fa; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px;">
                        CHARTERED ACCOUNTANTS &amp; CONSULTANTS
                      </div>
                    </td>
                  </tr>
                </table>

                <div style="margin-top: 16px;">
                  <span style="display: inline-block; background-color: ${badgeBg}; color: ${badgeText}; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; padding: 4px 14px; border-radius: 9999px;">
                    ${options.badgeText}
                  </span>
                </div>
              </td>
            </tr>

            <!-- MAIN EMAIL BODY -->
            <tr>
              <td style="padding: 36px 28px; background-color: #ffffff;">
                ${options.bodyHtml}
              </td>
            </tr>

            <!-- OFFICIAL BRAND FOOTER WITH LOGO & COMPANY NAME -->
            <tr>
              <td style="background-color: #030712; border-top: 1px solid #1f2937; padding: 34px 28px; text-align: center;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 16px;">
                  <tr>
                    <td style="vertical-align: middle; padding-right: 12px;">
                      <img src="cid:kdecklogo" alt="K-Deck Logo" width="42" height="42" style="display: block; border-radius: 8px; border: 1px solid #374151; background-color: #ffffff; padding: 2px;" />
                    </td>
                    <td style="vertical-align: middle; text-align: left;">
                      <div style="font-size: 14px; font-weight: 900; color: #ffffff; letter-spacing: 0.5px; text-transform: uppercase;">
                        K-DECK PROFESSIONAL SERVICES
                      </div>
                      <div style="font-size: 11px; font-weight: 600; color: #38bdf8; letter-spacing: 0.8px; text-transform: uppercase;">
                        Financial Advisory &bull; Audit &bull; Tax Practice &bull; ATS Academy
                      </div>
                    </td>
                  </tr>
                </table>

                <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                  21 Road, F1 Close, FESTAC Town, Lagos State, Nigeria<br />
                  Direct Advisory Desk: <a href="tel:+2349070573104" style="color: #60a5fa; text-decoration: none; font-weight: 600;">+234 907 057 3104</a> &bull; 
                  Official Email: <a href="mailto:it.service@kdeckprofessionalservices.com.ng" style="color: #60a5fa; text-decoration: none;">it.service@kdeckprofessionalservices.com.ng</a>
                </p>

                <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid #1f2937; font-size: 11px; color: #6b7280;">
                  &copy; ${currentYear} K-DECK Professional Services. All rights reserved.<br />
                  Secure communication processed via Zoho Mail SMTP Infrastructure.
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

// 1. EVENT / WEBINAR REGISTRATION EMAIL TEMPLATE
export async function sendEventRegistrationEmail(data: {
  toEmail: string;
  attendeeName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  isFree: boolean;
  amount: number;
  webinarLink?: string | null;
  whatsappGroupLink?: string | null;
  imageBase64?: string | null;
}) {
  const imageTag = data.imageBase64
    ? `<div style="text-align: center; margin: 24px 0;">
         <img src="${data.imageBase64}" alt="${data.eventTitle}" style="max-width: 100%; height: auto; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" />
       </div>`
    : "";

  const whatsappSection = data.whatsappGroupLink
    ? `<div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px; margin: 22px 0;">
         <p style="margin: 0 0 6px 0; font-weight: 800; color: #065f46; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Official Event WhatsApp Group:</p>
         <p style="margin: 0 0 14px 0; color: #047857; font-size: 13px; line-height: 1.5;">Join the channel for access credentials, downloadable presentation decks, and live Q&A updates:</p>
         <a href="${data.whatsappGroupLink}" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; font-weight: 700; padding: 11px 22px; border-radius: 8px; font-size: 13px; box-shadow: 0 3px 6px rgba(5, 150, 105, 0.25);">Join WhatsApp Community &rarr;</a>
       </div>`
    : "";

  const webinarLinkSection = data.webinarLink
    ? `<div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin: 22px 0;">
         <p style="margin: 0 0 6px 0; font-weight: 800; color: #1e40af; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Direct Webinar Access Room:</p>
         <p style="margin: 0 0 14px 0; color: #1d4ed8; font-size: 13px; line-height: 1.5;">Save this official link to join the session on your scheduled date and time:</p>
         <a href="${data.webinarLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 700; padding: 11px 22px; border-radius: 8px; font-size: 13px; box-shadow: 0 3px 6px rgba(37, 99, 235, 0.25);">Open Webinar Room &rarr;</a>
       </div>`
    : "";

  const bodyHtml = `
    <p style="font-size: 16px; margin: 0 0 16px 0; color: #0f172a;">Dear <strong>${data.attendeeName}</strong>,</p>
    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
      Your seat has been officially confirmed for <strong>${data.eventTitle}</strong>. Our chartered accountants and financial consultants look forward to sharing practical strategies to strengthen your organizational performance.
    </p>

    ${imageTag}

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px 24px; margin: 24px 0;">
      <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 1px;">Session Confirmation Details</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #334155;">
        <tr>
          <td style="padding: 7px 0; font-weight: 700; width: 110px; color: #64748b;">Event Date:</td>
          <td style="padding: 7px 0; font-weight: 600; color: #0f172a;">${data.eventDate}</td>
        </tr>
        <tr>
          <td style="padding: 7px 0; font-weight: 700; color: #64748b;">Time:</td>
          <td style="padding: 7px 0; font-weight: 600; color: #0f172a;">${data.eventTime}</td>
        </tr>
        <tr>
          <td style="padding: 7px 0; font-weight: 700; color: #64748b;">Platform:</td>
          <td style="padding: 7px 0; font-weight: 600; color: #0f172a;">${data.eventLocation}</td>
        </tr>
        <tr>
          <td style="padding: 7px 0; font-weight: 700; color: #64748b;">Admission:</td>
          <td style="padding: 7px 0; font-weight: 700; color: #059669;">
            ${data.isFree ? "Free Verified Entry" : `₦${data.amount.toLocaleString()} (Paid & Verified)`}
          </td>
        </tr>
      </table>
    </div>

    ${webinarLinkSection}
    ${whatsappSection}

    <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 24px 0 0 0;">
      If you require any assistance prior to the event, please reply directly to this email or speak with our concierge desk on WhatsApp (+234 907 057 3104).
    </p>
  `;

  const html = wrapEmailTemplate({
    badgeText: "Masterclass Registration Confirmed",
    badgeBgColor: "#1e3a8a",
    badgeTextColor: "#bfdbfe",
    accentColor: "#2563eb",
    bodyHtml,
  });

  return sendEmailSafely({
    to: data.toEmail,
    subject: `Confirmed: Your Registration for ${data.eventTitle}`,
    html,
  });
}

// 2. ATS TRAINING ENROLLMENT EMAIL TEMPLATE
export async function sendAtsClassRegistrationEmail(data: {
  toEmail: string;
  studentName: string;
  address: string;
  phone: string;
  subjectTaken: string;
  atsLevels: string[];
  whatsappGroups: Array<{ name: string; atsLevel: string; inviteUrl: string }>;
}) {
  const groupsHtml =
    data.whatsappGroups.length > 0
      ? data.whatsappGroups
          .map(
            (g) => `
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 18px; margin-bottom: 10px;">
                <p style="margin: 0 0 4px 0; font-weight: 800; color: #166534; font-size: 13px;">${g.name} (${g.atsLevel})</p>
                <a href="${g.inviteUrl}" style="display: inline-block; background-color: #15803d; color: #ffffff; text-decoration: none; font-weight: 700; padding: 7px 16px; border-radius: 6px; font-size: 12px; margin-top: 6px;">Join WhatsApp Study Group &rarr;</a>
              </div>
            `
          )
          .join("")
      : `<p style="font-size: 13px; color: #64748b;">Join our central study group: <a href="https://chat.whatsapp.com/I1paAUnSVWq0SvbQQmp9OK" style="color: #16a34a; font-weight: bold;">Click Here</a></p>`;

  const bodyHtml = `
    <p style="font-size: 16px; margin: 0 0 16px 0; color: #0f172a;">Dear <strong>${data.studentName}</strong>,</p>
    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
      Welcome to the <strong>K-Deck Accounting Technicians Scheme (ATS) Coaching Academy</strong>. Your registration has been received and verified. Below is your official student profile and your dedicated cohort study group links.
    </p>

    <div style="background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 14px; padding: 20px 24px; margin: 22px 0;">
      <p style="margin: 0 0 10px 0; font-weight: 800; color: #581c87; font-size: 13px; text-transform: uppercase; letter-spacing: 0.8px;">Enrolled Student Profile:</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #374151;">
        <tr><td style="padding: 6px 0; font-weight: 700; width: 130px; color: #6b21a8;">Enrolled Stages:</td><td><strong style="color: #581c87;">${data.atsLevels.join(", ")}</strong></td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700; color: #6b21a8;">Subjects / Papers:</td><td>${data.subjectTaken}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700; color: #6b21a8;">Contact Phone:</td><td>${data.phone}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700; color: #6b21a8;">Candidate Address:</td><td>${data.address}</td></tr>
      </table>
    </div>

    <div style="margin: 26px 0;">
      <p style="margin: 0 0 12px 0; font-weight: 800; color: #0f172a; font-size: 14px;">Your WhatsApp Cohort Study Links:</p>
      ${groupsHtml}
    </div>

    <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 24px 0 0 0;">
      Timetables, past question revisions, ICAN registration guidelines, and tutor contact details are coordinated directly via your WhatsApp cohort group.
    </p>
  `;

  const html = wrapEmailTemplate({
    badgeText: "ATS Academy Enrollment Confirmed",
    badgeBgColor: "#581c87",
    badgeTextColor: "#f3e8ff",
    accentColor: "#9333ea",
    bodyHtml,
  });

  return sendEmailSafely({
    to: data.toEmail,
    subject: `Welcome to K-Deck ATS Training - Enrolled for ${data.atsLevels.join(", ")}`,
    html,
  });
}

// 3. STAFF WELCOME & ONBOARDING EMAIL TEMPLATE
export async function sendStaffWelcomeEmail(data: {
  toEmail: string;
  name: string;
  role: string;
  department: string;
  isAdmin: boolean;
}) {
  const adminNote = data.isAdmin
    ? `<div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 16px 20px; margin: 20px 0;">
         <p style="margin: 0; font-size: 13px; color: #92400e; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Administrator Privileges Assigned</p>
         <p style="margin: 4px 0 0 0; font-size: 13px; color: #b45309; line-height: 1.5;">You have been granted administrator access to the K-Deck Executive Management Portal.</p>
       </div>`
    : "";

  const bodyHtml = `
    <p style="font-size: 16px; margin: 0 0 16px 0; color: #0f172a;">Dear <strong>${data.name}</strong>,</p>
    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
      Welcome to <strong>K-DECK Professional Services</strong>! Your profile has been created and verified in our corporate directory.
    </p>

    <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 14px; padding: 20px 24px; margin: 20px 0;">
      <p style="margin: 0 0 10px 0; font-weight: 800; color: #1e40af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.8px;">Official Directory Credentials</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #1e3a8a;">
        <tr><td style="padding: 6px 0; font-weight: 700; width: 130px; color: #3b82f6;">Designation:</td><td><strong>${data.role}</strong></td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700; color: #3b82f6;">Department:</td><td>${data.department}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700; color: #3b82f6;">Official Email:</td><td>${data.toEmail}</td></tr>
      </table>
    </div>

    ${adminNote}

    <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 22px 0 0 0;">
      For IT assistance or system credential inquiries, contact our IT Systems Directorate at <a href="mailto:it.service@kdeckprofessionalservices.com.ng" style="color: #2563eb;">it.service@kdeckprofessionalservices.com.ng</a>.
    </p>
  `;

  const html = wrapEmailTemplate({
    badgeText: "Corporate Staff Directory Onboarding",
    badgeBgColor: "#0f172a",
    badgeTextColor: "#93c5fd",
    accentColor: "#2563eb",
    bodyHtml,
  });

  return sendEmailSafely({
    to: data.toEmail,
    subject: `Welcome to K-Deck Professional Services - Staff Onboarding (${data.role})`,
    html,
  });
}

// 4. FORGOT PASSWORD / RESET EMAIL TEMPLATE
export async function sendPasswordResetEmail(data: {
  toEmail: string;
  name: string;
  resetToken: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetLink = `${appUrl}/admin/login?resetToken=${data.resetToken}&email=${encodeURIComponent(data.toEmail)}`;

  const bodyHtml = `
    <p style="font-size: 16px; margin: 0 0 16px 0; color: #0f172a;">Hello <strong>${data.name}</strong>,</p>
    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 24px 0;">
      We received an authorization request to reset your administrator credentials for the <strong>K-Deck Management Portal</strong>. Click the secure button below to set a new password:
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 700; padding: 14px 32px; border-radius: 10px; font-size: 14px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);">
        Reset Administrator Password &rarr;
      </a>
    </div>

    <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 16px 20px; margin: 24px 0;">
      <p style="margin: 0; font-size: 12px; color: #92400e; line-height: 1.5;">
        <strong>Security Notice:</strong> This authorization link expires in 60 minutes. If you did not initiate this request, you can disregard this email; your existing credentials remain fully protected.
      </p>
    </div>
  `;

  const html = wrapEmailTemplate({
    badgeText: "Security & Credential Recovery",
    badgeBgColor: "#78350f",
    badgeTextColor: "#fef3c7",
    accentColor: "#d97706",
    bodyHtml,
  });

  return sendEmailSafely({
    to: data.toEmail,
    subject: `Password Reset Request - K-Deck Admin Portal`,
    html,
  });
}

// 5. WEBINAR BROADCAST & COUNTDOWN EMAILS (LINK, 1 HOUR, 30 MIN, 15 MIN, LIVE)
export type WebinarNotificationType =
  | "LINK"
  | "1_HOUR"
  | "30_MIN"
  | "15_MIN"
  | "LIVE"
  | "CUSTOM";

export async function sendWebinarBroadcastEmail(data: {
  recipients: string[];
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  webinarLink: string;
  type: WebinarNotificationType;
  customSubject?: string;
  customMessage?: string;
  imageBase64?: string | null;
}) {
  let subject = data.customSubject;
  let urgencyBanner = "";
  let headline = "";
  let badgeText = "Masterclass Communication";
  let badgeBg = "#1e3a8a";
  let badgeColor = "#bfdbfe";
  let accentColor = "#2563eb";

  switch (data.type) {
    case "1_HOUR":
      subject = subject || `[1 Hour To Go] ${data.eventTitle} starts soon!`;
      urgencyBanner = `<div style="background-color: #fef3c7; border: 1px solid #fde68a; color: #92400e; padding: 14px 20px; border-radius: 10px; font-weight: 800; font-size: 14px; text-align: center; margin-bottom: 24px;">⏱️ Starting in 1 Hour — Please Prepare Your Audio &amp; Video!</div>`;
      headline = "We are starting in 60 minutes!";
      badgeText = "1 Hour Countdown";
      badgeBg = "#78350f";
      badgeColor = "#fef3c7";
      accentColor = "#d97706";
      break;
    case "30_MIN":
      subject = subject || `[30 Minutes To Go] Join room for ${data.eventTitle}`;
      urgencyBanner = `<div style="background-color: #ffedd5; border: 1px solid #fed7aa; color: #9a3412; padding: 14px 20px; border-radius: 10px; font-weight: 800; font-size: 14px; text-align: center; margin-bottom: 24px;">⚠️ 30 Minutes To Go — Webinar Access Room Now Open!</div>`;
      headline = "Just 30 minutes until we kick off!";
      badgeText = "30 Min Countdown";
      badgeBg = "#7c2d12";
      badgeColor = "#ffedd5";
      accentColor = "#ea580c";
      break;
    case "15_MIN":
      subject = subject || `[15 Minutes To Go] Final Call: ${data.eventTitle}`;
      urgencyBanner = `<div style="background-color: #fee2e2; border: 1px solid #fecaca; color: #991b1b; padding: 14px 20px; border-radius: 10px; font-weight: 800; font-size: 14px; text-align: center; margin-bottom: 24px;">🚨 15 Minutes Remaining — Join The Waiting Room!</div>`;
      headline = "15 minutes until we go live!";
      badgeText = "15 Min Final Call";
      badgeBg = "#7f1d1d";
      badgeColor = "#fee2e2";
      accentColor = "#dc2626";
      break;
    case "LIVE":
      subject = subject || `🔴 WE ARE NOW LIVE: ${data.eventTitle}`;
      urgencyBanner = `<div style="background-color: #dc2626; color: #ffffff; padding: 16px 22px; border-radius: 10px; font-weight: 900; font-size: 16px; text-align: center; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35);">🔴 WE ARE NOW LIVE — Click Below To Enter Immediately!</div>`;
      headline = "The masterclass has officially begun!";
      badgeText = "Session Live Now";
      badgeBg = "#991b1b";
      badgeColor = "#ffffff";
      accentColor = "#dc2626";
      break;
    case "LINK":
    default:
      subject = subject || `Webinar Link & Access Instructions: ${data.eventTitle}`;
      urgencyBanner = `<div style="background-color: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; padding: 14px 20px; border-radius: 10px; font-weight: 800; font-size: 14px; text-align: center; margin-bottom: 24px;">🎯 Official Webinar Access Link &amp; Joining Instructions</div>`;
      headline = "Here is your verified webinar access link:";
      badgeText = "Official Access Link";
      badgeBg = "#1e3a8a";
      badgeColor = "#bfdbfe";
      accentColor = "#2563eb";
      break;
  }

  const imageTag = data.imageBase64
    ? `<div style="text-align: center; margin: 24px 0;">
         <img src="${data.imageBase64}" alt="${data.eventTitle}" style="max-width: 100%; height: auto; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" />
       </div>`
    : "";

  const customContent = data.customMessage
    ? `<div style="background-color: #f8fafc; border-left: 4px solid ${accentColor}; padding: 16px 20px; margin: 22px 0; font-size: 14px; color: #334155; line-height: 1.6; border-radius: 0 10px 10px 0;">
         ${data.customMessage.replace(/\n/g, "<br />")}
       </div>`
    : "";

  const bodyHtml = `
    ${urgencyBanner}

    <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">${headline}</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 18px 0;">
      This is an official communication regarding your registered masterclass: <strong>${data.eventTitle}</strong>.
    </p>

    ${imageTag}
    ${customContent}

    <!-- Direct CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.webinarLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 800; padding: 14px 32px; border-radius: 10px; font-size: 14px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);">
        Enter Live Webinar Room &rarr;
      </a>
    </div>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin: 22px 0; font-size: 12px; color: #475569;">
      <p style="margin: 0 0 6px 0;"><strong>Webinar URL:</strong> <a href="${data.webinarLink}" style="color: #2563eb; word-break: break-all;">${data.webinarLink}</a></p>
      <p style="margin: 0;"><strong>Scheduled Time:</strong> ${data.eventDate} at ${data.eventTime}</p>
    </div>

    <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin: 24px 0 0 0;">
      Tip: We recommend joining 5–10 minutes early to ensure optimal audio, video, and screen presentation connectivity.
    </p>
  `;

  const html = wrapEmailTemplate({
    badgeText,
    badgeBgColor: badgeBg,
    badgeTextColor: badgeColor,
    accentColor,
    bodyHtml,
  });

  return sendEmailSafely({
    to: data.recipients,
    subject,
    html,
  });
}

/**
 * Sends notification emails upon consultation form submission
 * 1. Alert to Admin/Engagement Partner
 * 2. Acknowledgment to the Client
 */
export async function sendConsultationNotificationEmail(data: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "it.service@kdeckprofessionalservices.com.ng";

  // 1. Send Alert to Admin Desk
  const adminBodyHtml = `
    <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">New Consultation Request Received</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 18px 0;">
      A prospective client has requested a confidential consultation via the homepage portal.
    </p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
        <tr><td style="padding: 6px 0; font-weight: 700; width: 140px; color: #0f172a;">Client Name:</td><td>${data.name}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700; color: #0f172a;">Email Address:</td><td><a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">${data.email}</a></td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700; color: #0f172a;">Phone Number:</td><td><a href="tel:${data.phone}" style="color: #2563eb; text-decoration: none;">${data.phone}</a></td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700; color: #0f172a;">Service Domain:</td><td><strong style="color: #1e40af;">${data.service}</strong></td></tr>
      </table>
    </div>

    <div style="background-color: #ffffff; border-left: 4px solid #2563eb; padding: 16px 20px; margin: 20px 0; font-size: 14px; color: #1e293b; line-height: 1.6; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
      <strong style="display: block; margin-bottom: 6px; color: #0f172a;">Client Inquiry:</strong>
      ${data.message ? data.message.replace(/\n/g, "<br />") : "<em>No additional details provided.</em>"}
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="mailto:${data.email}?subject=Re:%20Consultation%20Inquiry%20-%20K-Deck%20Professional%20Services" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 800; padding: 12px 28px; border-radius: 10px; font-size: 13px;">
        Reply to Client via Email &rarr;
      </a>
    </div>
  `;

  const adminHtml = wrapEmailTemplate({
    badgeText: "Inquiry Alert",
    badgeBgColor: "#1e3a8a",
    badgeTextColor: "#bfdbfe",
    accentColor: "#2563eb",
    bodyHtml: adminBodyHtml,
  });

  // 2. Send Acknowledgment to the Client
  const clientBodyHtml = `
    <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">Thank You for Reaching Out</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 18px 0;">
      Dear <strong>${data.name}</strong>,<br /><br />
      We have received your confidential consultation inquiry regarding our <strong>${data.service}</strong> practice.
    </p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin: 20px 0; font-size: 13px; color: #475569; line-height: 1.6;">
      Our senior engagement partners are reviewing your request and will contact you promptly to discuss your objectives and schedule our introductory session.
    </div>

    <div style="background-color: #f1f5f9; border-radius: 10px; padding: 14px 18px; margin: 18px 0; font-size: 12px; color: #64748b;">
      <strong>Summary of Your Submission:</strong><br />
      Service: ${data.service}<br />
      Contact Phone: ${data.phone}
    </div>

    <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 20px 0 0 0;">
      If your matter is time-critical, you may also reach our client support desk directly at <a href="mailto:it.service@kdeckprofessionalservices.com.ng" style="color: #2563eb;">it.service@kdeckprofessionalservices.com.ng</a>.
    </p>
  `;

  const clientHtml = wrapEmailTemplate({
    badgeText: "Consultation Request Received",
    badgeBgColor: "#064e3b",
    badgeTextColor: "#a7f3d0",
    accentColor: "#059669",
    bodyHtml: clientBodyHtml,
  });

  // Dispatch both in parallel
  await Promise.allSettled([
    sendEmailSafely({
      to: adminEmail,
      subject: `New Consultation Request: ${data.name} (${data.service})`,
      html: adminHtml,
    }),
    sendEmailSafely({
      to: data.email,
      subject: "We Have Received Your Consultation Request — K-DECK Professional Services",
      html: clientHtml,
    }),
  ]);

  return { success: true };
}
