import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createServer as createViteServer } from 'vite';
import { PORTFOLIO_CONFIG } from './src/config/portfolioConfig.ts';
import type { ProfileLinks, SkillItem } from './src/config/portfolioConfig.ts';
import {
  clampSkillPercentage,
  sanitizeProfileLinks,
  validateContactForm,
} from './src/utils/portfolioLogic.ts';
import type { ContactSubmissionRecord } from './src/utils/portfolioLogic.ts';

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const STATE_FILE = path.join(DATA_DIR, 'portfolio-state.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

interface PersistedPortfolioState {
  skillPercentages: Record<string, number>;
  profileLinks: ProfileLinks;
  updatedAt: string;
}

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readPortfolioState(): Promise<PersistedPortfolioState> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(STATE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<PersistedPortfolioState>;
    return {
      skillPercentages: parsed.skillPercentages ?? {},
      profileLinks: sanitizeProfileLinks(
        parsed.profileLinks ?? {},
        PORTFOLIO_CONFIG.defaultProfileLinks
      ),
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return {
      skillPercentages: {},
      profileLinks: PORTFOLIO_CONFIG.defaultProfileLinks,
      updatedAt: new Date().toISOString(),
    };
  }
}

async function writePortfolioState(
  state: PersistedPortfolioState
): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

async function readMessages(): Promise<ContactSubmissionRecord[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(MESSAGES_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ContactSubmissionRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeMessages(
  messages: ContactSubmissionRecord[]
): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf8');
}

function mergeSkillsWithOverrides(
  overrides: Record<string, number>
): SkillItem[] {
  return PORTFOLIO_CONFIG.initialSkills.map((skill) => {
    const override = overrides[skill.id];
    if (typeof override === 'number' && Number.isFinite(override)) {
      return { ...skill, percentage: clampSkillPercentage(override) };
    }
    return skill;
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/portfolio-state', async (_req, res) => {
    try {
      const state = await readPortfolioState();
      const skills = mergeSkillsWithOverrides(state.skillPercentages);
      res.json({
        skills,
        profileLinks: state.profileLinks,
        updatedAt: state.updatedAt,
      });
    } catch (error) {
      console.error('Failed to load portfolio state:', error);
      res.status(500).json({ error: 'Unable to load portfolio configuration.' });
    }
  });

  app.put('/api/skills', async (req, res) => {
    try {
      const body = req.body as {
        percentages?: Record<string, number>;
      };
      if (!body || typeof body.percentages !== 'object' || !body.percentages) {
        res.status(400).json({ error: 'Invalid skill percentages payload.' });
        return;
      }

      const current = await readPortfolioState();
      const validIds = new Set(PORTFOLIO_CONFIG.initialSkills.map((s) => s.id));
      const nextOverrides: Record<string, number> = {
        ...current.skillPercentages,
      };

      for (const [id, rawVal] of Object.entries(body.percentages)) {
        if (validIds.has(id) && typeof rawVal === 'number') {
          nextOverrides[id] = clampSkillPercentage(rawVal);
        }
      }

      const nextState: PersistedPortfolioState = {
        ...current,
        skillPercentages: nextOverrides,
        updatedAt: new Date().toISOString(),
      };
      await writePortfolioState(nextState);

      res.json({
        skills: mergeSkillsWithOverrides(nextState.skillPercentages),
        updatedAt: nextState.updatedAt,
      });
    } catch (error) {
      console.error('Failed to update skills:', error);
      res.status(500).json({ error: 'Unable to save skill estimates.' });
    }
  });

  app.post('/api/skills/reset', async (_req, res) => {
    try {
      const current = await readPortfolioState();
      const nextState: PersistedPortfolioState = {
        ...current,
        skillPercentages: {},
        updatedAt: new Date().toISOString(),
      };
      await writePortfolioState(nextState);
      res.json({
        skills: PORTFOLIO_CONFIG.initialSkills,
        updatedAt: nextState.updatedAt,
      });
    } catch (error) {
      console.error('Failed to reset skills:', error);
      res.status(500).json({ error: 'Unable to reset skill estimates.' });
    }
  });

  app.put('/api/profile-links', async (req, res) => {
    try {
      const current = await readPortfolioState();
      const sanitizedLinks = sanitizeProfileLinks(
        (req.body ?? {}) as Partial<ProfileLinks>,
        current.profileLinks
      );
      const nextState: PersistedPortfolioState = {
        ...current,
        profileLinks: sanitizedLinks,
        updatedAt: new Date().toISOString(),
      };
      await writePortfolioState(nextState);
      res.json({
        profileLinks: nextState.profileLinks,
        updatedAt: nextState.updatedAt,
      });
    } catch (error) {
      console.error('Failed to save profile links:', error);
      res.status(500).json({ error: 'Unable to save profile links.' });
    }
  });

  app.get('/api/contact', async (_req, res) => {
    try {
      const messages = await readMessages();
      res.json({ messages });
    } catch (error) {
      console.error('Failed to read contact messages:', error);
      res.status(500).json({ error: 'Unable to load contact submissions.' });
    }
  });

  app.post('/api/contact', async (req, res) => {
    try {
      const validation = validateContactForm({
        name: String(req.body?.name ?? ''),
        email: String(req.body?.email ?? ''),
        subject: String(req.body?.subject ?? ''),
        message: String(req.body?.message ?? ''),
      });

      if (!validation.isValid) {
        res.status(400).json({
          error: 'Please check the highlighted form fields.',
          fieldErrors: validation.errors,
        });
        return;
      }

      const messages = await readMessages();
      const submission: ContactSubmissionRecord = {
        id: `INQ-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        ...validation.sanitized,
        createdAt: new Date().toISOString(),
      };

      const updated = [submission, ...messages].slice(0, 100);
      await writeMessages(updated);

      res.status(201).json({
        ok: true,
        submission,
      });
    } catch (error) {
      console.error('Failed to store contact message:', error);
      res.status(500).json({
        error:
          'We could not record your message on the server right now. Please try emailing directly.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server error:', err);
  process.exit(1);
});
