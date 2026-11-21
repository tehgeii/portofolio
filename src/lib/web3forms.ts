/** Sends a contact form message through Web3Forms (https://web3forms.com). */
export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
  subject: string;
}

export async function sendContactMessage(accessKey: string, msg: ContactMessage): Promise<void> {
  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: msg.subject,
      from_name: "Portofolio dafi.",
      name: msg.name,
      email: msg.email,
      message: msg.message,
    }),
    signal: AbortSignal.timeout(15000),
  });
  const json = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;
  if (!res.ok || !json?.success) throw new Error(json?.message || `Web3Forms ${res.status}`);
}
