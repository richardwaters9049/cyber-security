import type { AnalysisResult } from "@/types/analysis";

export function assertAnalysisResult(
  data: unknown
): asserts data is AnalysisResult {
  if (
    !data ||
    typeof data !== "object" ||
    !("filename" in data) ||
    !("analysis_id" in data) ||
    !("report" in data)
  ) {
    throw new Error("Invalid analysis result format");
  }
}
