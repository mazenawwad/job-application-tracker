import { notFound, redirect } from "next/navigation";
import { auth } from "../../../../auth";
import prisma from "@/lib/prisma";
import z from "zod";
import Link from "next/link";

const applicationIdSchema = z.coerce.number().int().positive();

export default async function ApplicationDetailsPage({
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
    return notFound();
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
    <div className="flex flex-col items-center justify-start gap-3 max-w-2xl">
      <label htmlFor="edit" className="sr-only">Edit</label>
      <Link id="edit" href={`/applications/${application.id}/edit`}>Edit</Link>
      <p>{application.company}</p>
      <p>{application.position}</p>
      <p>{application.status}</p>
      <p>{application.jobUrl}</p>
      <p>{application.notes}</p>
      <p>{application.createdAt.toLocaleDateString()}</p>
    </div>
  );
}
