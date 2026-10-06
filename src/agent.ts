import 'dotenv/config';

import { HarnessAgent } from '@ai-sdk/harness/agent';
import { createPi } from '@ai-sdk/harness-pi';

import { carefulRefactorSkill } from './skills/careful-refactor.js';

const configuredModel = process.env.HARNESS_MODEL?.trim();

export const codingAgent = new HarnessAgent({
  // createPi() adapts the Pi coding-agent runtime to the AI SDK
  // HarnessAgent interface. Pi still owns its native coding loop,
  // built-in tools, context management, and session behavior.
  harness: createPi({
    thinkingLevel: 'medium',
  }),

  // HarnessAgent wraps an existing agent runtime instead of building
  // the model/tool loop ourselves like ToolLoopAgent.
  ...(configuredModel
    ? {
        model: configuredModel,
      }
    : {}),

  instructions: [
    'You are a careful repository coding agent.',
    'Inspect the repository before editing.',
    'Prefer minimal changes.',
    'Never claim verification passed unless you actually ran it.',
    'Keep the final response concise and list the files you changed.',
  ].join('\n'),

  // Skills are reusable instruction bundles that Pi can discover
  // when the current task matches the skill description.
  skills: [carefulRefactorSkill],

  // Built-in Pi filesystem/shell tools execute inside the supplied sandbox.
  // allow-all keeps these learning examples non-interactive.
  permissionMode: 'allow-all',

  // sandboxConfig defines the workspace HarnessAgent creates for each session.
  // onBootstrap materializes our demo repository before Pi works on it.
  sandboxConfig: {
    workDir: 'repo',
    bootstrapHash: 'calculator-demo-v1',

    onBootstrap: async ({
      session,
      workDir,
      abortSignal,
    }) => {
      await session.run({
        command: 'mkdir -p ' + workDir + '/src',
        abortSignal,
      });

      await session.writeTextFile({
        path: workDir + '/README.md',
        content: [
          '# Calculator Demo',
          '',
          'This repository intentionally contains a bug in the add() function.',
          '',
          'Verification command: bash verify.sh',
          '',
        ].join('\n'),
        abortSignal,
      });

      await session.writeTextFile({
        path: workDir + '/src/calculator.ts',
        content: [
          'export function add(a: number, b: number) {',
          '  return a - b;',
          '}',
          '',
          'export function multiply(a: number, b: number) {',
          '  return a * b;',
          '}',
          '',
        ].join('\n'),
        abortSignal,
      });

      await session.writeTextFile({
        path: workDir + '/verify.sh',
        content: [
          '#!/usr/bin/env bash',
          'set -e',
          '',
          'grep -Fq "return a + b;" src/calculator.ts',
          '',
          'echo "PASS: add() returns a + b"',
          '',
        ].join('\n'),
        abortSignal,
      });
    },
  },

  onToolExecutionStart({ toolCall }) {
    console.error('[tool:start] ' + toolCall.toolName);
  },

  onToolExecutionEnd({ toolCall }) {
    console.error('[tool:end] ' + toolCall.toolName);
  },
});
