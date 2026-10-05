"use server";

import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { userSchema } from "@/lib/validations/users/user";
import bcrypt from "bcryptjs";
import z from "zod";
import { signIn } from "../../../auth";

export type SignUpState = {
  errors: {
    general?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
};

export async function signUp(
  _previousState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = userSchema.safeParse(rawData);

  if (!result.success) {
    const errors = z.flattenError(result.error);
    return {
      errors: errors.fieldErrors,
    };
  }
  const passwordHash = await bcrypt.hash(result.data.password, 12);

  try {
    await prisma.user.create({
      data: {
        email: result.data.email,
        passwordHash,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002")
        return {
          errors: {
            email: ["This email is already taken."],
          },
        };
    }
    return {
      errors: {
        general: ["Something went wrong. Please retry."],
      },
    };
  }
  await signIn("credentials", {
    email: result.data.email,
    password: result.data.password,
    redirectTo: "/applications",
  });
  return {
    errors: {},
  };
}
