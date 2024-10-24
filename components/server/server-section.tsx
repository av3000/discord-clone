"use client";

import { Plus, Settings } from "lucide-react";

import { ChannelType, MemberRole } from "@prisma/client";

import {
  SectionType,
  SectionTypeEnum,
  ServerWithMembersWithProfiles,
} from "@/types";
import { ActionTooltip } from "@/components/action-tool";
import { ModalTypeEnum, useModalStore } from "@/hooks/use-modal-store";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: SectionType;
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

export const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModalStore();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST &&
        sectionType === SectionTypeEnum.Channels && (
          <ActionTooltip label="Create Channel" side="top">
            <button
              onClick={() =>
                onOpen(ModalTypeEnum.CreateChannel, { channelType })
              }
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            >
              <Plus className="h-4 w-4" />
            </button>
          </ActionTooltip>
        )}

      {role === MemberRole.ADMIN && sectionType === SectionTypeEnum.Members && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen(ModalTypeEnum.ManageMembers, { server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
