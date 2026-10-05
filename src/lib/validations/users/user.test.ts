import { describe, expect, it } from "vitest";
import { userSchema } from "./user";

const baseValidUser = {
  email: "email@mail.com",
  password: "Password1",
  confirmPassword: "Password1",
};

describe("userSchema", () => {
  it("accepts a valid user sign up.", () => {
    const userData = userSchema.safeParse(baseValidUser);
    expect(userData.success).toBe(true);
  });

  it.each([
    ["an invalid email", { ...baseValidUser, email: "missingdomain.com" }],
    [
      "a password shorter than 8 chars",
      {
        ...baseValidUser,
        password: "A1" + "a".repeat(5),
        confirmPassword: "A1" + "a".repeat(5),
      },
    ],
    [
      "a password longer than 72 chars",
      {
        ...baseValidUser,
        password: "A1" + "a".repeat(71),
        confirmPassword: "A1" + "a".repeat(71),
      },
    ],
    [
      "a password with no uppercase letters",
      { ...baseValidUser, password: "password1", confirmPassword: "password1" },
    ],
    [
      "a password with no numbers",
      { ...baseValidUser, password: "Password", confirmPassword: "Password" },
    ],
    [
      "passwords that do not match",
      { ...baseValidUser, confirmPassword: "Different1" },
    ],
  ])("rejects %s", (_description, object) => {
    const userData = userSchema.safeParse(object);
    expect(userData.success).toBe(false);
  });

  it.each([
    ["a valid email", { ...baseValidUser, email: "valid@email.com" }],
    ["a valid password", baseValidUser],
    [
      "an 8 char password",
      { ...baseValidUser, password: "Passwor1", confirmPassword: "Passwor1" },
    ],
    [
      "a 72 char password",
      {
        ...baseValidUser,
        password: "A1" + "a".repeat(70),
        confirmPassword: "A1" + "a".repeat(70),
      },
    ],
  ])("accepts %s", (_description, object) => {
    const userData = userSchema.safeParse(object);
    expect(userData.success).toBe(true);
  });

  it("trims and lowercases email", () => {
    const userData = userSchema.safeParse({
      ...baseValidUser,
      email: "   VaLId@eMaIl.cOM   ",
    });
    expect(userData.success).toBe(true);
    if (userData.success) {
      expect(userData.data?.email).toBe("valid@email.com");
    }
  });
});
