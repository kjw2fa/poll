import { GraphQLResolveInfo } from 'graphql';
import { ResolverContext } from './types/context.js';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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

export type Mutation = {
  __typename?: 'Mutation';
  createPoll?: Maybe<Poll>;
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

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
export type ResolversTypes = ResolversObject<{
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  PermissionType: PermissionType;
  Poll: ResolverTypeWrapper<Poll>;
  PollOption: ResolverTypeWrapper<PollOption>;
  PollOptionEditInput: PollOptionEditInput;
  PollOptionInput: PollOptionInput;
  PollPermissions: ResolverTypeWrapper<PollPermissions>;
  RootQueryType: ResolverTypeWrapper<Record<PropertyKey, never>>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TargetType: TargetType;
  User: ResolverTypeWrapper<User>;
  Vote: ResolverTypeWrapper<Vote>;
  VoteRating: ResolverTypeWrapper<VoteRating>;
  VoteRatingInput: VoteRatingInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthPayload: AuthPayload;
  Boolean: Scalars['Boolean']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: Record<PropertyKey, never>;
  Poll: Poll;
  PollOption: PollOption;
  PollOptionEditInput: PollOptionEditInput;
  PollOptionInput: PollOptionInput;
  PollPermissions: PollPermissions;
  RootQueryType: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
  User: User;
  Vote: Vote;
  VoteRating: VoteRating;
  VoteRatingInput: VoteRatingInput;
}>;

export type AuthPayloadResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = ResolversObject<{
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createPoll?: Resolver<Maybe<ResolversTypes['Poll']>, ParentType, ContextType, RequireFields<MutationCreatePollArgs, 'options' | 'title' | 'userId'>>;
  editPoll?: Resolver<Maybe<ResolversTypes['Poll']>, ParentType, ContextType, RequireFields<MutationEditPollArgs, 'options' | 'pollId' | 'title' | 'userId'>>;
  login?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'password' | 'usernameOrEmail'>>;
  signup?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationSignupArgs, 'email' | 'password' | 'username'>>;
  submitVote?: Resolver<Maybe<ResolversTypes['Poll']>, ParentType, ContextType, RequireFields<MutationSubmitVoteArgs, 'pollId' | 'ratings' | 'userId'>>;
}>;

export type PollResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Poll'] = ResolversParentTypes['Poll']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['PollOption']>, ParentType, ContextType>;
  permissions?: Resolver<Array<ResolversTypes['PollPermissions']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  votes?: Resolver<Array<ResolversTypes['Vote']>, ParentType, ContextType>;
}>;

export type PollOptionResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['PollOption'] = ResolversParentTypes['PollOption']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  optionText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type PollPermissionsResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['PollPermissions'] = ResolversParentTypes['PollPermissions']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  permission_type?: Resolver<ResolversTypes['PermissionType'], ParentType, ContextType>;
  target_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  target_type?: Resolver<ResolversTypes['TargetType'], ParentType, ContextType>;
}>;

export type RootQueryTypeResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['RootQueryType'] = ResolversParentTypes['RootQueryType']> = ResolversObject<{
  poll?: Resolver<Maybe<ResolversTypes['Poll']>, ParentType, ContextType, RequireFields<RootQueryTypePollArgs, 'id'>>;
  polls?: Resolver<Array<ResolversTypes['Poll']>, ParentType, ContextType>;
  searchPolls?: Resolver<Array<ResolversTypes['Poll']>, ParentType, ContextType, RequireFields<RootQueryTypeSearchPollsArgs, 'searchTerm'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<RootQueryTypeUserArgs, 'id'>>;
}>;

export type UserResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  polls?: Resolver<Array<ResolversTypes['Poll']>, ParentType, ContextType, Partial<UserPollsArgs>>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type VoteResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Vote'] = ResolversParentTypes['Vote']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  poll?: Resolver<ResolversTypes['Poll'], ParentType, ContextType>;
  ratings?: Resolver<Array<ResolversTypes['VoteRating']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export type VoteRatingResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['VoteRating'] = ResolversParentTypes['VoteRating']> = ResolversObject<{
  option?: Resolver<ResolversTypes['PollOption'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type Resolvers<ContextType = ResolverContext> = ResolversObject<{
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Poll?: PollResolvers<ContextType>;
  PollOption?: PollOptionResolvers<ContextType>;
  PollPermissions?: PollPermissionsResolvers<ContextType>;
  RootQueryType?: RootQueryTypeResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Vote?: VoteResolvers<ContextType>;
  VoteRating?: VoteRatingResolvers<ContextType>;
}>;

