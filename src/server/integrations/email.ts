import { Resend } from "resend";
import { env } from "@/lib/env";
import { retryWithBackoff } from "@/server/utils/retry";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendOutreachEmail(to: string, subject: string, html: string) {
  return retryWithBackoff(async () => {
    return resend.emails.send({
      from: "growth@automata.app",
      to,
      subject,
      html,
    });
  });
}
