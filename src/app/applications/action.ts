"use server";

import { Prisma } from "@/generated/prisma/client";
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

export type ApplicationFormState = {
  errors: {
    company?: string[];
    position?: string[];
    status?: string[];
    jobUrl?: string[];
    notes?: string[];
  };
};
export async function createApplication(
  _previousState: ApplicationFormState,
  formData: FormData,
): Promise<ApplicationFormState> {
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
  };
  success: boolean;
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
      success: false,
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
    success: true,
  };
}

export type ApplicationDeleteFormState = {
  errors: {
    id?: string[];
    general?: string[];
  };
  success: boolean;
};

const invalidIdMessage = "This isn't a valid ID.";
const applicationDeleteSchema = z.object({
  id: z
    .number({ error: invalidIdMessage })
    .positive({ error: invalidIdMessage })
    .int({ error: invalidIdMessage }),
});

export async function deleteApplication(
  applicationId: number,
): Promise<ApplicationDeleteFormState> {
  const rawData = {
    id: applicationId,
  };
  const result = applicationDeleteSchema.safeParse(rawData);

  if (!result.success) {
    const errors = z.flattenError(result.error);
    return {
      errors: {
        id: errors.fieldErrors.id,
      },
      success: false,
    };
  }
  try {
    await prisma.application.delete({
      where: {
        id: result.data.id,
      },
    });
    revalidatePath("/applications");
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
    return {
      errors: {
        general: ["Something went wrong while deleting the application."],
      },
      success: false,
    };
  }
}
