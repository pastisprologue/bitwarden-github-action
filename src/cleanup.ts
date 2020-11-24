import * as core from '@actions/core';
import * as cli from '@actions/exec';

async function cleanup() {
  const bin = process.platform === 'win32' ? 'bw.cmd' : 'bw';
  await cli.exec(bin, ['lock']);
  await cli.exec(bin, ['logout']);
}

cleanup().catch(core.setFailed);
