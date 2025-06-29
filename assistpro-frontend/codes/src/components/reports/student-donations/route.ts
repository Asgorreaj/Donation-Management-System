import { NextResponse } from "next/server";
import { assistProApiFetch } from "@/helpers/httpClient";

export async function GET() {
  try {
    const response = await assistProApiFetch('reports/student-donations', { method: "GET" });
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch report data" },
      { status: 500 }
    );
  }
}