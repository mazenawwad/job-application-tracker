import { expect, test } from "@playwright/test";
import { login } from "./helpers/login";

test("redirects unauthenticated users to login", async ({ page }) => {
  await page.goto("/applications");
  await expect(page).toHaveURL("/login");
});

test("logs in successfully and redirects to applications", async ({ page }) => {
  await login(page);
});

test("rejects invalid credentials and remains on login", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("wrongemail@mail.com");
  await page.getByLabel("Password").fill("randomPassword");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByText("Invalid email or password")).toBeVisible();
});
