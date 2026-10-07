import { useCallback, useState } from "react";
import { useToast } from "../context/toast";
import { profile } from "../data/profile";
import { useLanguage } from "../i18n/language";
import { copyText } from "../lib/clipboard";

/** Copies the contact email and confirms with a toast. */
export function useCopyEmail() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    const ok = await copyText(profile.email);
    toast(ok ? t.contact.copied : t.contact.copyFailed, ok ? "success" : "error");
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }, [toast, t]);

  return { copy, copied };
}
