import { ShieldCheck } from "lucide-react";
import type { Certificate } from "../../data/certificates";
import { useLanguage } from "../../i18n/language";
import { ImageLightbox } from "../ui/ImageLightbox";

/** Full-screen view of an award's watermarked certificate preview. */
export function CertificatePreview({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  const { t, l } = useLanguage();
  if (!cert.preview) return null;
  const { src, width, height } = cert.preview;

  return (
    <ImageLightbox
      images={[{ src, width, height, alt: `${t.certificates.viewCertificate}: ${l(cert.name)}` }]}
      index={0}
      onClose={onClose}
      title={l(cert.name)}
      subtitle={cert.issuer}
      footer={
        <p className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" aria-hidden />
          {t.certificates.previewNote}
        </p>
      }
    />
  );
}
