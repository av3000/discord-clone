import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { HttpResponseMessages, HttpResponses } from "@/lib/utils";
import prisma from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
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

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", {
        status: HttpResponses.BAD_REQUEST,
      });
    }

    const serverWithNewChannel = await prisma.server.update({
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
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(serverWithNewChannel);
  } catch (error) {
    console.log("CHANNELS_POST", error);
    return new NextResponse(
      HttpResponseMessages[HttpResponses.INTERNAL_SERVER_ERROR],
      { status: HttpResponses.INTERNAL_SERVER_ERROR }
    );
  }
}
