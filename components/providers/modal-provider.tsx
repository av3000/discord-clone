"use client";

import { useEffect, useState } from "react";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { MembersModal } from "@/components/modals/members-modal";

export const ModalProvider = () => {
  // Hydration may occure if some parts loaded on server and other on client,
  // conditional "if isMounted" helps to load only when available.
  // Might be it is solved issue in the current version.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal /> <InviteModal /> <EditServerModal /> <MembersModal />
    </>
  );
};
