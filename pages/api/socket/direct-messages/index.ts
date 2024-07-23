import { NextApiRequest } from "next";

import { DirectMessageRequestProp, NextApiResponseServerIO } from "@/types";
import { HttpResponseMessages, HttpResponses } from "@/lib/utils";
import prisma from "@/lib/db";
import { currentProfilePages } from "@/lib/current-profile-pages";

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
    const { conversationId } = req.query;

    if (!isRequestValid({ profile, conversationId, content }, res)) return;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile?.id,
            },
          },
          {
            memberTwo: {
              profileId: profile?.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return res
        .status(HttpResponses.NOT_FOUND)
        .json({ message: HttpResponseMessages[HttpResponses.NOT_FOUND] });
    }

    const member =
      conversation.memberOne.profileId === profile?.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res
        .status(HttpResponses.NOT_FOUND)
        .json({ message: "Member not found" });
    }

    const message = await prisma.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
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

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(HttpResponses.OK).json(message);
  } catch (error) {
    console.log("[DIRECT_MESSAGES_POST]", error);
    return res.status(HttpResponses.INTERNAL_SERVER_ERROR).json({
      message: "Server not found",
    });
  }
}

const isRequestValid = (
  { profile, conversationId, content }: DirectMessageRequestProp,
  res: NextApiResponseServerIO
) => {
  if (!profile) {
    res
      .status(HttpResponses.UNAUTHORIZED)
      .json({ error: HttpResponseMessages[HttpResponses.UNAUTHORIZED] });
    return false;
  }

  if (!conversationId) {
    res
      .status(HttpResponses.BAD_REQUEST)
      .json({ error: "Conversation ID missing" });
    return false;
  }

  if (!content) {
    res.status(HttpResponses.BAD_REQUEST).json({ error: "Content missing" });
    return false;
  }

  return true;
};
