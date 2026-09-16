import prisma from "@/lib/prisma";
import { auth } from "../../../auth";
import ApplicationForm from "./_components/ApplicationForm";
import ApplicationStatus from "./_components/ApplicationStatus";
import DeleteApplication from "./_components/DeleteApplication";
import { redirect } from "next/navigation";
import LogoutButton from "./_components/LogoutButton";
import Link from "next/link";

export default async function ApplicationsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  const currentUserId = Number(session.user.id);
  const applications = await prisma.application.findMany({
    where: {
      userId: currentUserId,
    },
  });
  return (
    <main className="flex w-full flex-col items-center gap-5">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Applications</h1>
        <LogoutButton />
      </div>
      <section className="flex w-full max-w-2xl flex-col gap-5">
        {applications.length > 0 ? (
          applications.map((application) => (
            <article
              key={application.id}
              className="flex flex-col gap-2 rounded-2xl  bg-white p-5 text-black"
            >
              <Link className="px-2 py-1 rounded-full w-fit bg-green-700 text-white" href={`/applications/${application.id}`}>View details</Link>
              <p>
                <strong>Applied to:</strong> {application.company}
              </p>

              <p>
                <strong>Position:</strong> {application.position}
              </p>
              <ApplicationStatus
                id={application.id}
                status={application.status}
              />
              <div className="flex justify-end gap-3">
                <DeleteApplication id={application.id} />
              </div>
            </article>
          ))
        ) : (
          <div>No Applications Yet.</div>
        )}
      </section>
      <ApplicationForm />
    </main>
  );
}
