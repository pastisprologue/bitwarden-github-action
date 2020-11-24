import * as core from '@actions/core';
import * as cli from '@actions/exec';

type AuthOptions = {
  token?: string;
  username?: string;
  password?: string;
};

/**
 * Authenticate at Bitwarden using `bw login`.
 * This step is required for publishing and building new apps.
 */
export async function authWithCredentials(
  username?: string,
  password?: string
) {
  if (!username || !password) {
    return core.info(
      'Skipping authentication: `bitwarden-username` and/or `bitwarden-password` not set...'
    );
  }

  // github actions toolkit will handle commands with `.cmd` on windows, we need that
  const bin = process.platform === 'win32' ? 'bw.cmd' : 'bw';

  await cli.exec(bin, ['login', `${username}`, `${password}`], {
    listeners: {
      stdout: (data: Buffer) => {
        const regex = /"(\S*)"/;
        const matches = regex.exec(data.toString());
        if (matches && matches.length >= 2) {
          const sessionKey = matches[1];
          core.exportVariable('BW_SESSION', sessionKey);
        } else {
          core.error('Failed to set BW Session Key!');
        }
      },
    },
  });
}

/**
 * Authenticate with Bitwarden using either the token or username/password method.
 * If both of them are set, token has priority.
 */
export function authenticate(options: AuthOptions) {
  if (options.username || options.password) {
    return authWithCredentials(options.username, options.password);
  }

  core.info(
    'Skipping authentication: `bitwarden-token`, `bitwarden-username`, and/or `bitwarden-password` not set...'
  );
}
