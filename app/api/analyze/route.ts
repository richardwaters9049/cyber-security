import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    // Simple validation
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Invalid file upload" },
        { status: 400 }
      );
    }

    // Process file (no longer using unused fileBuffer)
    const sizeInKB = file.size / 1024;

    return NextResponse.json({
      filename: file.name,
      size: `${sizeInKB.toFixed(2)} KB`,
      type: file.type || "unknown",
      message: "Analysis complete",
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
