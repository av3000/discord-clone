import { NextApiRequest } from "next";

import { MemberRole } from "@prisma/client";

import { currentProfilePages } from "@/lib/current-profile-pages";
import { DirectMessageRequestProp, NextApiResponseServerIO } from "@/types";
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
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!isRequestValid({ profile, conversationId }, res)) return;

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
        .json({ error: "Conversation not found" });
    }

    const member =
      conversation.memberOne.profileId === profile?.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res
        .status(HttpResponses.NOT_FOUND)
        .json({ error: "Member not found" });
    }

    let directMessage = await prisma.directMessage.findFirst({
      where: {
        id: directMessageId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted) {
      return res
        .status(HttpResponses.NOT_FOUND)
        .json({ error: "Message not found" });
    }

    const isMessageOwner = directMessage.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModifyMessage = isAdmin || isModerator || isMessageOwner;

    if (!canModifyMessage) {
      return res
        .status(HttpResponses.UNAUTHORIZED)
        .json({ error: HttpResponseMessages[HttpResponses.UNAUTHORIZED] });
    }

    if (req.method === "DELETE") {
      directMessage = await prisma.directMessage.update({
        where: {
          id: directMessageId as string,
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

      directMessage = await prisma.directMessage.update({
        where: {
          id: directMessageId as string,
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

    const updateKey = `chat:${conversationId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.status(HttpResponses.OK).json(directMessage);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(HttpResponses.INTERNAL_SERVER_ERROR).json({
      error: HttpResponseMessages[HttpResponses.INTERNAL_SERVER_ERROR],
    });
  }
}

const isRequestValid = (
  { profile, conversationId }: DirectMessageRequestProp,
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

  return true;
};
