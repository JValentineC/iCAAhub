import prisma from "@/lib/postgres/db";
import { NextResponse } from "next/server";

interface Announcement {
  title: string;
  content: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const res: Announcement = await request.json();

    // Validate request body
    if (!res.title || !res.content) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 }
      );
    }

    const { title, content } = res;

    // Always post as admin user with user_id = 9
    const adminUserId = 1;

    // TODO: In the future, replace the hardcoded adminUserId with the ID of the currently logged-in user.
    // Example:
    // const currentUser = await getCurrentUser(); // Implement a function to get the logged-in user
    // const userId = currentUser?.id || adminUserId; // Fallback to adminUserId if no user is logged in

    // Create the post with the admin user as the author
    const result = await prisma.post.create({
      data: {
        title,
        content,
        published: true,
        authorId: adminUserId, // Replace this with `userId` when dynamic user logic is implemented
        created_at: new Date(),
      },
    });

    return NextResponse.json({ result }, { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
