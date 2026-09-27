import { applicationStatuses } from "@/lib/application-status";
import prisma from "@/lib/prisma";

interface Props {
  currentUserId: number;
}
export default async function ApplicationStatistics({ currentUserId }: Props) {

  const applicationsByStatus = await prisma.application.groupBy({
    by: ["status"],
    where: {
      userId: currentUserId,
    },
    _count: {
      id: true,
    },
  });
  const statusCounts = applicationStatuses.map((status) => {
    const matchingGroup = applicationsByStatus.find(
      (group) => group.status === status,
    );
    return {
      status,
      count: matchingGroup?._count.id ?? 0,
    };
  });
  return (
    <section className="lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-5 flex flex-col">
      {statusCounts.map((statusCount) => (
        <div
          className="bg-white text-black border rounded-lg flex flex-col gap-3 p-6"
          key={statusCount.status}
        >
          <span className="text-xl">{statusCount.status}</span>
          <span className="font-bold text-2xl">{statusCount.count}</span>
        </div>
      ))}
    </section>
  );
}
