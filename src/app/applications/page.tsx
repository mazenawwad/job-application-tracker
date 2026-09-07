import prisma from "@/lib/prisma";
import ApplicationForm from "./_components/ApplicationForm";

export default async function ApplicationsPage() {

  const applications = await prisma.application.findMany();

  return (
    <main className="flex w-full flex-col items-center gap-5">
      <h1 className="text-3xl font-bold">Applications</h1>

      <section className="flex w-full max-w-2xl flex-col gap-5">
        {applications.length > 0 ? applications.map((application) => (
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

            <p>
              <strong>Status:</strong> {application.status}
            </p>
          </article>
        )) : 
        <div>
          No Applications Yet.
          </div>}
      </section>
        <ApplicationForm />
    </main>
  );
}