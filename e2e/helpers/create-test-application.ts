import { applicationStatuses } from "@/lib/application-status";
import { expect, Page } from "@playwright/test";

interface CreateApplicationProps {
  page: Page;
  id: string;
  company?: string;
  position?: string;
  status?: string;
  jobUrl?: string;
  notes?: string;
}

export async function createTestApplication({
  page,
  id,
  company,
  position,
  status,
  jobUrl,
  notes,
}: CreateApplicationProps) {
  const application = {
    company: company ?? `C ${id}`,
    position: position ?? `P ${id}`,
    status: status ?? applicationStatuses[0],
    jobUrl: jobUrl ?? `https://example.com/jobs/${id}`,
    notes: notes ?? `Notes ${id}`,
  };

  await page.goto("/applications?sort=newest");
  await page.getByLabel("Company").fill(application.company);
  await page.getByLabel("Position").fill(application.position);
  await page
    .getByLabel("Status", { exact: true })
    .selectOption(application.status);
  await page.getByLabel("JobUrl").fill(application.jobUrl);
  await page.getByLabel("Notes").fill(application.notes);
  await page.getByRole("button", { name: "Create Application" }).click();

  await expect(
    page.getByRole("article").filter({
      hasText: application.company,
    }),
  ).toHaveCount(1);

  return application;
}
