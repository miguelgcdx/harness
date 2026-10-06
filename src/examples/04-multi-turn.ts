import 'dotenv/config';

import { createCodingSession } from '../runtime/create-session.js';

async function main() {
  const {
    agent,
    session,
    sandboxSession,
    destroy,
  } = await createCodingSession();

  try {
    // A HarnessAgentSession owns the harness runtime's native
    // conversation history. Reusing this session preserves context
    // without replaying the entire message history ourselves.
    const first = await agent.generate({
      session,
      prompt: [
        'Inspect src/calculator.ts and identify the bug.',
        'Do not edit the file.',
        'Remember what you found for the next turn.',
      ].join('\n'),
    });

    console.log('--- turn 1 ---');
    console.log(first.text);

    const second = await agent.generate({
      session,
      prompt: [
        'Now fix the bug you found.',
        'Use the careful-refactors skill.',
        'Run bash verify.sh before finishing.',
      ].join('\n'),
    });

    console.log('\n--- turn 2 ---');
    console.log(second.text);

    const sandbox =
      sandboxSession.restricted();

    const verification =
      await sandbox.run({
        command:
          'cd /repo && bash verify.sh',
      });

    console.log('\n--- verification ---');
    process.stdout.write(
      verification.stdout,
    );
  } finally {
    await destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
