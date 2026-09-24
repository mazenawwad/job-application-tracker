"use server";

import z from "zod";
import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { applicationStatuses } from "@/lib/application-status";

export type EditApplicationFormState = {
  errors: {
    company?: string[];
    position?: string[];
    status?: string[];
    jobUrl?: string[];
    notes?: string[];
    general?: string[];
  };
  success: boolean;
};
const editApplicationSchema = z.object({
  id: z.coerce.number().int().positive(),
  company: z
    .string()
    .min(3, { error: "Please enter a valid company name." })
    .max(40),
  position: z
    .string()
    .min(3, { error: "Please enter a valid position." })
    .max(40),
  status: z.enum(applicationStatuses, { error: "Please select a valid status." }),
  jobUrl: z.preprocess(
    (value) => (value === "" ? null : value),
    z.url({ error: "Kindly enter a valid URL." }).nullable(),
  ),
  notes: z.preprocess(
    (value) => (value === "" ? null : value),
    z.string().nullable(),
  ),
});
export async function updateApplication(
  _previousState: EditApplicationFormState,
  formData: FormData,
): Promise<EditApplicationFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  const rawData = {
    id: formData.get("id"),
    company: formData.get("company"),
    position: formData.get("position"),
    status: formData.get("status"),
    jobUrl: formData.get("jobUrl"),
    notes: formData.get("notes"),
  };

  const result = editApplicationSchema.safeParse(rawData);

  if (!result.success) {
    const errors = z.flattenError(result.error);
    return {
      errors: errors.fieldErrors,
      success: false,
    };
  }
  const validatedApplication = result.data;
  const currentUserId = Number(session.user.id);

  try {
    await prisma.application.update({
      where: {
        id: validatedApplication.id,
        userId: currentUserId,
      },
      data: {
        company: validatedApplication.company,
        jobUrl: validatedApplication.jobUrl,
        notes: validatedApplication.notes,
        position: validatedApplication.position,
        status: validatedApplication.status,
      },
    });
    revalidatePath("/applications");
    revalidatePath(`/applications/${validatedApplication.id}`);
    revalidatePath(`/applications/${validatedApplication.id}/edit`);
    return {
      errors: {},
      success: true,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        errors: {
          general: ["Application could not be found."],
        },
        success: false,
      };
    }
    console.error(error);
    return {
      errors: {
        general: ["Something went wrong while updating the application."],
      },
      success: false,
    };
  }
}
