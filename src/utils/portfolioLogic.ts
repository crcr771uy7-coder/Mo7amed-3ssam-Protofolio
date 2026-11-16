import type {
  ProfileLinks,
  ProjectCategory,
  ProjectItem,
  SkillCategory,
  SkillItem,
} from '../config/portfolioConfig';

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactValidationErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface ContactValidationResult {
  isValid: boolean;
  errors: ContactValidationErrors;
  sanitized: ContactFormInput;
}

export interface ContactSubmissionRecord extends ContactFormInput {
  id: string;
  createdAt: string;
}

export function clampSkillPercentage(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function updateSkillPercentage(
  skills: SkillItem[],
  skillId: string,
  nextPercentage: number
): SkillItem[] {
  const clamped = clampSkillPercentage(nextPercentage);
  return skills.map((skill) =>
    skill.id === skillId ? { ...skill, percentage: clamped } : skill
  );
}

export function filterSkillsByCategory(
  skills: SkillItem[],
  category: SkillCategory | 'All'
): SkillItem[] {
  if (category === 'All') {
    return skills;
  }
  return skills.filter((skill) => skill.category === category);
}

export function calculateAverageByCategory(
  skills: SkillItem[],
  category: SkillCategory | 'All'
): number {
  const filtered = filterSkillsByCategory(skills, category);
  if (filtered.length === 0) {
    return 0;
  }
  const total = filtered.reduce((acc, item) => acc + item.percentage, 0);
  return Math.round(total / filtered.length);
}

export function filterProjectsByCategory(
  projects: ProjectItem[],
  category: ProjectCategory | 'All'
): ProjectItem[] {
  if (category === 'All') {
    return projects;
  }
  return projects.filter((project) => project.category === category);
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContactForm(
  input: ContactFormInput
): ContactValidationResult {
  const sanitized: ContactFormInput = {
    name: input.name.trim(),
    email: input.email.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
  };

  const errors: ContactValidationErrors = {};

  if (sanitized.name.length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  } else if (sanitized.name.length > 100) {
    errors.name = 'Name must be 100 characters or fewer.';
  }

  if (!sanitized.email) {
    errors.email = 'Please enter your email address.';
  } else if (!EMAIL_PATTERN.test(sanitized.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (sanitized.subject.length < 3) {
    errors.subject = 'Please enter a subject (at least 3 characters).';
  } else if (sanitized.subject.length > 150) {
    errors.subject = 'Subject must be 150 characters or fewer.';
  }

  if (sanitized.message.length < 10) {
    errors.message = 'Please write a message of at least 10 characters.';
  } else if (sanitized.message.length > 3000) {
    errors.message = 'Message must be 3,000 characters or fewer.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}

export function normalizeSafeUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return '';
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return '';
  } catch {
    return '';
  }
}

export function sanitizeProfileLinks(
  links: Partial<ProfileLinks>,
  fallback: ProfileLinks
): ProfileLinks {
  const emailCandidate = (links.email ?? fallback.email).trim();
  const validEmail = EMAIL_PATTERN.test(emailCandidate)
    ? emailCandidate
    : fallback.email;

  return {
    email: validEmail,
    githubUrl: normalizeSafeUrl(links.githubUrl ?? fallback.githubUrl),
    linkedinUrl: normalizeSafeUrl(links.linkedinUrl ?? fallback.linkedinUrl),
  };
}
