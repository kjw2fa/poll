import { PermissionType, TargetType } from './enums';

export interface PollDbObject {
  id: number;
  title: string;
}

export interface PollOptionDbObject {
  id: number;
  pollId: number;
  optionText: string;
}

export interface VoteDbObject {
  id: number;
  userId: number;
  pollId: number;
}

export interface UserDbObject {
  id: number;
  username: string;
  email: string;
  password?: string;
}

export interface PollPermissionsDbObject {
  id: number;
  pollId: number;
  permission_type: PermissionType;
  target_type: TargetType;
  target_id: number;
}
