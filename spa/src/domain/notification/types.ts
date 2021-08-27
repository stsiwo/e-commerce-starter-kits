import { UserType } from "domain/user/types";

// type def
export declare type NotificationType = {
  notificationId: string;
  notificationTitle: string;
  notificationDescription: string;
  issuer: UserType;
  recipient: UserType;
  isRead: boolean;
  link: string;
  note: string;
  notificationType: string;
  createdAt: Date;
  readAt: Date;
};
