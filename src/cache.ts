import { restoreCache, saveCache } from "@actions/cache/lib";
import * as toolCache from "@actions/tool-cache";
import path from "path";
import os from "os";

/**
 * Get the path to the `bw` from cache, if any.
 * Note, this cache is **NOT** shared between jobs.
 *
 * @see https://github.com/actions/toolkit/issues/47
 */
export async function fromLocalCache(version: string) {
  return toolCache.find("@bitwarden/cli", version);
}

/**
 * Store the root of `bw` in the cache, for future reuse.
 * Note, this cache is **NOT** shared between jobs.
 *
 * @see https://github.com/actions/toolkit/issues/47
 */
export async function toLocalCache(root: string, version: string) {
  return toolCache.cacheDir(root, "@bitwarden/cli", version);
}

/**
 * Download the remotely stored `bw` from cache, if any.
 * Note, this cache is shared between jobs.
 */
export async function fromRemoteCache(
  version: string,
  packager: string,
  customCacheKey?: string
) {
  // see: https://github.com/actions/toolkit/blob/8a4134761f09d0d97fb15f297705fd8644fef920/packages/tool-cache/src/tool-cache.ts#L401
  const target = path.join(
    process.env["RUNNER_TOOL_CACHE"] || "",
    "@bitwarden/cli",
    version,
    os.arch()
  );
  const cacheKey = customCacheKey || getRemoteKey(version, packager);
  const hit = await restoreCache(target, cacheKey, cacheKey);

  if (hit) {
    return target;
  }
}

/**
 * Store the root of `bw` in the remote cache, for future reuse.
 * Note, this cache is shared between jobs.
 */
export async function toRemoteCache(
  source: string,
  version: string,
  packager: string,
  customCacheKey?: string
) {
  const cacheKey = customCacheKey || getRemoteKey(version, packager);

  await saveCache(source, cacheKey);
}

/**
 * Get the cache key to use when (re)storing the Bitwarden CLI from remote cache.
 */
function getRemoteKey(version: string, packager: string) {
  return `bw-${process.platform}-${os.arch()}-${packager}-${version}`;
}
