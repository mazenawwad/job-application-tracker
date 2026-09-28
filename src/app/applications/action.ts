"use server";

import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";
import { auth } from "../../../auth";
import { applicationStatuses } from "@/lib/application-status";
import { applicationSchema } from "@/lib/validations/application";



export type ApplicationFormState = {
  errors: {
    company?: string[];
    position?: string[];
    status?: string[];
    jobUrl?: string[];
    notes?: string[];
    general?: string[];
  };
};
export async function createApplication(
  _previousState: ApplicationFormState,
  formData: FormData,
): Promise<ApplicationFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      errors: {
        general: ["You must be logged in to create an application."],
      },
    };
  }
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
  const currentUserId = Number(session.user.id);
  try {
    await prisma.application.create({
      data: {
        ...result.data,
        userId: currentUserId,
      },
    });
  } catch (error) {
    console.error(error);

    return {
      errors: {
        general: ["Something went wrong while creating the application."],
      },
    };
  }
  revalidatePath("/applications");
  return {
    errors: {},
  };
}

const statusUpdateSchema = z.object({
  id: z.coerce.number().positive().int(),
  status: z.enum(applicationStatuses, {
    error: "Please select a valid status.",
  }),
});

export type StatusFormState = {
  errors: {
    id?: string[];
    status?: string[];
    general?: string[];
  };
  success: boolean;
};

export async function updateApplicationStatus(
  _previousState: StatusFormState,
  formData: FormData,
): Promise<StatusFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      errors: {
        general: ["You must be logged in to update this application."],
      },
      success: false,
    };
  }
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
  const currentUserId = Number(session.user.id);

  try {
    await prisma.application.update({
      where: {
        id: result.data.id,
        userId: currentUserId,
      },
      data: {
        status: result.data.status,
      },
    });
    revalidatePath("/applications");
    revalidatePath(`/applications/${result.data.id}`);
    revalidatePath(`/applications/${result.data.id}/edit`);

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
  const session = await auth();
  if (!session?.user?.id) {
    return {
      errors: {
        general: ["You must be logged in to delete an application."],
      },
      success: false,
    };
  }
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
  const currentUserId = Number(session.user.id);

  try {
    await prisma.application.delete({
      where: {
        id: result.data.id,
        userId: currentUserId,
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
    console.error(error);
    return {
      errors: {
        general: ["Something went wrong while deleting the application."],
      },
      success: false,
    };
  }
}
