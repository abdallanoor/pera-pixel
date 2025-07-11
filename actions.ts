"use server";

import { z } from "zod";

// Form validation schema
const contactSchema = z.object({
  name: z.string(),
  email: z.string().email("Please enter a valid email address"),
  message: z.string()
});

export async function submitContactForm(
  prevState: unknown,
  formData: FormData
) {
  try {
    const rawName = formData.get("name");
    const rawEmail = formData.get("email");
    const rawMessage = formData.get("message");

    const validatedFields = contactSchema.safeParse({
      name: rawName,
      email: rawEmail,
      message: rawMessage,
    });

    if (!validatedFields.success) {
      console.log("Validation failed:", validatedFields.error);
      return {
        success: false,
        message: "Please check your form inputs and try again.",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, email, message } = validatedFields.data;
    console.log("Validated data:", { name, email, message });

    if (process.env.RESEND_API_KEY) {
      await sendEmailWithResend(name, email, message);
    } else {
      return {
        success: false,
        message:
          "Email service not configured. Please contact the administrator.",
      };
    }
    return {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : "Something went wrong. Please try again later."}`,
    };
  }
}

// Using Resend
async function sendEmailWithResend(
  name: string,
  email: string,
  message: string
) {
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: "Contact Form <noreply@perapixel.com>", // Default domain for Resend
      to: [process.env.EMAIL_USER || ""],
      subject: "New Contact Form Submission",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px;">
              <h2 style="color: #2c3e50; text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
              New Contact Form Submission
              </h2>
              <div style="padding: 10px 0;">
                <p style="margin: 10px 0;">
                  <strong>Name:</strong> ${name}
                </p>
                <p style="margin: 10px 0;">
                  <strong>Email:</strong> ${email}
                </p>
                <p style="margin: 10px 0;">
                  <strong>Message:</strong>
                </p>
                <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #3498db; border-radius: 6px;">
                  ${message}
                </div>
              </div>
              <p style="color: #999; font-size: 13px; text-align: center; margin-top: 20px;">
                This message was sent from your website's contact form.
              </p>
            </div>
      `,
    });

    console.log("Resend result:", result);
  } catch (error) {
    console.error("Resend error:", error);
    throw error;
  }
}
