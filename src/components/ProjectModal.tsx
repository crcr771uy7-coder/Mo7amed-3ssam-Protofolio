import { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, FolderGit2, Layers, X } from 'lucide-react';
import type { ProjectItem } from '../config/portfolioConfig';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onContactAboutProject: (projectTitle: string) => void;
}

export function ProjectModal({
  project,
  onClose,
  onContactAboutProject,
}: ProjectModalProps) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
    >
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0D0D0D] border border-[#D4AF37]/35 shadow-2xl">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
            <span className="font-[family-name:var(--font-mono)]">
              PROJECT {project.index}
            </span>
            <span aria-hidden="true">·</span>
            <span>{project.category}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${project.title} details`}
            className="w-10 h-10 rounded-lg border border-white/10 bg-[#141414] flex items-center justify-center text-[#A0A0A0] hover:text-white hover:border-[#D4AF37]/45 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Showcase */}
        <div className="p-6 sm:p-8 space-y-8">
          <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#050505]">
            <div className="aspect-[16/10] w-full overflow-hidden">
              {!imgFailed ? (
                <img
                  src={project.thumbnail}
                  alt={project.thumbnailAlt}
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#141414] text-[#A0A0A0]">
                  <Layers className="w-10 h-10 text-[#D4AF37]" />
                  <span>{project.title}</span>
                </div>
              )}
            </div>
          </div>

          {/* Copy & Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <h2
                id="project-modal-title"
                className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold text-white"
              >
                {project.title}
              </h2>
              <p className="text-base leading-relaxed text-[#A0A0A0]">
                {project.description}
              </p>

              <div className="pt-2">
                <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#D4AF37] mb-3">
                  Key Focus Areas
                </h3>
                <ul className="space-y-2.5">
                  {project.highlights.map((highlight, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-white/90"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5 rounded-xl bg-[#141414] border border-white/[0.08] p-6 self-start">
              <div>
                <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#A0A0A0] mb-2">
                  Category
                </h3>
                <p className="text-sm font-medium text-white">
                  {project.category}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#A0A0A0] mb-2">
                  Technologies &amp; Craft
                </h3>
                <p className="text-sm text-[#F5D77A] leading-relaxed">
                  {project.tags.join(' · ')}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2.5 rounded-lg gold-gradient-bg text-[#050505] text-sm font-semibold hover:brightness-110 transition-all"
                  >
                    <span>Open Live Project</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2.5 rounded-lg bg-[#0D0D0D] border border-white/15 text-sm font-medium text-white hover:border-[#D4AF37]/50"
                  >
                    <FolderGit2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>View Repository</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => onContactAboutProject(project.title)}
                  className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2.5 rounded-lg bg-[#0D0D0D] border border-[#D4AF37]/40 text-sm font-medium text-[#F5D77A] hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
                >
                  Ask Mohammed About This Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
