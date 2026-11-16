import { useEffect, useState } from 'react';
import {
  Check,
  Inbox,
  Link2,
  RotateCcw,
  Save,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type { ProfileLinks, SkillItem } from '../config/portfolioConfig';
import type { ContactSubmissionRecord } from '../utils/portfolioLogic';
import { clampSkillPercentage } from '../utils/portfolioLogic';

type AdminTab = 'skills' | 'links' | 'inbox';

interface PortfolioAdminModalProps {
  isOpen: boolean;
  initialTab?: AdminTab;
  skills: SkillItem[];
  profileLinks: ProfileLinks;
  onClose: () => void;
  onSaveSkills: (percentages: Record<string, number>) => Promise<void>;
  onResetSkills: () => Promise<void>;
  onSaveLinks: (links: ProfileLinks) => Promise<void>;
}

export function PortfolioAdminModal({
  isOpen,
  initialTab = 'skills',
  skills,
  profileLinks,
  onClose,
  onSaveSkills,
  onResetSkills,
  onSaveLinks,
}: PortfolioAdminModalProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [draftPercentages, setDraftPercentages] = useState<
    Record<string, number>
  >({});
  const [draftLinks, setDraftLinks] = useState<ProfileLinks>(profileLinks);
  const [messages, setMessages] = useState<ContactSubmissionRecord[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setActiveTab(initialTab);
    const nextMap: Record<string, number> = {};
    for (const s of skills) {
      nextMap[s.id] = s.percentage;
    }
    setDraftPercentages(nextMap);
    setDraftLinks(profileLinks);
    setFeedback(null);
  }, [isOpen, initialTab, skills, profileLinks]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || activeTab !== 'inbox') return;
    let cancelled = false;
    setLoadingMessages(true);
    fetch('/api/contact')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFeedback({
            type: 'error',
            text: 'Unable to load contact submissions from server.',
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingMessages(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleSaveSkills = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      await onSaveSkills(draftPercentages);
      setFeedback({
        type: 'success',
        text: 'Skill self-assessment percentages saved.',
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        text:
          err instanceof Error ? err.message : 'Could not save skill estimates.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      await onResetSkills();
      setFeedback({
        type: 'success',
        text: 'Skill estimates restored to initial configuration defaults.',
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'Could not reset skill estimates.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await onSaveLinks(draftLinks);
      setFeedback({
        type: 'success',
        text: 'Contact & social links updated.',
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        text:
          err instanceof Error ? err.message : 'Could not save profile links.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-admin-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl bg-[#0D0D0D] border border-[#D4AF37]/35 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/[0.08]">
          <div>
            <h2
              id="portfolio-admin-title"
              className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white"
            >
              Portfolio Configuration Studio
            </h2>
            <p className="text-xs text-[#A0A0A0] mt-0.5">
              Defaults live in <code className="text-[#F5D77A]">src/config/portfolioConfig.ts</code>; changes saved here persist on the server.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close configuration dialog"
            className="w-10 h-10 rounded-lg border border-white/10 bg-[#141414] flex items-center justify-center text-[#A0A0A0] hover:text-white hover:border-[#D4AF37]/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 bg-[#050505] border-b border-white/[0.08] overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              activeTab === 'skills'
                ? 'gold-gradient-bg text-[#050505] font-semibold'
                : 'bg-[#141414] text-[#A0A0A0] hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Skill Percentages</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('links')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              activeTab === 'links'
                ? 'gold-gradient-bg text-[#050505] font-semibold'
                : 'bg-[#141414] text-[#A0A0A0] hover:text-white'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Social &amp; Email Links</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inbox')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              activeTab === 'inbox'
                ? 'gold-gradient-bg text-[#050505] font-semibold'
                : 'bg-[#141414] text-[#A0A0A0] hover:text-white'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Contact Submissions</span>
          </button>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div
            role="status"
            className={`mx-6 mt-4 px-4 py-3 rounded-lg text-xs font-medium flex items-center gap-2 border ${
              feedback.type === 'success'
                ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#F5D77A]'
                : 'bg-red-950/40 border-red-500/40 text-red-200'
            }`}
          >
            {feedback.type === 'success' && <Check className="w-4 h-4 shrink-0" />}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'skills' && (
            <div className="space-y-4">
              {skills.map((skill) => {
                const value = draftPercentages[skill.id] ?? skill.percentage;
                return (
                  <div
                    key={skill.id}
                    className="p-4 rounded-xl bg-[#141414] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="min-w-0 sm:w-48">
                      <label
                        htmlFor={`skill-range-${skill.id}`}
                        className="block text-sm font-medium text-white"
                      >
                        {skill.name}
                      </label>
                      <span className="text-xs text-[#A0A0A0]">
                        {skill.category}
                      </span>
                    </div>

                    <div className="flex-1 flex items-center gap-4">
                      <input
                        id={`skill-range-${skill.id}`}
                        type="range"
                        min={0}
                        max={100}
                        value={value}
                        onChange={(e) =>
                          setDraftPercentages((prev) => ({
                            ...prev,
                            [skill.id]: clampSkillPercentage(
                              Number(e.target.value)
                            ),
                          }))
                        }
                        className="w-full accent-[#D4AF37] cursor-pointer"
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <input
                          aria-label={`${skill.name} percentage`}
                          type="number"
                          min={0}
                          max={100}
                          value={value}
                          onChange={(e) =>
                            setDraftPercentages((prev) => ({
                              ...prev,
                              [skill.id]: clampSkillPercentage(
                                Number(e.target.value)
                              ),
                            }))
                          }
                          className="w-16 px-2 py-1.5 rounded-lg bg-[#050505] border border-white/15 text-right font-[family-name:var(--font-mono)] tabular-nums text-sm text-[#F5D77A] focus:outline-none focus:border-[#D4AF37]"
                        />
                        <span className="text-xs text-[#A0A0A0]">%</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#141414] border border-white/10 text-xs font-medium text-[#A0A0A0] hover:text-white hover:border-white/25 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveSkills}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg gold-gradient-bg text-[#050505] text-xs font-semibold hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Skill Estimates'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <form onSubmit={handleSaveLinks} className="space-y-5">
              <div>
                <label
                  htmlFor="config-email"
                  className="block text-xs font-medium text-[#A0A0A0] mb-2"
                >
                  Public Contact Email
                </label>
                <input
                  id="config-email"
                  type="email"
                  value={draftLinks.email}
                  onChange={(e) =>
                    setDraftLinks((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-[#141414] border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="config-github"
                  className="block text-xs font-medium text-[#A0A0A0] mb-2"
                >
                  GitHub Profile URL (leave blank until ready)
                </label>
                <input
                  id="config-github"
                  type="url"
                  placeholder="https://github.com/your-username"
                  value={draftLinks.githubUrl}
                  onChange={(e) =>
                    setDraftLinks((prev) => ({
                      ...prev,
                      githubUrl: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-[#141414] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label
                  htmlFor="config-linkedin"
                  className="block text-xs font-medium text-[#A0A0A0] mb-2"
                >
                  LinkedIn Profile URL (leave blank until ready)
                </label>
                <input
                  id="config-linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/your-profile"
                  value={draftLinks.linkedinUrl}
                  onChange={(e) =>
                    setDraftLinks((prev) => ({
                      ...prev,
                      linkedinUrl: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-[#141414] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg gold-gradient-bg text-[#050505] text-xs font-semibold hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Profile Links'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'inbox' && (
            <div>
              {loadingMessages ? (
                <p className="text-sm text-[#A0A0A0] py-8 text-center">
                  Loading persisted contact submissions...
                </p>
              ) : messages.length === 0 ? (
                <div className="py-10 text-center rounded-xl bg-[#141414] border border-white/[0.08] px-6">
                  <p className="text-sm text-white font-medium">
                    No contact messages recorded yet.
                  </p>
                  <p className="text-xs text-[#A0A0A0] mt-1">
                    Messages sent through the Contact form are saved directly on the server and appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 rounded-xl bg-[#141414] border border-white/[0.08]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="text-sm font-semibold text-white">
                          {msg.subject}
                        </span>
                        <span className="font-[family-name:var(--font-mono)] text-xs text-[#F5D77A]">
                          {msg.id}
                        </span>
                      </div>
                      <p className="text-xs text-[#A0A0A0] mb-2">
                        From {msg.name} · {msg.email} ·{' '}
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
