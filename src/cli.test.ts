import { describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("cli install", () => {
  test("works on a machine without ~/.config/opencode", () => {
    const home = mkdtempSync(join(tmpdir(), "sm-cli-home-"));
    try {
      const env: Record<string, string | undefined> = { ...process.env, HOME: home, USERPROFILE: home };
      delete env.SUPERMEMORY_API_KEY;

      const result = Bun.spawnSync(["bun", join(import.meta.dir, "cli.ts"), "install", "--no-tui"], { env });

      expect(result.stderr.toString()).not.toContain("ENOENT");
      expect(result.exitCode).toBe(0);
      expect(existsSync(join(home, ".config", "opencode", "supermemory.json"))).toBe(true);
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  });
});
