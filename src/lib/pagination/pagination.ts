import z from "zod";

export function getCurrentPage(
  page: string | undefined,
  totalPageCount: number,
) {
  const pageNumber = z.coerce.number().int().positive().safeParse(page);
  let currentPage = pageNumber.success ? pageNumber.data : 1;

  if (currentPage > totalPageCount) {
    currentPage = totalPageCount;
  }
  return currentPage;
}
