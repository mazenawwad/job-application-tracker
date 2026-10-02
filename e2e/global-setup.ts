import { execSync } from "node:child_process";

export default async function globalSetup() {
  execSync("npx tsx scripts/reset-e2e.ts", {
    stdio: "inherit",
    env: process.env,
  });
}