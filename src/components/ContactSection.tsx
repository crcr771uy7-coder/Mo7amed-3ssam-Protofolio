import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  FolderGit2,
  Inbox,
  Linkedin,
  Mail,
  Send,
} from 'lucide-react';
import type { ProfileLinks } from '../config/portfolioConfig';
import {
  type ContactFormInput,
  type ContactSubmissionRecord,
  type ContactValidationErrors,
  validateContactForm,
} from '../utils/portfolioLogic';

interface ContactSectionProps {
  profileLinks: ProfileLinks;
  prefilledSubject?: string;
  onOpenLinksConfig: () => void;
  onOpenInbox: () => void;
}

export function ContactSection({
  profileLinks,
  prefilledSubject = '',
  onOpenLinksConfig,
  onOpenInbox,
}: ContactSectionProps) {
  const [form, setForm] = useState<ContactFormInput>({
    name: '',
    email: '',
    subject: prefilledSubject,
    message: '',
  });
  const [fieldErrors, setFieldErrors] = useState<ContactValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ContactSubmissionRecord | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (prefilledSubject) {
      setForm((prev) => ({ ...prev, subject: prefilledSubject }));
      setReceipt(null);
      setSubmitError(null);
    }
  }, [prefilledSubject]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profileLinks.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fallback ignored if clipboard permissions are restricted
    }
  };

  const handleChange = (field: keyof ContactFormInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setReceipt(null);

    const validation = validateContactForm(form);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.sanitized),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        throw new Error(
          data.error || 'Could not submit your inquiry. Please try again.'
        );
      }

      setReceipt(data.submission as ContactSubmissionRecord);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Network error while submitting your message.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 sm:py-28 bg-[#050505] border-t border-white/[0.06]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Headline & Direct Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-[#D4AF37] uppercase mb-3">
                Get In Touch
              </p>
              <h2
                style={{ textWrap: 'balance' }}
                className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4"
              >
                Have an Idea? Let&apos;s Build Something Great.
              </h2>
              <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed">
                Whether you want to collaborate on a web project, share feedback,
                or discuss programming and AI ideas, send a message directly
                below.
              </p>
            </div>

            <div className="space-y-4">
              {/* Email Card */}
              <div className="luxury-card rounded-xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#0D0D0D] border border-[#D4AF37]/30 flex items-center justify-center text-[#F5D77A] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#A0A0A0]">Email</p>
                    <a
                      href={`mailto:${profileLinks.email}`}
                      className="text-sm font-medium text-white hover:text-[#F5D77A] transition-colors truncate block"
                    >
                      {profileLinks.email}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0D0D0D] border border-white/10 text-xs font-medium text-[#A0A0A0] hover:text-white hover:border-[#D4AF37]/40 transition-colors shrink-0 cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#F5D77A]" />
                      <span className="text-[#F5D77A]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* GitHub Card */}
              <div className="luxury-card rounded-xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#0D0D0D] border border-[#D4AF37]/30 flex items-center justify-center text-[#F5D77A] shrink-0">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#A0A0A0]">GitHub</p>
                    {profileLinks.githubUrl ? (
                      <a
                        href={profileLinks.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-white hover:text-[#F5D77A] transition-colors truncate block"
                      >
                        {profileLinks.githubUrl}
                      </a>
                    ) : (
                      <p className="text-sm text-white/70">
                        Profile link not yet configured
                      </p>
                    )}
                  </div>
                </div>

                {profileLinks.githubUrl ? (
                  <a
                    href={profileLinks.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open GitHub profile"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0D0D0D] border border-white/10 text-xs font-medium text-[#F5D77A] hover:border-[#D4AF37]/50 transition-colors shrink-0"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenLinksConfig}
                    className="px-3 py-2 rounded-lg bg-[#0D0D0D] border border-white/10 text-xs font-medium text-[#A0A0A0] hover:text-[#F5D77A] hover:border-[#D4AF37]/40 transition-colors shrink-0 cursor-pointer"
                  >
                    Add URL
                  </button>
                )}
              </div>

              {/* LinkedIn Card */}
              <div className="luxury-card rounded-xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#0D0D0D] border border-[#D4AF37]/30 flex items-center justify-center text-[#F5D77A] shrink-0">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#A0A0A0]">LinkedIn</p>
                    {profileLinks.linkedinUrl ? (
                      <a
                        href={profileLinks.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-white hover:text-[#F5D77A] transition-colors truncate block"
                      >
                        {profileLinks.linkedinUrl}
                      </a>
                    ) : (
                      <p className="text-sm text-white/70">
                        Profile link not yet configured
                      </p>
                    )}
                  </div>
                </div>

                {profileLinks.linkedinUrl ? (
                  <a
                    href={profileLinks.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open LinkedIn profile"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0D0D0D] border border-white/10 text-xs font-medium text-[#F5D77A] hover:border-[#D4AF37]/50 transition-colors shrink-0"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenLinksConfig}
                    className="px-3 py-2 rounded-lg bg-[#0D0D0D] border border-white/10 text-xs font-medium text-[#A0A0A0] hover:text-[#F5D77A] hover:border-[#D4AF37]/40 transition-colors shrink-0 cursor-pointer"
                  >
                    Add URL
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onOpenInbox}
                className="inline-flex items-center gap-2 text-xs text-[#A0A0A0] hover:text-[#F5D77A] transition-colors pt-1 cursor-pointer"
              >
                <Inbox className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>View persisted contact submissions</span>
              </button>
            </div>
          </div>

          {/* Right Column: Validated Contact Form */}
          <div className="lg:col-span-7">
            <form
              noValidate
              onSubmit={handleSubmit}
              className="rounded-2xl bg-[#141414] border border-white/[0.08] p-6 sm:p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-medium text-[#A0A0A0] mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Your full name"
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={
                      fieldErrors.name ? 'contact-name-error' : undefined
                    }
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#0D0D0D] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                  />
                  {fieldErrors.name && (
                    <p
                      id="contact-name-error"
                      className="mt-1.5 text-xs text-red-400"
                    >
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-medium text-[#A0A0A0] mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email ? 'contact-email-error' : undefined
                    }
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#0D0D0D] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                  />
                  {fieldErrors.email && (
                    <p
                      id="contact-email-error"
                      className="mt-1.5 text-xs text-red-400"
                    >
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-medium text-[#A0A0A0] mb-2"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  placeholder="Project idea, collaboration, or question"
                  aria-invalid={Boolean(fieldErrors.subject)}
                  aria-describedby={
                    fieldErrors.subject ? 'contact-subject-error' : undefined
                  }
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#0D0D0D] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
                {fieldErrors.subject && (
                  <p
                    id="contact-subject-error"
                    className="mt-1.5 text-xs text-red-400"
                  >
                    {fieldErrors.subject}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-medium text-[#A0A0A0] mb-2"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Tell me about your idea or how we can work together..."
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={
                    fieldErrors.message ? 'contact-message-error' : undefined
                  }
                  className="w-full px-4 py-3 rounded-lg bg-[#0D0D0D] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] resize-y"
                />
                {fieldErrors.message && (
                  <p
                    id="contact-message-error"
                    className="mt-1.5 text-xs text-red-400"
                  >
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              {submitError && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-sm text-red-200"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Message could not be recorded</p>
                    <p className="text-xs text-red-200/80 mt-0.5">
                      {submitError}
                    </p>
                  </div>
                </div>
              )}

              {receipt && (
                <div
                  role="status"
                  className="p-4 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/45 flex items-start gap-3 text-sm text-white"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#F5D77A] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#F5D77A]">
                      Message saved to portfolio inbox ({receipt.id})
                    </p>
                    <p className="text-xs text-white/80 mt-1">
                      Recorded on {new Date(receipt.createdAt).toLocaleString()} for{' '}
                      {receipt.name}.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[46px] px-7 py-3 rounded-lg gold-gradient-bg text-[#050505] text-sm font-semibold hover:brightness-110 transition-all duration-200 cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D77A]"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
