import { Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | ModalTypeEnum.CreateServer
  | ModalTypeEnum.EditServer
  | ModalTypeEnum.Invite
  | ModalTypeEnum.ManageMembers
  | ModalTypeEnum.CreateChannel
  | ModalTypeEnum.LeaveServer;

export enum ModalTypeEnum {
  CreateServer = "createServer",
  Invite = "invite",
  EditServer = "editServer",
  ManageMembers = "manageMembers",
  CreateChannel = "createChannel",
  LeaveServer = "leaveServer",
}

interface ModalData {
  server?: Server;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
