import { GraphQLResolveInfo } from 'graphql';
import { PollDbObject, PollOptionDbObject, UserDbObject, VoteDbObject, PollPermissionsDbObject } from './db-types.ts';
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
  submitVote?: Maybe<SubmitVotePayload>;
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
  username: Scalars['String']['input'];
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

export type SubmitVotePayload = {
  __typename?: 'SubmitVotePayload';
  pollEdge: PollEdge;
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

export type CreatePollMutationMutationVariables = Exact<{
  title: Scalars['String']['input'];
  options: Array<PollOptionInput> | PollOptionInput;
  userId: Scalars['ID']['input'];
}>;


export type CreatePollMutationMutation = { __typename?: 'Mutation', createPoll?: { __typename?: 'CreatePollPayload', pollEdge: { __typename?: 'PollEdge', cursor: string, node: { __typename?: 'Poll', id: string, title: string, options: Array<{ __typename?: 'PollOption', id: string, optionText: string }>, permissions: Array<{ __typename?: 'PollPermissions', permission_type: PermissionType, target_id?: string | null }> } } } | null };

export type LoginMutationMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutationMutation = { __typename?: 'Mutation', login?: { __typename?: 'AuthPayload', token: string, userId: string, username: string } | null };

export type MyPollsQueryQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
  permission?: InputMaybe<PermissionType>;
}>;


export type MyPollsQueryQuery = { __typename?: 'RootQueryType', user?: { __typename?: 'User', polls: Array<{ __typename?: 'Poll', id: string, title: string, options: Array<{ __typename?: 'PollOption', id: string, optionText: string }>, permissions: Array<{ __typename?: 'PollPermissions', permission_type: PermissionType, target_id?: string | null }> }> } | null };

export type EditPollMutationMutationVariables = Exact<{
  pollId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  options: Array<PollOptionEditInput> | PollOptionEditInput;
}>;


export type EditPollMutationMutation = { __typename?: 'Mutation', editPoll?: { __typename?: 'Poll', id: string, title: string, options: Array<{ __typename?: 'PollOption', id: string, optionText: string }>, votes: Array<{ __typename?: 'Vote', user: { __typename?: 'User', id: string }, ratings: Array<{ __typename?: 'VoteRating', rating: number, option: { __typename?: 'PollOption', id: string } }> }> } | null };

export type EditPoll_PollFragment = { __typename?: 'Poll', id: string, title: string, options: Array<{ __typename?: 'PollOption', id: string, optionText: string }> };

export type PollQueryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PollQueryQuery = { __typename?: 'RootQueryType', poll?: { __typename?: 'Poll', id: string, title: string, permissions: Array<{ __typename?: 'PollPermissions', permission_type: PermissionType, target_id?: string | null }>, options: Array<{ __typename?: 'PollOption', id: string, optionText: string }>, votes: Array<{ __typename?: 'Vote', user: { __typename?: 'User', id: string, username: string }, ratings: Array<{ __typename?: 'VoteRating', rating: number, option: { __typename?: 'PollOption', id: string, optionText: string } }> }> } | null };

export type PollCard_PollFragment = { __typename?: 'Poll', id: string, title: string, options: Array<{ __typename?: 'PollOption', id: string, optionText: string }>, permissions: Array<{ __typename?: 'PollPermissions', permission_type: PermissionType, target_id?: string | null }> };

export type PollResults_ResultsFragment = { __typename?: 'Poll', votes: Array<{ __typename?: 'Vote', user: { __typename?: 'User', username: string }, ratings: Array<{ __typename?: 'VoteRating', rating: number, option: { __typename?: 'PollOption', optionText: string } }> }> };

export type VoteSubmitVoteMutationMutationVariables = Exact<{
  pollId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  ratings: Array<VoteRatingInput> | VoteRatingInput;
}>;


export type VoteSubmitVoteMutationMutation = { __typename?: 'Mutation', submitVote?: { __typename?: 'SubmitVotePayload', pollEdge: { __typename?: 'PollEdge', cursor: string, node: { __typename?: 'Poll', id: string, title: string, options: Array<{ __typename?: 'PollOption', id: string, optionText: string }>, permissions: Array<{ __typename?: 'PollPermissions', permission_type: PermissionType, target_id?: string | null }> } } } | null };

export type Vote_PollFragment = { __typename?: 'Poll', id: string, options: Array<{ __typename?: 'PollOption', id: string, optionText: string }>, votes: Array<{ __typename?: 'Vote', user: { __typename?: 'User', id: string }, ratings: Array<{ __typename?: 'VoteRating', rating: number, option: { __typename?: 'PollOption', id: string } }> }> };

export type SignupMutationMutationVariables = Exact<{
  username: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignupMutationMutation = { __typename?: 'Mutation', signup?: { __typename?: 'User', id: string, username: string } | null };



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
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreatePollPayload: ResolverTypeWrapper<Omit<CreatePollPayload, 'pollEdge'> & { pollEdge: ResolversTypes['PollEdge'] }>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  PermissionType: PermissionType;
  Poll: ResolverTypeWrapper<PollDbObject>;
  PollEdge: ResolverTypeWrapper<Omit<PollEdge, 'node'> & { node: ResolversTypes['Poll'] }>;
  PollOption: ResolverTypeWrapper<PollOptionDbObject>;
  PollOptionEditInput: PollOptionEditInput;
  PollOptionInput: PollOptionInput;
  PollPermissions: ResolverTypeWrapper<PollPermissionsDbObject>;
  RootQueryType: ResolverTypeWrapper<Record<PropertyKey, never>>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SubmitVotePayload: ResolverTypeWrapper<Omit<SubmitVotePayload, 'pollEdge'> & { pollEdge: ResolversTypes['PollEdge'] }>;
  TargetType: TargetType;
  User: ResolverTypeWrapper<UserDbObject>;
  Vote: ResolverTypeWrapper<VoteDbObject>;
  VoteRating: ResolverTypeWrapper<Omit<VoteRating, 'option'> & { option: ResolversTypes['PollOption'] }>;
  VoteRatingInput: VoteRatingInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthPayload: AuthPayload;
  Boolean: Scalars['Boolean']['output'];
  CreatePollPayload: Omit<CreatePollPayload, 'pollEdge'> & { pollEdge: ResolversParentTypes['PollEdge'] };
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: Record<PropertyKey, never>;
  Poll: PollDbObject;
  PollEdge: Omit<PollEdge, 'node'> & { node: ResolversParentTypes['Poll'] };
  PollOption: PollOptionDbObject;
  PollOptionEditInput: PollOptionEditInput;
  PollOptionInput: PollOptionInput;
  PollPermissions: PollPermissionsDbObject;
  RootQueryType: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
  SubmitVotePayload: Omit<SubmitVotePayload, 'pollEdge'> & { pollEdge: ResolversParentTypes['PollEdge'] };
  User: UserDbObject;
  Vote: VoteDbObject;
  VoteRating: Omit<VoteRating, 'option'> & { option: ResolversParentTypes['PollOption'] };
  VoteRatingInput: VoteRatingInput;
};

export type AuthPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type CreatePollPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreatePollPayload'] = ResolversParentTypes['CreatePollPayload']> = {
  pollEdge?: Resolver<ResolversTypes['PollEdge'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createPoll?: Resolver<Maybe<ResolversTypes['CreatePollPayload']>, ParentType, ContextType, RequireFields<MutationCreatePollArgs, 'options' | 'title' | 'userId'>>;
  editPoll?: Resolver<Maybe<ResolversTypes['Poll']>, ParentType, ContextType, RequireFields<MutationEditPollArgs, 'options' | 'pollId' | 'title' | 'userId'>>;
  login?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'password' | 'username'>>;
  signup?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationSignupArgs, 'email' | 'password' | 'username'>>;
  submitVote?: Resolver<Maybe<ResolversTypes['SubmitVotePayload']>, ParentType, ContextType, RequireFields<MutationSubmitVoteArgs, 'pollId' | 'ratings' | 'userId'>>;
};

export type PollResolvers<ContextType = any, ParentType extends ResolversParentTypes['Poll'] = ResolversParentTypes['Poll']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['PollOption']>, ParentType, ContextType>;
  permissions?: Resolver<Array<ResolversTypes['PollPermissions']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  votes?: Resolver<Array<ResolversTypes['Vote']>, ParentType, ContextType>;
};

export type PollEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['PollEdge'] = ResolversParentTypes['PollEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Poll'], ParentType, ContextType>;
};

export type PollOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['PollOption'] = ResolversParentTypes['PollOption']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  optionText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type PollPermissionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PollPermissions'] = ResolversParentTypes['PollPermissions']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  permission_type?: Resolver<ResolversTypes['PermissionType'], ParentType, ContextType>;
  target_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  target_type?: Resolver<ResolversTypes['TargetType'], ParentType, ContextType>;
};

export type RootQueryTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['RootQueryType'] = ResolversParentTypes['RootQueryType']> = {
  poll?: Resolver<Maybe<ResolversTypes['Poll']>, ParentType, ContextType, RequireFields<RootQueryTypePollArgs, 'id'>>;
  polls?: Resolver<Array<ResolversTypes['Poll']>, ParentType, ContextType>;
  searchPolls?: Resolver<Array<ResolversTypes['Poll']>, ParentType, ContextType, RequireFields<RootQueryTypeSearchPollsArgs, 'searchTerm'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<RootQueryTypeUserArgs, 'id'>>;
};

export type SubmitVotePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubmitVotePayload'] = ResolversParentTypes['SubmitVotePayload']> = {
  pollEdge?: Resolver<ResolversTypes['PollEdge'], ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  polls?: Resolver<Array<ResolversTypes['Poll']>, ParentType, ContextType, Partial<UserPollsArgs>>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type VoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Vote'] = ResolversParentTypes['Vote']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  poll?: Resolver<ResolversTypes['Poll'], ParentType, ContextType>;
  ratings?: Resolver<Array<ResolversTypes['VoteRating']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type VoteRatingResolvers<ContextType = any, ParentType extends ResolversParentTypes['VoteRating'] = ResolversParentTypes['VoteRating']> = {
  option?: Resolver<ResolversTypes['PollOption'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  CreatePollPayload?: CreatePollPayloadResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Poll?: PollResolvers<ContextType>;
  PollEdge?: PollEdgeResolvers<ContextType>;
  PollOption?: PollOptionResolvers<ContextType>;
  PollPermissions?: PollPermissionsResolvers<ContextType>;
  RootQueryType?: RootQueryTypeResolvers<ContextType>;
  SubmitVotePayload?: SubmitVotePayloadResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Vote?: VoteResolvers<ContextType>;
  VoteRating?: VoteRatingResolvers<ContextType>;
};

