export type SkillCategory =
  | 'Programming'
  | 'Web Development'
  | 'Tools'
  | 'Other Skills';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  /** Editable self-assessment estimate (0-100), not a verified professional assessment. */
  percentage: number;
  iconKey:
    | 'code'
    | 'terminal'
    | 'globe'
    | 'palette'
    | 'smartphone'
    | 'atom'
    | 'git'
    | 'editor'
    | 'sparkles'
    | 'layout'
    | 'brain'
    | 'puzzle';
}

export type ProjectCategory =
  | 'Educational Website'
  | 'Web Development'
  | 'Game Development'
  | 'Creative Web Development'
  | 'Creative Technology';

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  category: ProjectCategory;
  description: string;
  highlights: string[];
  tags: string[];
  thumbnail: string;
  thumbnailAlt: string;
  /** Add a live URL when deployed. Leave empty if offline/local. */
  liveUrl?: string;
  /** Add a GitHub repository URL if a public repository exists. */
  githubUrl?: string;
}

export interface JourneyMilestone {
  id: string;
  title: string;
  description: string;
}

export interface BuildingInterest {
  id: string;
  title: string;
  description: string;
  iconKey: 'globe' | 'book' | 'mouse' | 'sparkles' | 'terminal' | 'brain';
}

export interface ProfileLinks {
  email: string;
  githubUrl: string;
  linkedinUrl: string;
}

export const PORTFOLIO_CONFIG = {
  brand: {
    name: 'Mohammed Elfeky',
    wordmark: 'MOHAMMED ELFEKY',
    location: 'Egypt',
    signature: 'CODE. CREATE. INNOVATE.',
    footerCredit: 'Designed & Developed by Mohammed Elfeky.',
    statusIndicator: 'Always Learning. Always Building.',
    portraitPath: '/assets/aistudio/FB_IMG_1788814073465_4401606c.jpg',
    portraitAlt: 'Mohammed Elfeky standing outdoors at dusk in Egypt',
  },
  hero: {
    roles: [
      'Aspiring Software Developer',
      'Python Developer',
      'Web Developer',
      'Technology Enthusiast',
      'AI Explorer',
    ],
    typingTitles: [
      'Python Developer',
      'Web Developer',
      'Creative Developer',
      'AI Enthusiast',
      'Technology Explorer',
    ],
    headline: 'Building Digital Experiences That Make Ideas Real.',
    subtitle:
      "I'm Mohammed Elfeky, a passionate developer exploring the world of programming, web development, and artificial intelligence. I love transforming creative ideas into functional digital products.",
  },
  about: {
    title: 'Who Am I?',
    paragraphs: [
      "I'm Mohammed Elfeky, a student at WE Applied Technology School in Egypt with a strong passion for programming, technology, and digital innovation.",
      'I enjoy learning new technologies, experimenting with ideas, and creating websites and applications that combine functionality with beautiful design.',
      'My journey is about continuous learning, creative problem-solving, and turning ideas into real projects.',
    ],
    pillars: [
      {
        id: 'programming',
        title: 'Programming',
        description:
          'Building structured problem-solving habits with Python and JavaScript fundamentals.',
        iconKey: 'terminal' as const,
      },
      {
        id: 'web-development',
        title: 'Web Development',
        description:
          'Crafting responsive interfaces with semantic HTML5, modern CSS3, and component-driven React.',
        iconKey: 'globe' as const,
      },
      {
        id: 'artificial-intelligence',
        title: 'Artificial Intelligence',
        description:
          'Exploring AI workflows, prompt engineering, and modern developer tooling such as Google AI Studio.',
        iconKey: 'brain' as const,
      },
      {
        id: 'creative-projects',
        title: 'Creative Projects',
        description:
          'Combining visual storytelling, interactive motion, and clean user experience across personal builds.',
        iconKey: 'layers' as const,
      },
    ],
  },
  /**
   * Central editable self-assessment skill estimates.
   * These values represent personal learning progress, not verified professional ratings.
   */
  initialSkills: [
    {
      id: 'python',
      name: 'Python',
      category: 'Programming',
      percentage: 55,
      iconKey: 'terminal',
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      category: 'Programming',
      percentage: 40,
      iconKey: 'code',
    },
    {
      id: 'html5',
      name: 'HTML5',
      category: 'Web Development',
      percentage: 75,
      iconKey: 'globe',
    },
    {
      id: 'css3',
      name: 'CSS3',
      category: 'Web Development',
      percentage: 70,
      iconKey: 'palette',
    },
    {
      id: 'responsive-design',
      name: 'Responsive Design',
      category: 'Web Development',
      percentage: 65,
      iconKey: 'smartphone',
    },
    {
      id: 'react',
      name: 'React',
      category: 'Web Development',
      percentage: 25,
      iconKey: 'atom',
    },
    {
      id: 'git-github',
      name: 'Git & GitHub',
      category: 'Tools',
      percentage: 35,
      iconKey: 'git',
    },
    {
      id: 'vscode',
      name: 'Visual Studio Code',
      category: 'Tools',
      percentage: 75,
      iconKey: 'editor',
    },
    {
      id: 'google-ai-studio',
      name: 'Google AI Studio',
      category: 'Tools',
      percentage: 65,
      iconKey: 'sparkles',
    },
    {
      id: 'ui-ux-design',
      name: 'UI/UX Design',
      category: 'Other Skills',
      percentage: 55,
      iconKey: 'layout',
    },
    {
      id: 'ai-tools',
      name: 'Artificial Intelligence Tools',
      category: 'Other Skills',
      percentage: 60,
      iconKey: 'brain',
    },
    {
      id: 'problem-solving',
      name: 'Problem Solving',
      category: 'Other Skills',
      percentage: 65,
      iconKey: 'puzzle',
    },
  ] satisfies SkillItem[],
  /**
   * Add new projects to this array to automatically display them in the Projects Gallery.
   */
  projects: [
    {
      id: 'mathtopia',
      index: '01',
      title: 'MathTopia',
      category: 'Educational Website',
      description:
        'An educational mathematics platform designed to help students learn mathematics through structured lessons, explanations, and educational content.',
      highlights: [
        'Structured topic organization for step-by-step mathematics study',
        'Clear lesson layouts focused on readability and student comprehension',
        'Responsive structure adapted for desktop and mobile learners',
      ],
      tags: ['HTML5', 'CSS3', 'Responsive Design', 'UI/UX Design'],
      thumbnail: '/src/assets/images/project_mathtopia_1794850743429.jpg',
      thumbnailAlt: 'MathTopia dark educational mathematics interface showcase',
    },
    {
      id: 'restaurant-website',
      index: '02',
      title: 'Restaurant Website',
      category: 'Web Development',
      description:
        "A website I developed for a restaurant, focusing on presenting the restaurant's identity, menu, and customer experience through an attractive digital interface.",
      highlights: [
        'Cohesive hospitality identity and curated menu presentation',
        'Mobile-friendly navigation for browsing dishes and dining details',
        'Clean visual hierarchy prioritizing atmosphere and clarity',
      ],
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
      thumbnail: '/src/assets/images/project_restaurant_1794850745145.jpg',
      thumbnailAlt: 'Restaurant Website presentation on laptop over dark slate table',
    },
    {
      id: 'game-development',
      index: '03',
      title: 'Game Development',
      category: 'Game Development',
      description:
        'An interactive game project I created as part of my programming and development journey.',
      highlights: [
        'Hands-on exploration of interactive rules, player state, and logic flow',
        'Iterative problem-solving through debugging and gameplay refinement',
        'Built to practice core programming concepts in a playful format',
      ],
      tags: ['Python', 'JavaScript', 'Problem Solving'],
      thumbnail: '/src/assets/images/project_gamedev_1794850745751.jpg',
      thumbnailAlt: 'Interactive game design concept showcase in dark obsidian and gold',
    },
    {
      id: 'personal-creative-website',
      index: '04',
      title: 'Personal Creative Website',
      category: 'Creative Web Development',
      description:
        'A customized website featuring creative design, animations, dynamic messages, and interactive web experiences.',
      highlights: [
        'Custom animation choreography and expressive dark-mode styling',
        'Dynamic message presentation and interactive page transitions',
        'Experimental UI/UX layout crafted for memorable visitor engagement',
      ],
      tags: ['HTML5', 'CSS3', 'JavaScript', 'UI/UX Design'],
      thumbnail: '/src/assets/images/project_creative_web_1794850746866.jpg',
      thumbnailAlt: 'Personal Creative Website layered glassmorphic interface showcase',
    },
    {
      id: 'historical-digital-media',
      index: '05',
      title: 'Historical Digital Media Project',
      category: 'Creative Technology',
      description:
        'A digital storytelling project focused on Egyptian history and the October 1973 War, combining cinematic visuals and creative digital content.',
      highlights: [
        'Digital storytelling honoring Egyptian history and the October 1973 War',
        'Cinematic visual framing paired with structured narrative flow',
        'Blending historical research with creative digital presentation',
      ],
      tags: ['UI/UX Design', 'Artificial Intelligence Tools', 'Responsive Design'],
      thumbnail: '/src/assets/images/project_october_1973_1794850745501.jpg',
      thumbnailAlt: 'Historical Digital Media Project documentary frame depicting October 1973',
    },
  ] satisfies ProjectItem[],
  journey: [
    {
      id: 'explore-programming',
      title: 'Started exploring programming',
      description:
        'Discovered how code turns curiosity and logic into tangible software ideas.',
    },
    {
      id: 'python-fundamentals',
      title: 'Learned Python fundamentals',
      description:
        'Practiced variables, control flow, functions, and structured problem solving in Python.',
    },
    {
      id: 'building-websites',
      title: 'Started building websites',
      description:
        'Moved into front-end creation with HTML5, CSS3, and responsive layouts.',
    },
    {
      id: 'educational-projects',
      title: 'Created educational website projects',
      description:
        'Built MathTopia to organize lessons and make mathematics concepts approachable online.',
    },
    {
      id: 'restaurant-project',
      title: 'Developed a restaurant website',
      description:
        'Designed a hospitality web presence centered on brand atmosphere and menu clarity.',
    },
    {
      id: 'interactive-game',
      title: 'Created an interactive game',
      description:
        'Applied programming logic to build an interactive game project from concept to play.',
    },
    {
      id: 'explored-ai',
      title: 'Explored artificial intelligence',
      description:
        'Experimented with modern AI tools and Google AI Studio to expand creative capabilities.',
    },
    {
      id: 'creative-digital-projects',
      title: 'Continued building creative digital projects',
      description:
        'Combining web craft, storytelling, and continuous learning on every new project.',
    },
  ] satisfies JourneyMilestone[],
  education: {
    institution: 'WE Applied Technology School',
    location: 'Menofia, Egypt',
    fieldOfInterest: 'Programming and Technology',
    summary:
      'Focused on applied technology education, building strong foundations in software development, modern web design, and creative problem-solving.',
  },
  loveBuilding: [
    {
      id: 'modern-websites',
      title: 'Modern Websites',
      description:
        'Clean, responsive web experiences crafted with thoughtful visual hierarchy and dark luxury detail.',
      iconKey: 'globe',
    },
    {
      id: 'educational-platforms',
      title: 'Educational Platforms',
      description:
        'Structured learning spaces that help students explore concepts clearly at their own pace.',
      iconKey: 'book',
    },
    {
      id: 'interactive-web',
      title: 'Interactive Web Experiences',
      description:
        'Dynamic interfaces with smooth motion, intuitive navigation, and engaging user flows.',
      iconKey: 'mouse',
    },
    {
      id: 'creative-digital',
      title: 'Creative Digital Projects',
      description:
        'Story-driven builds that merge cultural themes, visual direction, and front-end craft.',
      iconKey: 'sparkles',
    },
    {
      id: 'python-apps',
      title: 'Python Applications',
      description:
        'Logic-driven programs and practical coding experiments rooted in Python fundamentals.',
      iconKey: 'terminal',
    },
    {
      id: 'ai-experiences',
      title: 'AI-Powered Experiences',
      description:
        'Exploring how artificial intelligence tools can enhance productivity and digital creativity.',
      iconKey: 'brain',
    },
  ] satisfies BuildingInterest[],
  defaultProfileLinks: {
    email: 'crcr771uy7@gmail.com',
    githubUrl: '',
    linkedinUrl: '',
  } satisfies ProfileLinks,
};
