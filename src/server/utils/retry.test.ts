import { describe, expect, it } from "vitest";
import { retryWithBackoff } from "./retry";

describe("retryWithBackoff", () => {
  it("returns successful response", async () => {
    const result = await retryWithBackoff(async () => "ok");
    expect(result).toBe("ok");
  });
});
