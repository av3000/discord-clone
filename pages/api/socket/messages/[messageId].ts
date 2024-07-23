import { NextApiRequest } from "next";

import { MemberRole } from "@prisma/client";

import { currentProfilePages } from "@/lib/current-profile-pages";
import { MessageRequestProp, NextApiResponseServerIO } from "@/types";
import { HttpResponseMessages, HttpResponses } from "@/lib/utils";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res
      .status(HttpResponses.NOT_ALLOWED)
      .json({ error: HttpResponseMessages[HttpResponses.NOT_ALLOWED] });
  }

  try {
    const profile = await currentProfilePages(req);
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    if (!isRequestValid({ profile, serverId, channelId }, res)) return;

    const server = await prisma.server.findFirst({
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
        .json({ error: "Server not found" });
    }

    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res
        .status(HttpResponses.NOT_FOUND)
        .json({ error: "Channel not found" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile?.id
    );

    if (!member) {
      return res
        .status(HttpResponses.NOT_FOUND)
        .json({ error: "Member not found" });
    }

    let message = await prisma.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res
        .status(HttpResponses.NOT_FOUND)
        .json({ error: "Message not found" });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModifyMessage = isAdmin || isModerator || isMessageOwner;

    if (!canModifyMessage) {
      return res
        .status(HttpResponses.UNAUTHORIZED)
        .json({ error: HttpResponseMessages[HttpResponses.UNAUTHORIZED] });
    }

    if (req.method === "DELETE") {
      message = await prisma.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(HttpResponses.UNAUTHORIZED).json({
          error: HttpResponseMessages[HttpResponses.UNAUTHORIZED],
        });
      }

      message = await prisma.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(HttpResponses.OK).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(HttpResponses.INTERNAL_SERVER_ERROR).json({
      error: HttpResponseMessages[HttpResponses.INTERNAL_SERVER_ERROR],
    });
  }
}

const isRequestValid = (
  { profile, serverId, channelId }: MessageRequestProp,
  res: NextApiResponseServerIO
) => {
  if (!profile) {
    res
      .status(HttpResponses.UNAUTHORIZED)
      .json({ error: HttpResponseMessages[HttpResponses.UNAUTHORIZED] });
    return false;
  }

  if (!serverId) {
    res.status(HttpResponses.BAD_REQUEST).json({ error: "Server ID missing" });
    return false;
  }

  if (!channelId) {
    res.status(HttpResponses.BAD_REQUEST).json({ error: "Channel ID missing" });
    return false;
  }

  return true;
};
