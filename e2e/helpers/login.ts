import { expect, type Page } from "@playwright/test";

export async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("mazen@mail.com");
  await page.getByLabel("Password").fill("pass1");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL("/applications");
}
