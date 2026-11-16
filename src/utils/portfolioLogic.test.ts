import test from 'node:test';
import assert from 'node:assert/strict';
import { PORTFOLIO_CONFIG } from '../config/portfolioConfig';
import {
  calculateAverageByCategory,
  clampSkillPercentage,
  filterProjectsByCategory,
  filterSkillsByCategory,
  normalizeSafeUrl,
  sanitizeProfileLinks,
  updateSkillPercentage,
  validateContactForm,
} from './portfolioLogic';

test('clampSkillPercentage clamps values strictly to 0..100 integers', () => {
  assert.equal(clampSkillPercentage(-15), 0);
  assert.equal(clampSkillPercentage(140), 100);
  assert.equal(clampSkillPercentage(64.6), 65);
  assert.equal(clampSkillPercentage(Number.NaN), 0);
});

test('updateSkillPercentage updates only the targeted skill', () => {
  const updated = updateSkillPercentage(
    PORTFOLIO_CONFIG.initialSkills,
    'python',
    68
  );
  const python = updated.find((item) => item.id === 'python');
  const react = updated.find((item) => item.id === 'react');

  assert.equal(python?.percentage, 68);
  assert.equal(react?.percentage, 25);
});

test('filterSkillsByCategory and calculateAverageByCategory compute accurate averages', () => {
  const programming = filterSkillsByCategory(
    PORTFOLIO_CONFIG.initialSkills,
    'Programming'
  );
  assert.equal(programming.length, 2);
  // Python 55 + JavaScript 40 = 95 / 2 = 47.5 -> 48
  assert.equal(
    calculateAverageByCategory(PORTFOLIO_CONFIG.initialSkills, 'Programming'),
    48
  );
});

test('filterProjectsByCategory filters accurately without dropping All view', () => {
  assert.equal(
    filterProjectsByCategory(PORTFOLIO_CONFIG.projects, 'All').length,
    5
  );
  const edu = filterProjectsByCategory(
    PORTFOLIO_CONFIG.projects,
    'Educational Website'
  );
  assert.equal(edu.length, 1);
  assert.equal(edu[0].title, 'MathTopia');
});

test('validateContactForm rejects empty or invalid inputs with explicit field errors', () => {
  const invalid = validateContactForm({
    name: 'M',
    email: 'invalid-email',
    subject: 'Hi',
    message: 'Too short',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.subject);
  assert.ok(invalid.errors.message);
});

test('validateContactForm accepts valid trimmed inquiry', () => {
  const valid = validateContactForm({
    name: '  Ahmed Hassan  ',
    email: 'ahmed@example.com',
    subject: 'Web Collaboration Idea',
    message: 'I would love to collaborate on an educational website concept.',
  });
  assert.equal(valid.isValid, true);
  assert.deepEqual(valid.errors, {});
  assert.equal(valid.sanitized.name, 'Ahmed Hassan');
});

test('normalizeSafeUrl rejects javascript: URLs and allows https URLs', () => {
  assert.equal(normalizeSafeUrl('javascript:alert(1)'), '');
  assert.equal(
    normalizeSafeUrl('https://github.com/example'),
    'https://github.com/example'
  );
});

test('sanitizeProfileLinks preserves valid links and falls back safely on bad email', () => {
  const sanitized = sanitizeProfileLinks(
    {
      email: 'bad-email',
      githubUrl: 'https://github.com/mohammed',
      linkedinUrl: 'ftp://invalid.com',
    },
    PORTFOLIO_CONFIG.defaultProfileLinks
  );
  assert.equal(sanitized.email, PORTFOLIO_CONFIG.defaultProfileLinks.email);
  assert.equal(sanitized.githubUrl, 'https://github.com/mohammed');
  assert.equal(sanitized.linkedinUrl, '');
});
