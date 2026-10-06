import { createJustBashNetworkSandboxSession } from '@ai-sdk/sandbox-just-bash';

import { codingAgent } from '../agent.js';

// A HarnessAgent object only stores configuration.
// createCodingSession() creates the live sandbox + Pi session state.
export async function createCodingSession() {
  // Pi is a host-runtime harness, so it can use the lightweight
  // just-bash sandbox instead of requiring a network sandbox bridge.
  const sandboxSession =
    await createJustBashNetworkSandboxSession({
      cwd: '/',
    });

  const session =
    await codingAgent.createSession({
      sandboxSession,
    });

  async function destroy() {
    await session.destroy();
    await sandboxSession.destroy();
  }

  return {
    agent: codingAgent,
    session,
    sandboxSession,
    destroy,
  };
}
