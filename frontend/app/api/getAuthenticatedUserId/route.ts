import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { userId, sessionId } = await auth();
  if (!sessionId) {
    return NextResponse.json({ id: null }, { status: 401 });
  }
  return NextResponse.json({ id: userId }, { status: 200 });
}
