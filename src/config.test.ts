import { describe, expect, test } from "bun:test";

import { applyInstallDefaults } from "./config.js";

const JSONC = `{
  // created per README
  "apiKey": "sm_test",
  "recallMode": "advisory"
}
`;

describe("applyInstallDefaults", () => {
  test("keeps comments and user settings in an existing jsonc config", () => {
    const next = applyInstallDefaults(JSONC, true)!;

    expect(next).toContain("// created per README");
    expect(next).toContain('"recallMode": "advisory"');
    expect(next).toContain('"captureEveryNTurns": 3');
  });

  test("leaves an existing capture cadence untouched", () => {
    const content = `{ "captureEveryNTurns": 5 } // keep`;
    expect(applyInstallDefaults(content, true)).toBe(content);
  });

  test("writes fresh-install defaults to an empty config", () => {
    expect(JSON.parse(applyInstallDefaults("", false)!)).toEqual({
      recallMode: "direct",
      captureEveryNTurns: 0,
    });
  });

  test("does not rewrite a config it cannot parse", () => {
    expect(applyInstallDefaults(`{ "apiKey": `, true)).toBeNull();
  });
});
