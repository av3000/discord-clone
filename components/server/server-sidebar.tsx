import { redirect } from "next/navigation";
import { Hash, Mic, Video } from "lucide-react";

import { ChannelType, Prisma } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import prisma from "@/lib/db";
import { SectionTypeEnum } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { roleIconMap } from "@/components/maps";
import { ServerHeader } from "./server-header";
import { ServerSearch } from "./server-search";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface ServerSidebarProps {
  serverId: string;
}

const channelIconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await prisma.server.findUnique({
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
      <div className="mt-2">
        <ScrollArea className="flex-1 px-3">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: SectionTypeEnum.Channels,
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: SectionTypeEnum.Channels,
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: SectionTypeEnum.Channels,
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: SectionTypeEnum.Members,
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
          <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
          {!!textChannels?.length && (
            <div className="mb-2">
              <ServerSection
                sectionType={SectionTypeEnum.Channels}
                channelType={ChannelType.TEXT}
                role={role}
                label="Text Channels"
              />
              <div className="space-y-[2px]">
                {textChannels.map((channel) => (
                  <ServerChannel
                    channel={channel}
                    role={role}
                    server={server}
                    key={channel.id}
                  />
                ))}
              </div>
            </div>
          )}
          {!!audioChannels?.length && (
            <div className="mb-2">
              <ServerSection
                sectionType={SectionTypeEnum.Channels}
                channelType={ChannelType.AUDIO}
                role={role}
                label="Voice Channels"
              />
              <div className="space-y-[2px]">
                {audioChannels.map((channel) => (
                  <ServerChannel
                    channel={channel}
                    role={role}
                    server={server}
                    key={channel.id}
                  />
                ))}
              </div>
            </div>
          )}

          {!!videoChannels?.length && (
            <div className="mb-2">
              <ServerSection
                sectionType={SectionTypeEnum.Channels}
                channelType={ChannelType.VIDEO}
                role={role}
                label="Video Channels"
              />
              <div className="space-y-[2px]">
                {videoChannels.map((channel) => (
                  <ServerChannel
                    channel={channel}
                    role={role}
                    server={server}
                    key={channel.id}
                  />
                ))}
              </div>
            </div>
          )}
          {!!members?.length && (
            <div className="mb-2">
              <ServerSection
                sectionType={SectionTypeEnum.Members}
                role={role}
                label="Members"
                server={server}
              />
              <div className="space-y-[2px]">
                {members.map((member) => (
                  <ServerMember
                    key={member.id}
                    member={member}
                    server={server}
                  />
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
