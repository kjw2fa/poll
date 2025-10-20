export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};

export type CreatePollPayload = {
  __typename?: 'CreatePollPayload';
  pollEdge: PollEdge;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPoll?: Maybe<CreatePollPayload>;
  editPoll?: Maybe<Poll>;
  login?: Maybe<AuthPayload>;
  signup?: Maybe<User>;
  submitVote?: Maybe<Poll>;
};


export type MutationCreatePollArgs = {
  options: Array<PollOptionInput>;
  title: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationEditPollArgs = {
  options: Array<PollOptionEditInput>;
  pollId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  usernameOrEmail: Scalars['String']['input'];
};


export type MutationSignupArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationSubmitVoteArgs = {
  pollId: Scalars['ID']['input'];
  ratings: Array<VoteRatingInput>;
  userId: Scalars['ID']['input'];
};

export enum PermissionType {
  Edit = 'EDIT',
  View = 'VIEW',
  Vote = 'VOTE'
}

export type Poll = {
  __typename?: 'Poll';
  id: Scalars['ID']['output'];
  options: Array<PollOption>;
  permissions: Array<PollPermissions>;
  title: Scalars['String']['output'];
  votes: Array<Vote>;
};

export type PollEdge = {
  __typename?: 'PollEdge';
  cursor: Scalars['String']['output'];
  node: Poll;
};

export type PollOption = {
  __typename?: 'PollOption';
  id: Scalars['ID']['output'];
  optionText: Scalars['String']['output'];
};

export type PollOptionEditInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  optionText: Scalars['String']['input'];
};

export type PollOptionInput = {
  optionText: Scalars['String']['input'];
};

export type PollPermissions = {
  __typename?: 'PollPermissions';
  id: Scalars['ID']['output'];
  permission_type: PermissionType;
  target_id?: Maybe<Scalars['ID']['output']>;
  target_type: TargetType;
};

export type RootQueryType = {
  __typename?: 'RootQueryType';
  poll?: Maybe<Poll>;
  polls: Array<Poll>;
  searchPolls: Array<Poll>;
  user?: Maybe<User>;
};


export type RootQueryTypePollArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryTypeSearchPollsArgs = {
  searchTerm: Scalars['String']['input'];
};


export type RootQueryTypeUserArgs = {
  id: Scalars['ID']['input'];
};

export enum TargetType {
  Public = 'PUBLIC',
  User = 'USER'
}

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  polls: Array<Poll>;
  username: Scalars['String']['output'];
};


export type UserPollsArgs = {
  permission?: InputMaybe<PermissionType>;
};

export type Vote = {
  __typename?: 'Vote';
  id: Scalars['ID']['output'];
  poll: Poll;
  ratings: Array<VoteRating>;
  user: User;
};

export type VoteRating = {
  __typename?: 'VoteRating';
  option: PollOption;
  rating: Scalars['Int']['output'];
};

export type VoteRatingInput = {
  optionId: Scalars['ID']['input'];
  rating: Scalars['Int']['input'];
};
