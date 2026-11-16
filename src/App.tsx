import { useEffect, useState } from 'react';
import {
  PORTFOLIO_CONFIG,
  type ProfileLinks,
  type ProjectItem,
  type SkillItem,
} from './config/portfolioConfig';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ProjectModal } from './components/ProjectModal';
import { JourneyEducationSection } from './components/JourneyEducationSection';
import { LoveBuildingSection } from './components/LoveBuildingSection';
import { ContactSection } from './components/ContactSection';
import { PortfolioAdminModal } from './components/PortfolioAdminModal';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'journey', 'contact'];

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [skills, setSkills] = useState<SkillItem[]>(
    PORTFOLIO_CONFIG.initialSkills
  );
  const [profileLinks, setProfileLinks] = useState<ProfileLinks>(
    PORTFOLIO_CONFIG.defaultProfileLinks
  );
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );
  const [adminModal, setAdminModal] = useState<{
    open: boolean;
    tab: 'skills' | 'links' | 'inbox';
  }>({ open: false, tab: 'skills' });
  const [prefilledSubject, setPrefilledSubject] = useState('');

  // Load persisted skills & profile links from backend
  useEffect(() => {
    let cancelled = false;
    fetch('/api/portfolio-state')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          if (Array.isArray(data.skills)) {
            setSkills(data.skills);
          }
          if (data.profileLinks) {
            setProfileLinks(data.profileLinks);
          }
        }
      })
      .catch(() => {
        // Keep central config defaults if offline
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Track active navigation section via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const handleNavigate = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  const handleSaveSkills = async (percentages: Record<string, number>) => {
    const res = await fetch('/api/skills', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ percentages }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to save skills.');
    }
    if (Array.isArray(data.skills)) {
      setSkills(data.skills);
    }
  };

  const handleResetSkills = async () => {
    const res = await fetch('/api/skills/reset', { method: 'POST' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to reset skills.');
    }
    if (Array.isArray(data.skills)) {
      setSkills(data.skills);
    }
  };

  const handleSaveLinks = async (links: ProfileLinks) => {
    const res = await fetch('/api/profile-links', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(links),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to save profile links.');
    }
    if (data.profileLinks) {
      setProfileLinks(data.profileLinks);
    }
  };

  const handleContactAboutProject = (projectTitle: string) => {
    setSelectedProject(null);
    setPrefilledSubject(`Inquiry about ${projectTitle}`);
    handleNavigate('contact');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      <main>
        <HeroSection onNavigate={handleNavigate} />
        <AboutSection />
        <SkillsSection
          skills={skills}
          onOpenEditor={() => setAdminModal({ open: true, tab: 'skills' })}
        />
        <ProjectsSection onSelectProject={setSelectedProject} />
        <JourneyEducationSection />
        <LoveBuildingSection />
        <ContactSection
          profileLinks={profileLinks}
          prefilledSubject={prefilledSubject}
          onOpenLinksConfig={() => setAdminModal({ open: true, tab: 'links' })}
          onOpenInbox={() => setAdminModal({ open: true, tab: 'inbox' })}
        />
      </main>

      <Footer onNavigate={handleNavigate} />
      <BackToTop />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onContactAboutProject={handleContactAboutProject}
      />

      <PortfolioAdminModal
        isOpen={adminModal.open}
        initialTab={adminModal.tab}
        skills={skills}
        profileLinks={profileLinks}
        onClose={() => setAdminModal((prev) => ({ ...prev, open: false }))}
        onSaveSkills={handleSaveSkills}
        onResetSkills={handleResetSkills}
        onSaveLinks={handleSaveLinks}
      />
    </div>
  );
}
