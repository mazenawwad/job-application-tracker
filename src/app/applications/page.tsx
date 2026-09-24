import prisma from "@/lib/prisma";
import { auth } from "../../../auth";
import ApplicationForm from "./_components/ApplicationForm";
import ApplicationStatus from "./_components/ApplicationStatus";
import DeleteApplication from "./_components/DeleteApplication";
import { redirect } from "next/navigation";
import LogoutButton from "./_components/LogoutButton";
import Link from "next/link";
import { applicationStatuses } from "@/lib/application-status";
import { sortOptions } from "@/lib/sort-option";
import { Prisma } from "@/generated/prisma/client";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    sort?: string;
  }>;
}) {
  const { q, status, sort } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

let orderBy: Prisma.ApplicationOrderByWithRelationInput | undefined;
  switch (sort) {
    case "newest":
      orderBy = { createdAt: "desc" };
      break;

    case "oldest":
      orderBy = { createdAt: "asc" };
      break;

    case "company-asc":
      orderBy = { company: "asc" };
      break;

    case "company-desc":
      orderBy = { company: "desc" };
      break;
  }
  const currentUserId = Number(session.user.id);
  const applications = await prisma.application.findMany({
    where: {
      userId: currentUserId,
      ...(q && {
        OR: [
          {
            position: { contains: q, mode: "insensitive" },
          },
          {
            company: { contains: q, mode: "insensitive" },
          },
        ],
      }),
      ...(status && { status }),
    },
    orderBy,
  });
  return (
    <main className="flex w-full flex-col items-center gap-5">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Applications</h1>
        <LogoutButton />
      </div>
      <section className="flex w-full max-w-2xl flex-col gap-5">
        <form>
          <input
            name="q"
            placeholder="Search Applications..."
            defaultValue={q}
          />
          <select name="status" defaultValue={status ?? ""}>
            <option value="">All Statuses</option>
            {applicationStatuses.map((applicationStatus) => (
              <option
                className="text-black active:text-red-900"
                key={applicationStatus}
                value={applicationStatus}
              >
                {applicationStatus}
              </option>
            ))}
          </select>
          <select name="sort" defaultValue={sort ?? ""}>
            <option value="" disabled hidden>
              Sort by:
            </option>
            {sortOptions.map((sortOption) => (
              <option
                key={sortOption.value}
                value={sortOption.value}
                className="text-black active:text-red-900"
              >
                {sortOption.label}
              </option>
            ))}
          </select>
          <button type="submit"> Search</button>
        </form>
        {applications.length > 0 ? (
          applications.map((application) => (
            <article
              key={application.id}
              className="flex flex-col gap-2 rounded-2xl  bg-white p-5 text-black"
            >
              <Link
                className="px-2 py-1 rounded-full w-fit bg-green-700 text-white"
                href={`/applications/${application.id}`}
              >
                View details
              </Link>
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
