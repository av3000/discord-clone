import { redirect } from "next/navigation";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { ChannelType, MemberRole, Prisma } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerHeader } from "./server-header";
import { ServerSearch } from "./server-search";
import { SearchTypeEnum } from "@/types";

interface ServerSidebarProps {
  serverId: string;
}

const channelIconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: Prisma.SortOrder.asc,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = server.members.filter(
    (member) => member.profileId !== profile.id
  );

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="mt-2">
        <ServerSearch
          data={[
            {
              label: "Text Channels",
              type: SearchTypeEnum.Channel,
              data: textChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: channelIconMap[channel.type],
              })),
            },
            {
              label: "Voice Channels",
              type: SearchTypeEnum.Channel,
              data: audioChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: channelIconMap[channel.type],
              })),
            },
            {
              label: "Voice Channels",
              type: SearchTypeEnum.Channel,
              data: videoChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: channelIconMap[channel.type],
              })),
            },
            {
              label: "Members",
              type: SearchTypeEnum.Member,
              data: members?.map((member) => ({
                id: member.id,
                name: member.profile.name,
                icon: roleIconMap[member.role],
              })),
            },
          ]}
        />
      </ScrollArea>
    </div>
  );
};
