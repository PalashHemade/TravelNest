import { NextResponse } from "next/server";
import { z } from "zod";
import { transporter } from "@/lib/mailer";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;
    const owner = process.env.GMAIL_USER!;

    // ── Email to you (the owner) ──────────────────────────────────────
    await transporter.sendMail({
      from: `"TravelNest Contact" <${owner}>`,
      to: owner,
      replyTo: email,
      subject: `[TravelNest] ${subject}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden;">
          <div style="background: #111; padding: 28px 32px;">
            <h1 style="color: #fff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">🌍 TravelNest</h1>
            <p style="color: #888; margin: 4px 0 0; font-size: 13px;">New contact form submission</p>
          </div>
          <div style="padding: 32px; background: #fff;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; width: 100px;">From</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 600; color: #111;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #111;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Subject</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 600; color: #111;">${subject}</td>
              </tr>
            </table>
            <div style="margin-top: 24px;">
              <p style="color: #888; font-size: 13px; margin-bottom: 8px;">Message</p>
              <div style="background: #f9f9f9; border-left: 3px solid #111; padding: 16px 20px; border-radius: 0 8px 8px 0; color: #333; line-height: 1.7; white-space: pre-wrap;">${message}</div>
            </div>
            <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 14px;">Reply to ${name}</a>
            </div>
          </div>
          <div style="padding: 16px 32px; background: #f9f9f9; text-align: center; color: #aaa; font-size: 12px;">
            Sent via TravelNest contact form
          </div>
        </div>
      `,
    });

    // ── Auto-reply to the sender ──────────────────────────────────────
    await transporter.sendMail({
      from: `"TravelNest" <${owner}>`,
      to: email,
      subject: `We received your message — TravelNest`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden;">
          <div style="background: #111; padding: 28px 32px;">
            <h1 style="color: #fff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">🌍 TravelNest</h1>
          </div>
          <div style="padding: 32px; background: #fff;">
            <h2 style="color: #111; font-size: 20px; margin: 0 0 12px;">Hi ${name}, we got your message!</h2>
            <p style="color: #555; line-height: 1.7; margin: 0 0 20px;">
              Thanks for reaching out. We've received your message about <strong>"${subject}"</strong> and will get back to you within 24 hours.
            </p>
            <div style="background: #f9f9f9; border-left: 3px solid #ddd; padding: 16px 20px; border-radius: 0 8px 8px 0; color: #666; font-size: 14px; line-height: 1.7; white-space: pre-wrap; margin-bottom: 28px;">${message}</div>
            <p style="color: #555; line-height: 1.7; margin: 0;">
              In the meantime, feel free to browse our <a href="${process.env.NEXT_PUBLIC_APP_URL}/packages" style="color: #2563eb;">travel packages</a> or call us at <strong>+91 96658 45166</strong>.
            </p>
          </div>
          <div style="padding: 24px 32px; background: #111; color: #888; font-size: 13px; line-height: 1.8;">
            <p style="margin: 0; color: #fff; font-weight: 600;">TravelNest</p>
            <p style="margin: 4px 0 0;">📍 E-702, Sun Universe, Narhe, Pune 411041</p>
            <p style="margin: 2px 0 0;">📞 +91 96658 45166</p>
            <p style="margin: 2px 0 0;">✉️ ${owner}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Contact email error:", error);
    return NextResponse.json(
      { message: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
