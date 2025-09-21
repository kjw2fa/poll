import { GraphQLResolveInfo } from 'graphql';
import { PollDbObject, PollOptionDbObject, VoteDbObject, UserDbObject, PollPermissionsDbObject } from 'backend/db-types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreatePollPayload = {
  __typename?: 'CreatePollPayload';
  pollEdge?: Maybe<PollEdge>;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  token?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPoll?: Maybe<CreatePollPayload>;
  editPoll?: Maybe<Poll>;
  login?: Maybe<LoginResponse>;
  signup?: Maybe<User>;
  submitVote?: Maybe<SubmitVotePayload>;
};


export type MutationCreatePollArgs = {
  options: Array<PollOptionInput>;
  title: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationEditPollArgs = {
  options: Array<PollOptionInput>;
  pollId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationSignupArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationSubmitVoteArgs = {
  pollId: Scalars['ID']['input'];
  ratings: Array<VoteInput>;
  userId: Scalars['ID']['input'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export enum PermissionType {
  Edit = 'EDIT',
  View = 'VIEW',
  Vote = 'VOTE'
}

export type Poll = {
  __typename?: 'Poll';
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  options?: Maybe<Array<Maybe<PollOption>>>;
  permissions?: Maybe<Array<Maybe<PollPermissions>>>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  votes?: Maybe<Array<Maybe<Vote>>>;
};

export type PollConnection = {
  __typename?: 'PollConnection';
  edges?: Maybe<Array<Maybe<PollEdge>>>;
  pageInfo: PageInfo;
};

export type PollEdge = {
  __typename?: 'PollEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<Poll>;
};

export type PollOption = {
  __typename?: 'PollOption';
  id: Scalars['ID']['output'];
  optionText?: Maybe<Scalars['String']['output']>;
};

export type PollOptionInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  optionText: Scalars['String']['input'];
};

export type PollPermissions = {
  __typename?: 'PollPermissions';
  permission_type?: Maybe<PermissionType>;
  target_id?: Maybe<Scalars['ID']['output']>;
  target_type?: Maybe<TargetType>;
};

export type RatingInput = {
  optionId: Scalars['ID']['input'];
  rating: Scalars['Int']['input'];
};

export type RootQueryType = {
  __typename?: 'RootQueryType';
  poll?: Maybe<Poll>;
  polls?: Maybe<Array<Maybe<Poll>>>;
  searchPolls?: Maybe<Array<Maybe<Poll>>>;
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

export type SubmitVotePayload = {
  __typename?: 'SubmitVotePayload';
  pollEdge?: Maybe<PollEdge>;
};

export enum TargetType {
  Public = 'PUBLIC',
  User = 'USER'
}

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  password?: Maybe<Scalars['String']['output']>;
  polls?: Maybe<Array<Maybe<Poll>>>;
  username?: Maybe<Scalars['String']['output']>;
  votes?: Maybe<Array<Maybe<Vote>>>;
};


export type UserPollsArgs = {
  permission?: InputMaybe<PermissionType>;
};

export type Vote = {
  __typename?: 'Vote';
  id: Scalars['ID']['output'];
  poll: Poll;
  ratings?: Maybe<Array<VoteRating>>;
  user: User;
};

export type VoteInput = {
  optionId: Scalars['ID']['input'];
  rating: Scalars['Int']['input'];
};

export type VoteRating = {
  __typename?: 'VoteRating';
  option: PollOption;
  optionId: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
};

export type WinningOption = {
  __typename?: 'WinningOption';
  averageRating?: Maybe<Scalars['Float']['output']>;
  option?: Maybe<Scalars['String']['output']>;
};

export type CreatePollMutationMutationVariables = Exact<{
  title: Scalars['String']['input'];
  options: Array<PollOptionInput> | PollOptionInput;
  userId: Scalars['ID']['input'];
}>;


export type CreatePollMutationMutation = { __typename?: 'Mutation', createPoll?: { __typename?: 'CreatePollPayload', pollEdge?: { __typename?: 'PollEdge', cursor: string, node?: { __typename?: 'Poll', id: string, title?: string | null, options?: Array<{ __typename?: 'PollOption', id: string, optionText?: string | null } | null> | null, permissions?: Array<{ __typename?: 'PollPermissions', permission_type?: PermissionType | null, target_id?: string | null } | null> | null } | null } | null } | null };

export type LoginMutationMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutationMutation = { __typename?: 'Mutation', login?: { __typename?: 'LoginResponse', token?: string | null, userId?: string | null, username?: string | null } | null };

export type MyPollsQueryQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
  permission?: InputMaybe<PermissionType>;
}>;


export type MyPollsQueryQuery = { __typename?: 'RootQueryType', user?: { __typename?: 'User', polls?: Array<{ __typename?: 'Poll', id: string, title?: string | null, options?: Array<{ __typename?: 'PollOption', id: string, optionText?: string | null } | null> | null, permissions?: Array<{ __typename?: 'PollPermissions', permission_type?: PermissionType | null, target_id?: string | null } | null> | null } | null> | null, votes?: Array<{ __typename?: 'Vote', poll: { __typename?: 'Poll', id: string, title?: string | null, options?: Array<{ __typename?: 'PollOption', id: string, optionText?: string | null } | null> | null, permissions?: Array<{ __typename?: 'PollPermissions', permission_type?: PermissionType | null, target_id?: string | null } | null> | null } } | null> | null } | null };

export type EditPollMutationMutationVariables = Exact<{
  pollId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  options: Array<PollOptionInput> | PollOptionInput;
}>;


export type EditPollMutationMutation = { __typename?: 'Mutation', editPoll?: { __typename?: 'Poll', id: string, title?: string | null, options?: Array<{ __typename?: 'PollOption', id: string, optionText?: string | null } | null> | null, votes?: Array<{ __typename?: 'Vote', user: { __typename?: 'User', id: string }, ratings?: Array<{ __typename?: 'VoteRating', rating: number, option: { __typename?: 'PollOption', id: string } }> | null } | null> | null } | null };

export type EditPoll_PollFragment = { __typename?: 'Poll', id: string, title?: string | null, options?: Array<{ __typename?: 'PollOption', id: string, optionText?: string | null } | null> | null };

export type PollQueryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PollQueryQuery = { __typename?: 'RootQueryType', poll?: { __typename?: 'Poll', id: string, title?: string | null, permissions?: Array<{ __typename?: 'PollPermissions', permission_type?: PermissionType | null, target_id?: string | null } | null> | null, options?: Array<{ __typename?: 'PollOption', id: string, optionText?: string | null } | null> | null, votes?: Array<{ __typename?: 'Vote', user: { __typename?: 'User', id: string, username?: string | null }, ratings?: Array<{ __typename?: 'VoteRating', rating: number, option: { __typename?: 'PollOption', id: string, optionText?: string | null } }> | null } | null> | null } | null };

export type PollCard_PollFragment = { __typename?: 'Poll', id: string, title?: string | null, options?: Array<{ __typename?: 'PollOption', id: string, optionText?: string | null } | null> | null, permissions?: Array<{ __typename?: 'PollPermissions', permission_type?: PermissionType | null, target_id?: string | null } | null> | null };

export type PollResults_ResultsFragment = { __typename?: 'Poll', votes?: Array<{ __typename?: 'Vote', user: { __typename?: 'User', username?: string | null }, ratings?: Array<{ __typename?: 'VoteRating', rating: number, option: { __typename?: 'PollOption', optionText?: string | null } }> | null } | null> | null };

export type VoteSubmitVoteMutationMutationVariables = Exact<{
  pollId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  ratings: Array<VoteInput> | VoteInput;
}>;


export type VoteSubmitVoteMutationMutation = { __typename?: 'Mutation', submitVote?: { __typename?: 'SubmitVotePayload', pollEdge?: { __typename?: 'PollEdge', cursor: string, node?: { __typename?: 'Poll', id: string, title?: string | null, options?: Array<{ __typename?: 'PollOption', id: string, optionText?: string | null } | null> | null, permissions?: Array<{ __typename?: 'PollPermissions', permission_type?: PermissionType | null, target_id?: string | null } | null> | null } | null } | null } | null };

export type Vote_PollFragment = { __typename?: 'Poll', id: string, options?: Array<{ __typename?: 'PollOption', id: string, optionText?: string | null } | null> | null, votes?: Array<{ __typename?: 'Vote', user: { __typename?: 'User', id: string }, ratings?: Array<{ __typename?: 'VoteRating', rating: number, option: { __typename?: 'PollOption', id: string } }> | null } | null> | null };

export type SignupMutationMutationVariables = Exact<{
  username: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignupMutationMutation = { __typename?: 'Mutation', signup?: { __typename?: 'User', id: string, username?: string | null } | null };



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreatePollPayload: ResolverTypeWrapper<Omit<CreatePollPayload, 'pollEdge'> & { pollEdge?: Maybe<ResolversTypes['PollEdge']> }>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PermissionType: PermissionType;
  Poll: ResolverTypeWrapper<PollDbObject>;
  PollConnection: ResolverTypeWrapper<Omit<PollConnection, 'edges'> & { edges?: Maybe<Array<Maybe<ResolversTypes['PollEdge']>>> }>;
  PollEdge: ResolverTypeWrapper<Omit<PollEdge, 'node'> & { node?: Maybe<ResolversTypes['Poll']> }>;
  PollOption: ResolverTypeWrapper<PollOptionDbObject>;
  PollOptionInput: PollOptionInput;
  PollPermissions: ResolverTypeWrapper<PollPermissionsDbObject>;
  RatingInput: RatingInput;
  RootQueryType: ResolverTypeWrapper<Record<PropertyKey, never>>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SubmitVotePayload: ResolverTypeWrapper<Omit<SubmitVotePayload, 'pollEdge'> & { pollEdge?: Maybe<ResolversTypes['PollEdge']> }>;
  TargetType: TargetType;
  User: ResolverTypeWrapper<UserDbObject>;
  Vote: ResolverTypeWrapper<VoteDbObject>;
  VoteInput: VoteInput;
  VoteRating: ResolverTypeWrapper<Omit<VoteRating, 'option'> & { option: ResolversTypes['PollOption'] }>;
  WinningOption: ResolverTypeWrapper<WinningOption>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  CreatePollPayload: Omit<CreatePollPayload, 'pollEdge'> & { pollEdge?: Maybe<ResolversParentTypes['PollEdge']> };
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  LoginResponse: LoginResponse;
  Mutation: Record<PropertyKey, never>;
  PageInfo: PageInfo;
  Poll: PollDbObject;
  PollConnection: Omit<PollConnection, 'edges'> & { edges?: Maybe<Array<Maybe<ResolversParentTypes['PollEdge']>>> };
  PollEdge: Omit<PollEdge, 'node'> & { node?: Maybe<ResolversParentTypes['Poll']> };
  PollOption: PollOptionDbObject;
  PollOptionInput: PollOptionInput;
  PollPermissions: PollPermissionsDbObject;
  RatingInput: RatingInput;
  RootQueryType: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
  SubmitVotePayload: Omit<SubmitVotePayload, 'pollEdge'> & { pollEdge?: Maybe<ResolversParentTypes['PollEdge']> };
  User: UserDbObject;
  Vote: VoteDbObject;
  VoteInput: VoteInput;
  VoteRating: Omit<VoteRating, 'option'> & { option: ResolversParentTypes['PollOption'] };
  WinningOption: WinningOption;
};

export type CreatePollPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreatePollPayload'] = ResolversParentTypes['CreatePollPayload']> = {
  pollEdge?: Resolver<Maybe<ResolversTypes['PollEdge']>, ParentType, ContextType>;
};

export type LoginResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']> = {
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createPoll?: Resolver<Maybe<ResolversTypes['CreatePollPayload']>, ParentType, ContextType, RequireFields<MutationCreatePollArgs, 'options' | 'title' | 'userId'>>;
  editPoll?: Resolver<Maybe<ResolversTypes['Poll']>, ParentType, ContextType, RequireFields<MutationEditPollArgs, 'options' | 'pollId' | 'title' | 'userId'>>;
  login?: Resolver<Maybe<ResolversTypes['LoginResponse']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'password' | 'username'>>;
  signup?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationSignupArgs, 'email' | 'password' | 'username'>>;
  submitVote?: Resolver<Maybe<ResolversTypes['SubmitVotePayload']>, ParentType, ContextType, RequireFields<MutationSubmitVoteArgs, 'pollId' | 'ratings' | 'userId'>>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type PollResolvers<ContextType = any, ParentType extends ResolversParentTypes['Poll'] = ResolversParentTypes['Poll']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  options?: Resolver<Maybe<Array<Maybe<ResolversTypes['PollOption']>>>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<Array<Maybe<ResolversTypes['PollPermissions']>>>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  votes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Vote']>>>, ParentType, ContextType>;
};

export type PollConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['PollConnection'] = ResolversParentTypes['PollConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<ResolversTypes['PollEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type PollEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['PollEdge'] = ResolversParentTypes['PollEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['Poll']>, ParentType, ContextType>;
};

export type PollOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['PollOption'] = ResolversParentTypes['PollOption']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  optionText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type PollPermissionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PollPermissions'] = ResolversParentTypes['PollPermissions']> = {
  permission_type?: Resolver<Maybe<ResolversTypes['PermissionType']>, ParentType, ContextType>;
  target_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  target_type?: Resolver<Maybe<ResolversTypes['TargetType']>, ParentType, ContextType>;
};

export type RootQueryTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['RootQueryType'] = ResolversParentTypes['RootQueryType']> = {
  poll?: Resolver<Maybe<ResolversTypes['Poll']>, ParentType, ContextType, RequireFields<RootQueryTypePollArgs, 'id'>>;
  polls?: Resolver<Maybe<Array<Maybe<ResolversTypes['Poll']>>>, ParentType, ContextType>;
  searchPolls?: Resolver<Maybe<Array<Maybe<ResolversTypes['Poll']>>>, ParentType, ContextType, RequireFields<RootQueryTypeSearchPollsArgs, 'searchTerm'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<RootQueryTypeUserArgs, 'id'>>;
};

export type SubmitVotePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubmitVotePayload'] = ResolversParentTypes['SubmitVotePayload']> = {
  pollEdge?: Resolver<Maybe<ResolversTypes['PollEdge']>, ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  polls?: Resolver<Maybe<Array<Maybe<ResolversTypes['Poll']>>>, ParentType, ContextType, Partial<UserPollsArgs>>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  votes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Vote']>>>, ParentType, ContextType>;
};

export type VoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Vote'] = ResolversParentTypes['Vote']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  poll?: Resolver<ResolversTypes['Poll'], ParentType, ContextType>;
  ratings?: Resolver<Maybe<Array<ResolversTypes['VoteRating']>>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type VoteRatingResolvers<ContextType = any, ParentType extends ResolversParentTypes['VoteRating'] = ResolversParentTypes['VoteRating']> = {
  option?: Resolver<ResolversTypes['PollOption'], ParentType, ContextType>;
  optionId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type WinningOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['WinningOption'] = ResolversParentTypes['WinningOption']> = {
  averageRating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  option?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CreatePollPayload?: CreatePollPayloadResolvers<ContextType>;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Poll?: PollResolvers<ContextType>;
  PollConnection?: PollConnectionResolvers<ContextType>;
  PollEdge?: PollEdgeResolvers<ContextType>;
  PollOption?: PollOptionResolvers<ContextType>;
  PollPermissions?: PollPermissionsResolvers<ContextType>;
  RootQueryType?: RootQueryTypeResolvers<ContextType>;
  SubmitVotePayload?: SubmitVotePayloadResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Vote?: VoteResolvers<ContextType>;
  VoteRating?: VoteRatingResolvers<ContextType>;
  WinningOption?: WinningOptionResolvers<ContextType>;
};

