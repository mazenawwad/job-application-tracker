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
import z from "zod";
import ApplicationStatistics from "./_components/ApplicationStatistics";
import { Suspense } from "react";
import ApplicationStatisticsSkeleton from "./_components/ApplicationStatisticsSkeleton";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const { q, status, sort, page } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  const currentUserId = Number(session.user.id);

  const where: Prisma.ApplicationWhereInput = {
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
  };

  function createPageUrl(pageNumber: number) {
    const params = new URLSearchParams();

    if (q) {
      params.set("q", q);
    }
    if (status) {
      params.set("status", status);
    }
    if (sort) {
      params.set("sort", sort);
    }
    params.set("page", String(pageNumber));
    return `/applications?${params.toString()}`;
  }

  const totalMatchingApplications = await prisma.application.count({
    where,
  });

  const totalUserApplications = await prisma.application.count({
    where: {
      userId: currentUserId,
    },
  });

  const pageSize = 5;
  const totalPageCount = Math.max(
    Math.ceil(totalMatchingApplications / pageSize),
    1,
  );

  const pageNumber = z.coerce.number().int().positive().safeParse(page);
  let currentPage = pageNumber.success ? pageNumber.data : 1;

  if (currentPage > totalPageCount) {
    currentPage = totalPageCount;
  }
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPageCount;

  const skipNumber = (currentPage - 1) * pageSize;

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
  const applications = await prisma.application.findMany({
    where,
    orderBy,
    skip: skipNumber,
    take: pageSize,
  });
  return (
    <main className="flex w-full flex-col items-center gap-5">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">
          Applications: {totalUserApplications}
        </h1>
        <LogoutButton />
      </div>
      <Suspense fallback={<ApplicationStatisticsSkeleton />}>
        <ApplicationStatistics currentUserId={currentUserId} />
      </Suspense>
      <section className="flex w-full max-w-2xl flex-col gap-5">
        <div className="flex justify-between w-full">
          {hasPreviousPage && (
            <Link href={createPageUrl(currentPage - 1)}>Previous</Link>
          )}
          <span>
            Page {currentPage} of {totalPageCount}
          </span>
          {hasNextPage && (
            <Link href={createPageUrl(currentPage + 1)}>Next</Link>
          )}
        </div>
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
