import { createClient, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';

// Get the client ID from the environment.
// Falls back to a dummy string if not set, preventing startup errors.
const clientId = import.meta.env.PUBLIC_WIX_CLIENT_ID || 'dummy-client-id';

export const wixClient = createClient({
  modules: { items },
  auth: OAuthStrategy({
    clientId: clientId,
  }),
});
