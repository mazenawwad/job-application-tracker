import { expect, type Page } from "@playwright/test";

export async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("test@test.com");
  await page.getByLabel("Password").fill("testpass");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL("/applications");
}
