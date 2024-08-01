import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import { EmailTemplate } from "../../emails/email-template";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Feedbacker message | Verification Code",
      react: EmailTemplate({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Verification email sent sucessfully",
    };
  } catch (emailError) {
    console.log("Error sending verification email", emailError);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
