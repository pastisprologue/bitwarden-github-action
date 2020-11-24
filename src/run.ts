import { addPath, getInput } from "@actions/core";
import { authenticate } from "./bw";
import { install } from "./install";

export async function run() {
  const path = await install({
    version: getInput("bitwarden-version") || "latest",
    packager: getInput("bitwarden-packager") || "yarn",
    cache: (getInput("bitwarden-cache") || "false") === "true",
    cacheKey: getInput("bitwarden-cache-key") || undefined,
  });

  addPath(path);

  await authenticate({
    username: getInput("bitwarden-username") || undefined,
    password: getInput("bitwarden-password") || undefined,
  });
}
