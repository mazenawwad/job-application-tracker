import { describe, expect, it } from "vitest";
import { getCurrentPage } from "./pagination";

describe("getCurrentPage", () => {
  it("returns the requested page when it is valid and within the total page count", () => {
    const currentPage = getCurrentPage("5", 10);
    expect(currentPage).toBe(5);
  });

  it("returns the requested page when it equals the total page count", () => {
  const currentPage = getCurrentPage("10", 10);

  expect(currentPage).toBe(10);
});
  
  it.each([
    ["page number is missing", undefined],
    ["page number is empty", ""],
    ["page number is zero", "0"],
    ["page number is not a number", "abc"],
    ["page number is negative", "-1"],
    ["page number is a decimal", "1.5"],
  ])("returns page 1 if %s", (_description, page)=>{
    const currentPage = getCurrentPage(page, 10);
    expect(currentPage).toBe(1)
  })

  it("returns last page when the requested page exceeds the total page count", ()=>{
    const currentPage = getCurrentPage("11", 10);
    expect(currentPage).toBe(10);
  })

  
});
