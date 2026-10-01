import test, { expect } from "@playwright/test";
import { randomUUID } from "crypto";
import { createTestApplication } from "./helpers/create-test-application";
import { login } from "./helpers/login";

test("creates an application and it appears in the ui", async ({ page }) => {
  await login(page);
  const randomUUID = crypto.randomUUID();
  await page.goto("/applications?sort=newest");
  await page.getByLabel("Company").fill(`C ${randomUUID}`);
  await page.getByLabel("Position").fill(`P ${randomUUID}`);
  await page
    .getByLabel("JobUrl")
    .fill(`https://example.com/jobs/${randomUUID}`);
  await page.getByLabel("Notes").fill(`Notes ${randomUUID}`);
  await page.getByRole("button", { name: "Create Application" }).click();

  const applicationCard = page
    .getByRole("article")
    .filter({ hasText: `${randomUUID}` });
  await expect(applicationCard).toBeVisible();
  await expect(applicationCard.getByText(`C ${randomUUID}`)).toBeVisible();
});

test("edits an application successfully.", async ({ page }) => {
  const id = randomUUID();
  await login(page);
  const application = await createTestApplication({ page, id });
  await page.goto("/applications?sort=newest");
  const applicationCard = page
    .getByRole("article")
    .filter({ hasText: application.company });
  await applicationCard.getByRole("link", { name: "View Details" }).click();
  await page.getByRole("link", { name: "Edit" }).click();

  const updatedId = randomUUID();
  const updatedApplication = {
    company: `C ${updatedId}`,
    position: `P ${updatedId}`,
    jobUrl: `https://example.com/jobs/${updatedId}`,
    notes: `Notes ${updatedId}`,
  };
  await page.getByLabel("Company").fill(updatedApplication.company);
  await page.getByLabel("Position").fill(updatedApplication.position);
  await page.getByLabel("Status").selectOption("In Process");
  await page.getByLabel("JobUrl").fill(updatedApplication.jobUrl);
  await page.getByLabel("Notes").fill(updatedApplication.notes);

  await page.getByRole("button", { name: "Edit Application" }).click();
  await expect(page.getByText("Success!")).toBeVisible();

  await page.reload();
  await expect(page.getByLabel("Company")).toHaveValue(
    updatedApplication.company,
  );
  await expect(page.getByLabel("Position")).toHaveValue(
    updatedApplication.position,
  );
  await expect(page.getByLabel("Status")).toHaveValue("In Process");
  await expect(page.getByLabel("JobUrl")).toHaveValue(
    updatedApplication.jobUrl,
  );
  await expect(page.getByLabel("Notes")).toHaveValue(updatedApplication.notes);
});

test("deletes an application successfully", async ({ page }) => {
  await login(page);
  const id = randomUUID();
  const application = await createTestApplication({ page, id });
  const applicationCard = page
    .getByRole("article")
    .filter({ hasText: application.company });
  await applicationCard.getByRole("button", { name: "Delete" }).click();
  await applicationCard.getByRole("button", { name: "Confirm Delete" }).click();
  await page.reload();
  await expect(applicationCard).toHaveCount(0);
});
