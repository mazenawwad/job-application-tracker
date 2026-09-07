"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";

const applicationSchema = z.object({
  company: z
    .string()
    .min(3, { error: "Please enter a valid company name." })
    .max(40),
  position: z
    .string()
    .min(3, { error: "Please enter a valid position." })
    .max(40),
  status: z.string().min(3, { error: "Please enter a valid status." }),
  jobUrl: z.preprocess(
    (value) => (value === "" ? null : value),
    z.url({ error: "Kindly enter a valid URL." }).nullable(),
  ),
  notes: z.preprocess(
    (value) => (value === "" ? null : value),
    z.string().nullable(),
  ),
});

export type FormState = {
  errors: {
    company?: string[];
    position?: string[];
    status?: string[];
    jobUrl?: string[];
    notes?: string[];
  };
};
export async function createApplication(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawData = {
    company: formData.get("company"),
    position: formData.get("position"),
    status: formData.get("status"),
    jobUrl: formData.get("jobUrl"),
    notes: formData.get("notes"),
  };

  const result = applicationSchema.safeParse(rawData);

  if (!result.success) {
    const errors = z.flattenError(result.error);

    return {
      errors: errors.fieldErrors,
    };
  }

  await prisma.application.create({
    data: result.data,
  });
  revalidatePath("/applications");
  return {
    errors: {},
  };
}





const statusUpdateSchema = z.object({
  id: z.coerce.number().positive().int(),
  status: z.string().min(3, { error: "Please enter a valid status." }),
});

export type StatusFormState = {
  errors: {
    id?: string[];
    status?: string[];
  },
  success: boolean
};

export async function updateApplicationStatus(
  _previousState: StatusFormState,
  formData: FormData,
): Promise<StatusFormState> {
  const rawData = {
    id: formData.get("id"),
    status: formData.get("status"),
  };

  const result = statusUpdateSchema.safeParse(rawData);

  if (!result.success) {
    const errors = z.flattenError(result.error);
    return {
      errors: errors.fieldErrors,
      success: false
    };
  }
  await prisma.application.update({
    where: {
      id: result.data.id,
    },
    data: {
      status: result.data.status,
    },
  });
  revalidatePath("/applications");

  return {
    errors: {},
    success: true
  };
}
