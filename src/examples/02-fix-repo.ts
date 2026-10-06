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
    const result = await agent.generate({
      session,
      prompt: [
        'Fix the bug in this repository.',
        'Use the careful-refactors skill.',
        'Make the smallest correct change.',
        'Run bash verify.sh before finishing.',
      ].join('\n'),
    });

    console.log('\n--- agent response ---');
    console.log(result.text);

    // restricted() gives application code a safe filesystem/process view
    // of the same sandbox workspace used by the harness.
    const sandbox =
      sandboxSession.restricted();

    const file =
      await sandbox.readTextFile({
        path: '/repo/src/calculator.ts',
      });

    const verification =
      await sandbox.run({
        command:
          'cd /repo && bash verify.sh',
      });

    console.log('\n--- calculator.ts ---');
    console.log(file);

    console.log('\n--- independent verification ---');
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
