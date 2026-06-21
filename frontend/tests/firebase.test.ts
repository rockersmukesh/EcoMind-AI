import { describe, it, expect } from "vitest";
import { mockLogin } from "../lib/firebase";

describe("Firebase Auth Fallback Helpers", () => {
  it("should generate a valid mock user session details", async () => {
    const user = await mockLogin();
    
    expect(user).toHaveProperty("uid");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("displayName");
    expect(user).toHaveProperty("photoURL");
    
    expect(user.uid).toBe("mock-user-123");
    expect(user.email).toBe("eco.challenger@ecomind.ai");
  });
});
