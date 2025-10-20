import { GraphQLResolveInfo } from 'graphql';
import { Context } from './next-app/app/api/graphql/route';
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };


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
  CreatePollPayload: ResolverTypeWrapper<CreatePollPayload>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  PermissionType: PermissionType;
  Poll: ResolverTypeWrapper<Poll>;
  PollEdge: ResolverTypeWrapper<PollEdge>;
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
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthPayload: AuthPayload;
  Boolean: Scalars['Boolean']['output'];
  CreatePollPayload: CreatePollPayload;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: Record<PropertyKey, never>;
  Poll: Poll;
  PollEdge: PollEdge;
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
};

export type AuthPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type CreatePollPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreatePollPayload'] = ResolversParentTypes['CreatePollPayload']> = {
  pollEdge?: Resolver<ResolversTypes['PollEdge'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createPoll?: Resolver<Maybe<ResolversTypes['CreatePollPayload']>, ParentType, ContextType, RequireFields<MutationCreatePollArgs, 'options' | 'title' | 'userId'>>;
  editPoll?: Resolver<Maybe<ResolversTypes['Poll']>, ParentType, ContextType, RequireFields<MutationEditPollArgs, 'options' | 'pollId' | 'title' | 'userId'>>;
  login?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'password' | 'usernameOrEmail'>>;
  signup?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationSignupArgs, 'email' | 'password' | 'username'>>;
  submitVote?: Resolver<Maybe<ResolversTypes['Poll']>, ParentType, ContextType, RequireFields<MutationSubmitVoteArgs, 'pollId' | 'ratings' | 'userId'>>;
};

export type PollResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Poll'] = ResolversParentTypes['Poll']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['PollOption']>, ParentType, ContextType>;
  permissions?: Resolver<Array<ResolversTypes['PollPermissions']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  votes?: Resolver<Array<ResolversTypes['Vote']>, ParentType, ContextType>;
};

export type PollEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PollEdge'] = ResolversParentTypes['PollEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Poll'], ParentType, ContextType>;
};

export type PollOptionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PollOption'] = ResolversParentTypes['PollOption']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  optionText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type PollPermissionsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PollPermissions'] = ResolversParentTypes['PollPermissions']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  permission_type?: Resolver<ResolversTypes['PermissionType'], ParentType, ContextType>;
  target_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  target_type?: Resolver<ResolversTypes['TargetType'], ParentType, ContextType>;
};

export type RootQueryTypeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RootQueryType'] = ResolversParentTypes['RootQueryType']> = {
  poll?: Resolver<Maybe<ResolversTypes['Poll']>, ParentType, ContextType, RequireFields<RootQueryTypePollArgs, 'id'>>;
  polls?: Resolver<Array<ResolversTypes['Poll']>, ParentType, ContextType>;
  searchPolls?: Resolver<Array<ResolversTypes['Poll']>, ParentType, ContextType, RequireFields<RootQueryTypeSearchPollsArgs, 'searchTerm'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<RootQueryTypeUserArgs, 'id'>>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  polls?: Resolver<Array<ResolversTypes['Poll']>, ParentType, ContextType, Partial<UserPollsArgs>>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type VoteResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Vote'] = ResolversParentTypes['Vote']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  poll?: Resolver<ResolversTypes['Poll'], ParentType, ContextType>;
  ratings?: Resolver<Array<ResolversTypes['VoteRating']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type VoteRatingResolvers<ContextType = Context, ParentType extends ResolversParentTypes['VoteRating'] = ResolversParentTypes['VoteRating']> = {
  option?: Resolver<ResolversTypes['PollOption'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  CreatePollPayload?: CreatePollPayloadResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Poll?: PollResolvers<ContextType>;
  PollEdge?: PollEdgeResolvers<ContextType>;
  PollOption?: PollOptionResolvers<ContextType>;
  PollPermissions?: PollPermissionsResolvers<ContextType>;
  RootQueryType?: RootQueryTypeResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Vote?: VoteResolvers<ContextType>;
  VoteRating?: VoteRatingResolvers<ContextType>;
};

