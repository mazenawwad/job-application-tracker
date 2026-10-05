import { expect, test } from "@playwright/test";
import { nanoid } from "nanoid";

test("redirects unauthenticated users to login", async ({ page }) => {
  await page.goto("/applications");
  await expect(page).toHaveURL("/login");
});

test("logs in successfully and redirects to applications", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("test@test.com");
  await page.getByLabel("Password").fill("testpass");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL("/applications");
});

test("rejects invalid credentials and remains on login", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("wrongemail@mail.com");
  await page.getByLabel("Password").fill("randomPassword");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByText("Invalid email or password")).toBeVisible();
});

test("navigates from login to signup", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("link", { name: "here" }).click();
  await expect(page).toHaveURL("/signup");
});

test("navigates from signup to login", async ({ page }) => {
  await page.goto("/signup");
  await page.getByRole("link", { name: "Log In" }).click();
  await expect(page).toHaveURL("/login");
});

test("signs up successfully and redirects to applications", async ({
  page,
}) => {
  await page.goto("/signup");
  const id = nanoid(10);
  await page.getByLabel("Email").fill(`validemail${id}@mail.com`);
  await page.getByLabel("Password", { exact: true }).fill("Password1");
  await page.getByLabel("Confirm Password").fill("Password1");
  await page.getByRole("button", { name: "Sign Up" }).click();
  await expect(page).toHaveURL("/applications");
  await page.reload();
  await expect(page).toHaveURL("/applications");
});

test("rejects mismatched passwords and remains on signup", async ({ page }) => {
  await page.goto("/signup");
  const id = nanoid(10);
  await page.getByLabel("Email").fill(`valid${id}@mail.com`);
  await page.getByLabel("Password", { exact: true }).fill("Password1");
  await page.getByLabel("Confirm Password").fill("Password2");
  await page.getByRole("button", { name: "Sign Up" }).click();
  await expect(page.getByText("Passwords do not match.")).toBeVisible();
  await expect(page).toHaveURL("/signup");
});

test("prevents duplicate emails", async ({ page }) => {
  await page.goto("/signup");
  const id = nanoid(10);
  await page.getByLabel("Email").fill(`valid${id}@mail.com`);
  await page.getByLabel("Password", { exact: true }).fill("Password1");
  await page.getByLabel("Confirm Password").fill("Password1");
  await page.getByRole("button", { name: "Sign Up" }).click();
  await expect(page).toHaveURL("/applications");
  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page).toHaveURL("/login");
  await page.goto("/signup");
  await page.getByLabel("Email").fill(`valid${id}@mail.com`);
  await page.getByLabel("Password", { exact: true }).fill("Password1");
  await page.getByLabel("Confirm Password").fill("Password1");
  await page.getByRole("button", { name: "Sign Up" }).click();
  await expect(page.getByText("This email is already taken.")).toBeVisible();
  await expect(page).toHaveURL("/signup");
});
