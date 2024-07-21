import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { HttpResponseMessages, HttpResponses } from "@/lib/utils";
import { Message, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGE_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse(
        HttpResponseMessages[HttpResponses.UNAUTHORIZED],
        { status: HttpResponses.UNAUTHORIZED }
      );
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", {
        status: HttpResponses.BAD_REQUEST,
      });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGE_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
      });
    }

    let nextCursor = null;
    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[MESSAGE_BATCH - 1].id;
    }

    return NextResponse.json({
      currentMessages: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("[MESSAGES_GET]", error);
    return new NextResponse(
      HttpResponseMessages[HttpResponses.INTERNAL_SERVER_ERROR],
      { status: HttpResponses.INTERNAL_SERVER_ERROR }
    );
  }
}
