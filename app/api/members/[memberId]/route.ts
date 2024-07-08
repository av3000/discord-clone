import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { HttpResponseMessages, HttpResponses } from "@/lib/utils";

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
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

    if (!params.memberId) {
      return new NextResponse("Member ID Missing", {
        status: HttpResponses.BAD_REQUEST,
      });
    }

    const updatedServer = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(updatedServer);
  } catch (error) {
    console.log("[MEMBER_ID_DELETE]", error);
    return new NextResponse(
      HttpResponseMessages[HttpResponses.INTERNAL_SERVER_ERROR],
      { status: HttpResponses.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

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

    if (!params.memberId) {
      return new NextResponse("Member ID Missing", {
        status: HttpResponses.BAD_REQUEST,
      });
    }

    const updatedServer = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(updatedServer);
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error);
    return new NextResponse(
      HttpResponseMessages[HttpResponses.INTERNAL_SERVER_ERROR],
      { status: HttpResponses.INTERNAL_SERVER_ERROR }
    );
  }
}
