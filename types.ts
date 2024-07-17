import { Socket, Server as NetServer } from "net";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";
import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export enum SectionTypeEnum {
  Channels = "Channels",
  Members = "Members",
}

export enum ChatHeaderType {
  Channel = "Channel",
  Conversation = "Conversation",
}

export type SectionType = SectionTypeEnum.Channels | SectionTypeEnum.Members;

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
