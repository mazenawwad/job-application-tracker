"use server";

import { AuthError } from "next-auth";
import { signIn } from "../../../auth";

export type LoginState = {
  errors: {
    credentials?: string[];
    general?: string[];
  };
};
export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/applications",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return {
          errors: {
            credentials: ["Invalid email or password"],
          },
        };
      }
      return {
        errors: {
          general: ["Something went wrong, please retry."],
        },
      };
    }
    throw error;
  }
  return {
    errors : {},
  }
}
