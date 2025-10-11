export interface UserDbObject {
  id: number;
  username: string;
  email: string;
  password?: string;
}

export interface PollDbObject {
  id: number;
  title: string;
  userId: number;
}

export interface PollOptionDbObject {
  id: number;
  optionText: string;
  pollId: number;
}

export interface VoteDbObject {
  id: number;
  pollId: number;
  pollOptionId: number;
  userId: number;
}

export interface PollPermissionsDbObject {
  id: number;
  pollId: number;
  permission_type: string;
  target_type: string;
  target_id?: number;
}

export interface VoteRatingDbObject {
  optionId: number;
  optionText: string;
  rating: number;
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
