import { NextApiRequest } from "next";

import { Profile } from "@prisma/client";

import { NextApiResponseServerIO } from "@/types";
import { HttpResponseMessages, HttpResponses } from "@/lib/utils";
import { db } from "@/lib/db";
import { currentProfilePages } from "@/lib/current-profile-pages";

interface MessageRequestProp {
  profile: Profile | null;
  serverId: string | string[] | undefined;
  channelId: string | string[] | undefined;
  content: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "POST") {
    return res
      .status(HttpResponses.NOT_ALLOWED)
      .json({ error: HttpResponseMessages[HttpResponses.NOT_ALLOWED] });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    validateRequestPayload({ profile, serverId, channelId, content }, res);

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile?.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res
        .status(HttpResponses.NOT_FOUND)
        .json({ message: HttpResponseMessages[HttpResponses.NOT_FOUND] });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res
        .status(HttpResponses.NOT_FOUND)
        .json({ message: "Channel not found" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile?.id
    );

    if (!member) {
      return res
        .status(HttpResponses.NOT_FOUND)
        .json({ message: "Member not found" });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(HttpResponses.OK).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(HttpResponses.INTERNAL_SERVER_ERROR).json({
      message: "Server not found",
    });
  }
}

const validateRequestPayload = (
  { profile, serverId, channelId, content }: MessageRequestProp,
  res: NextApiResponseServerIO
) => {
  if (!profile) {
    return res
      .status(HttpResponses.UNAUTHORIZED)
      .json({ error: HttpResponseMessages[HttpResponses.UNAUTHORIZED] });
  }

  if (!serverId) {
    return res
      .status(HttpResponses.BAD_REQUEST)
      .json({ error: "Server ID missing" });
  }

  if (!channelId) {
    return res
      .status(HttpResponses.BAD_REQUEST)
      .json({ error: "Channel ID missing" });
  }

  if (!content) {
    return res
      .status(HttpResponses.BAD_REQUEST)
      .json({ error: "Content missing" });
  }
};
