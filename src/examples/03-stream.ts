import 'dotenv/config';

import { createCodingSession } from '../runtime/create-session.js';

async function main() {
  const {
    agent,
    session,
    destroy,
  } = await createCodingSession();

  try {
    // stream() exposes the harness output through the same AI SDK
    // stream-part shapes used elsewhere in AI SDK.
    const result = await agent.stream({
      session,
      prompt: [
        'Fix the calculator bug.',
        'Run bash verify.sh.',
        'Explain the final change briefly.',
      ].join('\n'),
    });

    for await (const part of result.stream) {
      if (part.type === 'text-delta') {
        process.stdout.write(part.text);
      }
    }

    process.stdout.write('\n');
  } finally {
    await destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
