
export default function ApplicationStatisticsSkeleton() {
  return (
    <section className="lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-5 flex flex-col">
      {Array.from({length: 5}).map((_, index) => (
        <div className="w-full bg-white min-w-45 border rounded-lg flex flex-col gap-3 p-6 animate-pulse" key={index}>
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-8 bg-gray-200 rounded w-1/4" />
        </div>
      ))}
    </section>
  );
}