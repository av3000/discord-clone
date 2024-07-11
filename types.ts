import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export enum SectionTypeEnum {
  Channels = "Channels",
  Members = "Members",
}

export type SectionType = SectionTypeEnum.Channels | SectionTypeEnum.Members;
