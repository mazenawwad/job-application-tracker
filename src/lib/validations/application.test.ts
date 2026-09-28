import { describe, expect, it } from "vitest";
import { applicationSchema } from "./application";

const baseValidApplication = {
  company: "Google",
  position: "Frontend Developer",
  status: "Newly Applied",
  jobUrl: "https://example.com/job",
  notes: "Applied through careers page",
};
describe("applicationSchema", () => {
  it("accepts a valid application.", () => {
    const applicationData = applicationSchema.safeParse(baseValidApplication);
    expect(applicationData.success).toBe(true);
  });

  it.each([
    ["company shorter than 3 chars", "company", "go"],
    ["company longer than 40 chars", "company", "a".repeat(41)],
    ["position shorter than 3 chars", "position", "go"],
    ["position longer than 40 chars", "position", "a".repeat(41)],
  ])("rejects %s", (_description, applicationField, value) => {
    const invalidApplication = {
      ...baseValidApplication,
      [applicationField]: value,
    };

    const result = applicationSchema.safeParse(invalidApplication);

    expect(result.success).toBe(false);
  });

  it.each([
    ["3-char company", "company", "abc"],
    ["40-char company", "company", "a".repeat(40)],
    ["3-char position", "position", "abc"],
    ["40-char position", "position", "a".repeat(40)],
  ])("accepts %s", (_description, applicationField, value) => {
    const boundaryApplication = {
      ...baseValidApplication,
      [applicationField]: value,
    };

    const result = applicationSchema.safeParse(boundaryApplication);

    expect(result.success).toBe(true);
  });

  it("rejects an application with an invalid status", () => {
    const invalidApplication = {
      ...baseValidApplication,
      status: "notInStatusList",
    };
    const applicationData = applicationSchema.safeParse(invalidApplication);
    expect(applicationData.success).toBe(false);
  });

  it("rejects an application with an invalid url", () => {
    const invalidApplication = {
      ...baseValidApplication,
      jobUrl: "mainnotvalidurl.com",
    };
    const applicationData = applicationSchema.safeParse(invalidApplication);
    expect(applicationData.success).toBe(false);
  });

  it("turns empty jobUrl string into null", () => {
    const applicationWithEmptyUrl = {
      ...baseValidApplication,
      jobUrl: "",
    };
    const applicationData = applicationSchema.parse(applicationWithEmptyUrl);
    expect(applicationData.jobUrl).toBe(null);
  });

  it("turns empty notes string into null", () => {
    const applicationWithEmptyNotes = {
      ...baseValidApplication,
      notes: "",
    };
    const applicationData = applicationSchema.parse(applicationWithEmptyNotes);
    expect(applicationData.notes).toBe(null);
  });
});
