import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, FolderGit2, Layers } from 'lucide-react';
import {
  PORTFOLIO_CONFIG,
  type ProjectCategory,
  type ProjectItem,
} from '../config/portfolioConfig';
import { filterProjectsByCategory } from '../utils/portfolioLogic';

const PROJECT_CATEGORIES: Array<ProjectCategory | 'All'> = [
  'All',
  'Educational Website',
  'Web Development',
  'Game Development',
  'Creative Web Development',
  'Creative Technology',
];

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  featured?: boolean;
  onSelect: (project: ProjectItem) => void;
}

function ProjectCard({
  project,
  index,
  featured = false,
  onSelect,
}: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.06, 0.25),
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`luxury-card rounded-2xl overflow-hidden flex flex-col ${
        featured ? 'lg:col-span-2 lg:grid lg:grid-cols-12' : ''
      }`}
    >
      {/* Mockup Thumbnail Presentation */}
      <div
        className={`relative bg-[#0D0D0D] p-3 sm:p-4 ${
          featured ? 'lg:col-span-7 flex flex-col justify-center' : ''
        }`}
      >
        <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#050505]">
          {/* Browser Chrome Header */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-[#111111] border-b border-white/[0.06]">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-2 h-2 rounded-full bg-white/20" />
              <span className="w-2 h-2 rounded-full bg-white/20" />
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]/60" />
            </div>
            <span className="font-[family-name:var(--font-mono)] text-[11px] text-[#A0A0A0] truncate max-w-[180px]">
              Project {project.index}
            </span>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden bg-[#0A0A0A]">
            {!imgFailed ? (
              <img
                src={project.thumbnail}
                alt={project.thumbnailAlt}
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#141414] to-[#050505] p-6 text-center">
                <Layers className="w-8 h-8 text-[#D4AF37]" />
                <span className="font-[family-name:var(--font-display)] text-xl text-white">
                  {project.title}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div
        className={`p-6 sm:p-7 flex flex-col justify-between gap-6 ${
          featured ? 'lg:col-span-5' : 'flex-1'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 text-xs text-[#D4AF37] mb-2">
            <span className="font-[family-name:var(--font-mono)] tabular-nums">
              {project.index}
            </span>
            <span aria-hidden="true">·</span>
            <span>{project.category}</span>
          </div>

          <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold text-white mb-3">
            {project.title}
          </h3>

          <p className="text-sm sm:text-base leading-relaxed text-[#A0A0A0] mb-5">
            {project.description}
          </p>

          {/* Clean unboxed technology tags with typographic separators */}
          <p className="text-xs text-white/75 leading-relaxed">
            {project.tags.join(' · ')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={() => onSelect(project)}
            className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2 rounded-lg gold-gradient-bg text-[#050505] text-xs sm:text-sm font-semibold hover:brightness-110 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D77A]"
          >
            <span>View Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 rounded-lg bg-[#0D0D0D] border border-white/15 text-xs sm:text-sm font-medium text-white hover:border-[#D4AF37]/50 hover:text-[#F5D77A] transition-colors"
            >
              <FolderGit2 className="w-4 h-4 text-[#D4AF37]" />
              <span>GitHub</span>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

interface ProjectsSectionProps {
  onSelectProject: (project: ProjectItem) => void;
}

export function ProjectsSection({ onSelectProject }: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    ProjectCategory | 'All'
  >('All');

  const projects = filterProjectsByCategory(
    PORTFOLIO_CONFIG.projects,
    selectedCategory
  );

  return (
    <section
      id="projects"
      className="py-24 sm:py-28 bg-[#0D0D0D] border-t border-white/[0.06]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-[#D4AF37] uppercase mb-3">
              Featured Work
            </p>
            <h2
              style={{ textWrap: 'balance' }}
              className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-3"
            >
              Selected Projects
            </h2>
            <p className="text-sm sm:text-base text-[#A0A0A0] max-w-2xl">
              A curated collection of educational platforms, hospitality web
              design, interactive game development, and digital storytelling.
            </p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="flex flex-wrap items-center gap-2 mb-10"
        >
          {PROJECT_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(category)}
                className={`min-h-[40px] px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                  active
                    ? 'gold-gradient-bg text-[#050505] font-semibold'
                    : 'bg-[#141414] text-[#A0A0A0] border border-white/[0.08] hover:text-white hover:border-[#D4AF37]/35'
                }`}
              >
                {category === 'All' ? 'All Projects' : category}
              </button>
            );
          })}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              featured={selectedCategory === 'All' && index === 0}
              onSelect={onSelectProject}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
