import 'dotenv/config';

import { createCodingSession } from '../runtime/create-session.js';

async function main() {
  const {
    agent,
    session,
    destroy,
  } = await createCodingSession();

  try {
    // generate() runs one complete Pi harness turn and returns
    // an AI SDK-compatible GenerateTextResult.
    const result = await agent.generate({
      session,
      prompt: [
        'Inspect this repository.',
        'Identify the bug in src/calculator.ts.',
        'Do not edit anything yet.',
        'Explain the problem in two sentences.',
      ].join('\n'),
    });

    console.log(result.text);
    console.log('finishReason:', result.finishReason);
  } finally {
    await destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
