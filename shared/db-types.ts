export interface UserDbObject {
  id: string;
  username: string;
  email: string;
  password?: string;
}

export interface PollDbObject {
  id: string;
  title: string;
  userId: string;
}

export interface PollOptionDbObject {
  id: string;
  optionText: string;
  pollId: string;
}

export interface VoteDbObject {
  id:string;
  pollId: string;
  pollOptionId: string;
  userId: string;
}

export interface PollPermissionsDbObject {
  id: string;
  pollId: string;
  permission_type: PermissionType;
  target_type: TargetType;
  target_id?: string;
}

export type DbObject =
  | UserDbObject
  | PollDbObject
  | PollOptionDbObject
  | VoteDbObject
  | PollPermissionsDbObject;

export enum DbCollection {
  USERS = "users",
  POLLS = "polls",
  POLL_OPTIONS = "pollOptions",
  VOTES = "votes",
  POLL_PERMISSIONS = "pollPermissions",
}

export enum PermissionType {
  VIEW = 'VIEW',
  VOTE = 'VOTE',
  EDIT = 'EDIT',
}

export enum TargetType {
  USER = 'USER',
  PUBLIC = 'PUBLIC',
}