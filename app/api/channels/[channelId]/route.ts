import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { HttpResponseMessages, HttpResponses } from "@/lib/utils";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse(
        HttpResponseMessages[HttpResponses.UNAUTHORIZED],
        { status: HttpResponses.UNAUTHORIZED }
      );
    }

    if (!serverId) {
      return new NextResponse("Server ID Missing", {
        status: HttpResponses.BAD_REQUEST,
      });
    }

    if (!params.channelId) {
      return new NextResponse("Channel ID Missing", {
        status: HttpResponses.BAD_REQUEST,
      });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE", error);
    return new NextResponse(
      HttpResponseMessages[HttpResponses.INTERNAL_SERVER_ERROR],
      { status: HttpResponses.INTERNAL_SERVER_ERROR }
    );
  }
}
