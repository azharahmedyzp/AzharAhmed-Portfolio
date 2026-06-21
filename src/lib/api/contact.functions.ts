import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80, "Name is too long"),
  email: z.string().trim().email("Enter a valid email").max(160, "Email is too long"),
  subject: z.string().trim().min(3, "Subject is too short").max(120, "Keep it under 120 chars"),
  message: z.string().trim().min(10, "Tell me a bit more (10+ chars)").max(1200, "Message is too long"),
});

type ContactFormData = z.infer<typeof schema>;

export const sendContactEmail = createServerFn({ method: "POST" })
  .inputValidator(schema)
  .handler(async ({ data }) => {
    const { name, email, subject, message } = data;

    // Get the API key from environment
    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL || "azharahmedyzp@gmail.com";

    if (!resendApiKey) {
      throw new Error("Email service not configured. Please add RESEND_API_KEY to environment variables.");
    }

    try {
      // Send email using Resend API
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev", // Use Resend's default sender or your verified domain
          to: toEmail,
          replyTo: email,
          subject: `Portfolio Contact: ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
            <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
          `,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Resend API error:", error);
        throw new Error("Failed to send email. Please try again later.");
      }

      const result = await response.json();
      return {
        success: true,
        message: "Email sent successfully!",
        id: result.id,
      };
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to send email. Please try again later.",
      );
    }
  });

// Helper function to escape HTML
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}
