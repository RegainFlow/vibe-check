import { NextResponse } from "next/server";
import { ANALYSIS_CATEGORIES, type AnalysisCategory } from "@/lib/constants";
import { getRecommendedSkills } from "@/lib/skills/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;

  if (!ANALYSIS_CATEGORIES.includes(category as AnalysisCategory)) {
    return NextResponse.json(
      { error: `Invalid category: ${category}` },
      { status: 400 }
    );
  }

  const result = await getRecommendedSkills(category as AnalysisCategory);
  return NextResponse.json(result);
}
