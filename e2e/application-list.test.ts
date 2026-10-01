import { applicationStatuses } from "@/lib/application-status";
import { expect, test } from "@playwright/test";
import { nanoid } from "nanoid";
import { createTestApplication } from "./helpers/create-test-application";
import { login } from "./helpers/login";

test("return companies with matching name", async ({ page }) => {
  await login(page);
  const id = nanoid(10);
  const firstApplication = await createTestApplication({
    page,
    id,
    company: `Alpha <${id}>`,
    position: "FrontEnd Dev",
  });
  const secondApplication = await createTestApplication({
    page,
    id,
    company: `Beta <${id}>`,
    position: "BackEnd Dev",
  });
  const firstApplicationCard = page
    .getByRole("article")
    .filter({ hasText: firstApplication.company });
  const secondApplicationCard = page
    .getByRole("article")
    .filter({ hasText: secondApplication.company });

  await page.getByLabel("Search").fill(firstApplication.company);
  await page.getByRole("button", { name: "Search" }).click();
  await expect(firstApplicationCard).toHaveCount(1);
  await expect(secondApplicationCard).toHaveCount(0);
});

test("return companies with matching position", async ({ page }) => {
  await login(page);
  const id = nanoid(10);
  const firstApplication = await createTestApplication({
    page,
    id,
    company: `Alpha <${id}>`,
    position: `Frontend <${id}>`,
  });
  const secondApplication = await createTestApplication({
    page,
    id,
    company: `Beta <${id}>`,
    position: `Backend <${id}>`,
  });
  const firstApplicationCard = page
    .getByRole("article")
    .filter({ hasText: firstApplication.position });
  const secondApplicationCard = page
    .getByRole("article")
    .filter({ hasText: secondApplication.position });

  await page.getByLabel("Search").fill(firstApplication.position);
  await page.getByRole("button", { name: "Search" }).click();

  await expect(firstApplicationCard).toHaveCount(1);
  await expect(secondApplicationCard).toHaveCount(0);
});

test("return nothing if there are no applications with matching companies or positions", async ({
  page,
}) => {
  await login(page);
  const id = nanoid(10);
  await page.getByLabel("Search").fill(id);
  await page.getByRole("button", { name: "Search" }).click();
  const applicationCard = page.getByRole("article").filter({ hasText: id });
  await expect(applicationCard).toHaveCount(0);
  await expect(page.getByText("No Applications Yet.")).toBeVisible();
});

test("search returns results case-insensitively", async ({ page }) => {
  await login(page);
  const id = nanoid(10);
  const firstApplication = await createTestApplication({
    page,
    id,
    company: `ALPHA <${id}>`,
    position: "Frontend Dev",
  });
  const firstApplicationCard = page
    .getByRole("article")
    .filter({ hasText: firstApplication.company });
  await page
    .getByLabel("Search")
    .fill(firstApplication.company.toLocaleLowerCase());
  await page.getByRole("button", { name: "Search" }).click();

  await expect(firstApplicationCard).toHaveCount(1);
});

test("status filter only returns matching applications", async ({ page }) => {
  await login(page);
  const id = nanoid(10);
  const firstApplication = await createTestApplication({
    page,
    id,
    company: `Alpha <${id}>`,
    status: applicationStatuses[0],
  });
  const secondApplication = await createTestApplication({
    page,
    id,
    company: `Beta <${id}>`,
    status: applicationStatuses[1],
  });

  await page.getByLabel("Search").fill(id);
  await page.getByLabel("StatusFilter").selectOption(firstApplication.status);
  await page.getByRole("button", { name: "Search" }).click();

  const firstApplicationCard = page
    .getByRole("article")
    .filter({ hasText: firstApplication.company });
  const secondApplicationCard = page
    .getByRole("article")
    .filter({ hasText: secondApplication.company });

  await expect(firstApplicationCard).toHaveCount(1);
  await expect(secondApplicationCard).toHaveCount(0);
});

test("search and status filter work together", async ({ page }) => {
  await login(page);

  const id = nanoid(10);

  const matchingApplication = await createTestApplication({
    page,
    id,
    company: `Alpha <${id}>`,
    status: applicationStatuses[0],
  });

  const wrongStatusApplication = await createTestApplication({
    page,
    id,
    company: `Beta <${id}>`,
    status: applicationStatuses[1],
  });

  const wrongSearchApplication = await createTestApplication({
    page,
    id: nanoid(10),
    company: "Gamma",
    status: applicationStatuses[0],
  });

  await page.getByLabel("Search").fill(id);
  await page.getByLabel("StatusFilter").selectOption(applicationStatuses[0]);

  await page.getByRole("button", { name: "Search" }).click();

  await expect(
    page.getByRole("article").filter({
      hasText: matchingApplication.company,
    }),
  ).toHaveCount(1);

  await expect(
    page.getByRole("article").filter({
      hasText: wrongStatusApplication.company,
    }),
  ).toHaveCount(0);

  await expect(
    page.getByRole("article").filter({
      hasText: wrongSearchApplication.company,
    }),
  ).toHaveCount(0);
});

test("sorts applications by date and company  ", async ({ page }) => {
  await login(page);
  const id = nanoid(10);

  const firstApplication = await createTestApplication({
    page,
    id,
    company: `A ${id}`,
  });
  const secondApplication = await createTestApplication({
    page,
    id,
    company: `Z ${id}`,
  });

  const cards = page.getByRole("article");
  await page.goto(`/applications?q=${id}&sort=newest`);

  //already filtered to newest
  await expect(cards.nth(1)).toContainText(firstApplication.company);
  await expect(cards.nth(0)).toContainText(secondApplication.company);

  await page.goto(`/applications?q=${id}&sort=oldest`);

  await expect(cards.nth(0)).toContainText(firstApplication.company);
  await expect(cards.nth(1)).toContainText(secondApplication.company);

  await page.goto(`/applications?q=${id}&sort=company-asc`);

  await expect(cards.nth(0)).toContainText(firstApplication.company);
  await expect(cards.nth(1)).toContainText(secondApplication.company);

  await page.goto(`/applications?q=${id}&sort=company-desc`);

  await expect(cards.nth(1)).toContainText(firstApplication.company);
  await expect(cards.nth(0)).toContainText(secondApplication.company);
});

test("search, status and filter all work together", async ({ page }) => {
  await login(page);
  const id = nanoid(10);

  const correctApplication = await createTestApplication({
    page,
    id,
    company: `A ${id}`,
  });
  const wrongStatusApplication = await createTestApplication({
    page,
    id,
    company: `W ${id}`,
    status: applicationStatuses[1],
  });
  const matchingApplication = await createTestApplication({
    page,
    id,
    company: `Z ${id}`,
  });

  const firstApplicationCard = page
    .getByRole("article")
    .filter({ hasText: correctApplication.company });
  const secondApplicationCard = page
    .getByRole("article")
    .filter({ hasText: wrongStatusApplication.company });
  const thirdApplicationCard = page
    .getByRole("article")
    .filter({ hasText: matchingApplication.company });

  const params = new URLSearchParams({
    q: id,
    status: applicationStatuses[0],
    sort: "newest",
  });
  await page.goto(`/applications?${params}`);
  await expect(firstApplicationCard).toHaveCount(1);
  await expect(secondApplicationCard).toHaveCount(0);
  await expect(thirdApplicationCard).toHaveCount(1);

  const cards = page.getByRole("article");
  await expect(cards.nth(0)).toContainText(matchingApplication.company);
  await expect(cards.nth(1)).toContainText(correctApplication.company);
});
test("verify the pagination of the applications", async ({ page }) => {
  await login(page);
  const id = nanoid(5);
  const firstApplication = await createTestApplication({
    page,
    id,
    company: `E2E ${id} -1-`,
  });
  const secondApplication = await createTestApplication({
    page,
    id,
    company: `E2E ${id} -2-`,
  });
  const thirdApplication = await createTestApplication({
    page,
    id,
    company: `E2E ${id} -3-`,
  });
  const fourthApplication = await createTestApplication({
    page,
    id,
    company: `E2E ${id} -4-`,
  });
  const fifthApplication = await createTestApplication({
    page,
    id,
    company: `E2E ${id} -5-`,
  });
  const sixthApplication = await createTestApplication({
    page,
    id,
    company: `E2E ${id} -6-`,
  });

  const params = new URLSearchParams({
    q: `E2E ${id}`,
    sort: "company-asc",
    page: "1",
  });
  await page.goto(`/applications?${params}`);
  await expect(
    page.getByRole("article").getByText(firstApplication.company),
  ).toHaveCount(1);
  await expect(
    page.getByRole("article").getByText(secondApplication.company),
  ).toHaveCount(1);
  await expect(
    page.getByRole("article").getByText(thirdApplication.company),
  ).toHaveCount(1);
  await expect(
    page.getByRole("article").getByText(fourthApplication.company),
  ).toHaveCount(1);
  await expect(
    page.getByRole("article").getByText(fifthApplication.company),
  ).toHaveCount(1);
  await expect(
    page.getByRole("article").getByText(sixthApplication.company),
  ).toHaveCount(0);

  await page.getByRole("link", { name: "Next" }).click();
  params.set("page", "2");
  await expect(page).toHaveURL(`/applications?${params}`);
  await expect(
    page.getByRole("article").getByText(firstApplication.company),
  ).toHaveCount(0);
  await expect(
    page.getByRole("article").getByText(secondApplication.company),
  ).toHaveCount(0);
  await expect(
    page.getByRole("article").getByText(thirdApplication.company),
  ).toHaveCount(0);
  await expect(
    page.getByRole("article").getByText(fourthApplication.company),
  ).toHaveCount(0);
  await expect(
    page.getByRole("article").getByText(fifthApplication.company),
  ).toHaveCount(0);
  await expect(
    page.getByRole("article").getByText(sixthApplication.company),
  ).toHaveCount(1);

  params.set("page", "1");
  await page.getByRole("link", { name: "Previous" }).click();
  await expect(page).toHaveURL(`/applications?${params}`);
  await expect(
    page.getByRole("article").getByText(firstApplication.company),
  ).toHaveCount(1);
  await expect(
    page.getByRole("article").getByText(secondApplication.company),
  ).toHaveCount(1);
  await expect(
    page.getByRole("article").getByText(thirdApplication.company),
  ).toHaveCount(1);
  await expect(
    page.getByRole("article").getByText(fourthApplication.company),
  ).toHaveCount(1);
  await expect(
    page.getByRole("article").getByText(fifthApplication.company),
  ).toHaveCount(1);
  await expect(
    page.getByRole("article").getByText(sixthApplication.company),
  ).toHaveCount(0);
});

test("changing pages maintains queries", async ({ page }) => {
  await login(page);
  const id = nanoid(10);
  for (let i = 1; i < 7; i++) {
    await createTestApplication({
      page,
      id,
      company: `M ${id} ${i} `,
    });
  }
  const params = new URLSearchParams({
    q: id,
    status: applicationStatuses[0],
    sort: "newest",
    page: "1",
  });
  await page.goto(`/applications?${params}`);
  await expect(page.getByText("Page 1 of 2")).toBeVisible();
  await page.getByRole("link", { name: "Next" }).click();
  await expect(page.getByText("Page 2 of 2")).toBeVisible();
  params.set("page", "2");
  await expect(page).toHaveURL(`/applications?${params}`);
});

test("clamps an excessive page number to the last page", async ({ page }) => {
  await login(page);
  const id = nanoid(10);
  for (let i = 1; i < 7; i++) {
    await createTestApplication({
      page,
      id,
      company: `Pagination ${id} ${i} `,
    });
  }
  const params = new URLSearchParams({
    q: id,
    sort: "newest",
    page: "1",
  });
  await page.goto(`/applications?${params}`);
  await expect(page.getByText("Page 1 of 2")).toBeVisible();
  params.set("page", "5");
  await page.goto(`/applications?${params}`);
  await expect(page.getByText("Page 2 of 2")).toBeVisible();
});
