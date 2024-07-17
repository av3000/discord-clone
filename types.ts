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
