import { notFound, redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import prisma from "@/lib/prisma";
import z from "zod";
import EditApplicationForm from "./_components/EditApplicationForm";

const applicationIdSchema = z.coerce.number().int().positive();

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  const currentUserId = Number(session.user.id);
  const { id } = await params;
  const applicationId = applicationIdSchema.safeParse(id);
  if (!applicationId.success) {
    notFound();
  }

  const application = await prisma.application.findUnique({
    where: {
      id: applicationId.data,
      userId: currentUserId,
    },
  });
  if (!application) {
    notFound();
  }
  return (
    <div>
      <h1>Edit {application.company}</h1>
      <EditApplicationForm
        company={application.company}
        id={application.id}
        jobUrl={application.jobUrl}
        notes={application.notes}
        position={application.position}
        status={application.status}
        key={application.id}
      />
    </div>
  );
}
