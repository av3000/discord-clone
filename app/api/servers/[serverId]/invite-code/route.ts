import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { currentProfile } from "@/lib/current-profile";
import prisma from "@/lib/db";
import { HttpResponseMessages, HttpResponses } from "@/lib/utils";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse(
        HttpResponseMessages[HttpResponses.UNAUTHORIZED],
        { status: HttpResponses.UNAUTHORIZED }
      );
    }

    if (!params.serverId) {
      return new NextResponse("Server ID Missing", {
        status: HttpResponses.BAD_REQUEST,
      });
    }

    const server = await prisma.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID]", error);
    return new NextResponse(
      HttpResponseMessages[HttpResponses.INTERNAL_SERVER_ERROR],
      { status: HttpResponses.INTERNAL_SERVER_ERROR }
    );
  }
}
