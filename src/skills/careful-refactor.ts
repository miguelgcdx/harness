export const carefulRefactorSkill = {
  name: 'careful-refactors',

  description:
    'Use when fixing bugs, refactoring code, or changing repository files. Requires minimal diffs and verification before finishing.',

  content: [
    '# Careful Refactors',
    '',
    'Make the smallest change that solves the task.',
    '',
    'Before editing:',
    '1. Inspect the relevant files.',
    '2. Understand the existing behavior.',
    '3. Read references/checklist.md.',
    '',
    'After editing:',
    '1. Run the repository verification command.',
    '2. Fix any failure caused by your change.',
    '3. Summarize exactly what changed and what verification passed.',
  ].join('\n'),

  files: [
    {
      path: 'references/checklist.md',
      content: [
        '# Verification checklist',
        '',
        '- Preserve unrelated behavior.',
        '- Prefer one focused edit over broad rewrites.',
        '- Do not modify files that are unrelated to the task.',
        '- Run bash verify.sh before claiming the task is complete.',
        '- If verification fails, inspect the failure and repair the implementation.',
      ].join('\n'),
    },
  ],
};
