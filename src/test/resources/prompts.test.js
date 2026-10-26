import { describe, expect, it } from 'vitest';
import { learnPromptPrefix, prompts, workPromptPrefix } from '../../resources/prompts';

describe('mode prompts', () => {
  it('exposes both mode prompt prefixes', () => {
    expect(prompts.learn).toBe(learnPromptPrefix);
    expect(prompts.work).toBe(workPromptPrefix);
  });

  it('keeps Learn and Work instructions distinct', () => {
    expect(learnPromptPrefix).not.toBe(workPromptPrefix);
    expect(learnPromptPrefix).toContain('study companion');
    expect(workPromptPrefix).toContain('programming partner');
  });
});
