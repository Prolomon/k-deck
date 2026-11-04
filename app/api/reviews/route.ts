import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    const reviews = await DataStore.getReviews(!all);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch platform reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      role,
      company,
      serviceUsed,
      rating,
      title,
      comment,
      recommend,
    } = body;

    if (!name || !serviceUsed || !title || !comment) {
      return NextResponse.json(
        { error: "Name, service used, review title, and detailed feedback are required." },
        { status: 400 }
      );
    }

    const parsedRating = Math.min(5, Math.max(1, Number(rating || 5)));

    const review = await DataStore.createReview({
      name,
      email,
      role,
      company,
      serviceUsed,
      rating: parsedRating,
      title,
      comment,
      recommend: recommend ?? true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your review has been recorded.",
        review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
