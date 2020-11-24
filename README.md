# bitwarden-github-action
A simple interface for accessing items in your Bitwarden Vault

Heavily influenced by the [Expo Github Action](https://github.com/marketplace/actions/expo-github-action) implementation.

## Configuration options

This action is customizable through variables; they are defined in the [`action.yml`](action.yml).
Here is a summary of all the variables that you can use and their purpose.

variable              | default  | description
---                   | ---      | ---
`bitwarden-username`  | -        | The username of your Bitwarden account 
`bitwarden-password`  | -        | The password of your Bitwarden account
`bitwarden-version`   | `latest` | The Bitwarden CLI version to use, can be any
`bitwarden-packager`  | `yarn`   | The package manager to install the CLI with.
`bitwarden-cache`     | `false`  | If it should use the GitHub actions (remote) cache
`bitwarden-cache-key` | -        | An optional custom (remote) cache key.

> Never hardcode `bitwarden-password` in your workflow, use [secrets][link-actions-secrets] to store them.

> It's also recommended to set the `bitwarden-version` to avoid breaking changes when a new major version is released.
