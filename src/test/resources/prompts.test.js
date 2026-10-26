import { describe, expect, it } from 'vitest';
import { learnPromptPrefix, prompts, workPromptPrefix } from '../../resources/prompts';

describe('mode prompts', () => {
  it('exposes both mode prompt prefixes', () => {
    expect(prompts.learn).toBe(learnPromptPrefix);
    expect(prompts.work).toBe(workPromptPrefix);
  });

  it('keeps Learn and Work instructions distinct', () => {
    expect(learnPromptPrefix).not.toBe(workPromptPrefix);
    expect(learnPromptPrefix.length).toBeGreaterThan(2000);
    expect(workPromptPrefix.length).toBeGreaterThan(1800);
    expect(learnPromptPrefix).toContain('study companion');
    expect(learnPromptPrefix).toContain('Never disclose the final answer');
    expect(learnPromptPrefix).toContain('Situation-Behavior-Impact');
    expect(learnPromptPrefix).toContain('Ask at most one follow-up');
    expect(learnPromptPrefix).toContain('Do not append a question to');
    expect(workPromptPrefix).toContain('programming partner');
    expect(workPromptPrefix).toContain('plausible culprits');
    expect(workPromptPrefix).toContain('production-ready');
  });
});
