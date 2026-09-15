import prisma from "@/lib/prisma";
import ApplicationForm from "./_components/ApplicationForm";
import ApplicationStatus from "./_components/ApplicationStatus";
import DeleteApplication from "./_components/DeleteApplication";
import { currentUserId } from "@/lib/current-user";
import { auth } from "../../../auth";

export default async function ApplicationsPage() {
  const applications = await prisma.application
  .findMany({
    where: {
      userId : currentUserId
    }
  });
  const session = await auth();
  console.log(session);  
  return (
    <main className="flex w-full flex-col items-center gap-5">
      <h1 className="text-3xl font-bold">Applications</h1>

      <section className="flex w-full max-w-2xl flex-col gap-5">
        {applications.length > 0 ? (
          applications.map((application) => (
            <article
              key={application.id}
              className="flex flex-col gap-2 rounded-2xl  bg-white p-5 text-black"
            >
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
