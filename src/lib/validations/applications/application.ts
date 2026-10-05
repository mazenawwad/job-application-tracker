import z from "zod";
import { applicationStatuses } from "../../application-status";

export const applicationSchema = z.object({
  company: z
    .string()
    .min(3, { error: "Please enter a valid company name." })
    .max(40),
  position: z
    .string()
    .min(3, { error: "Please enter a valid position." })
    .max(40),
  status: z.enum(applicationStatuses, {
    error: "Please select a valid status.",
  }),
  jobUrl: z.preprocess(
    (value) => (value === "" ? null : value),
    z.url({ error: "Kindly enter a valid URL." }).nullable(),
  ),
  notes: z.preprocess(
    (value) => (value === "" ? null : value),
    z.string().nullable(),
  ),
});