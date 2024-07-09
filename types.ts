import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export enum SearchTypeEnum {
  Channel = "Channel",
  Member = "Member",
}

export type SearchType = SearchTypeEnum.Channel | SearchTypeEnum.Member;