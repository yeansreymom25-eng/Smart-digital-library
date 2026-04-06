export type AuthError = {
  message: string;
  status?: number;
};

export type UserIdentity = {
  provider?: string;
};

export type User = {
  id: string;
  email?: string | null;
  created_at?: string;
  last_sign_in_at?: string | null;
  identities?: UserIdentity[];
  app_metadata?: {
    providers?: string[];
    [key: string]: unknown;
  };
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  };
};

export type Session = {
  user: User;
};

type QueryResult<T = unknown> = Promise<{ data: T; error: AuthError | null }>;

type AuthListener = {
  data: {
    subscription: {
      unsubscribe: () => void;
    };
  };
};

type QueryBuilderResult<T = unknown> = Promise<{
  data: T;
  error: AuthError | null;
}>;

type MockQueryBuilder<T = unknown> = {
  select: (..._args: unknown[]) => MockQueryBuilder<T>;
  insert: (..._args: unknown[]) => MockQueryBuilder<T>;
  update: (..._args: unknown[]) => MockQueryBuilder<T>;
  delete: (..._args: unknown[]) => MockQueryBuilder<T>;
  upsert: (..._args: unknown[]) => MockQueryBuilder<T>;
  eq: (..._args: unknown[]) => MockQueryBuilder<T>;
  neq: (..._args: unknown[]) => MockQueryBuilder<T>;
  order: (..._args: unknown[]) => MockQueryBuilder<T>;
  limit: (..._args: unknown[]) => MockQueryBuilder<T>;
  single: () => QueryBuilderResult<T>;
  maybeSingle: () => QueryBuilderResult<T | null>;
  then: QueryBuilderResult<T>["then"];
  catch: QueryBuilderResult<T>["catch"];
  finally: QueryBuilderResult<T>["finally"];
};

export type SupabaseClient = {
  auth: {
    getSession: () => QueryResult<{ session: Session | null }>;
    getUser: () => QueryResult<{ user: User | null }>;
    signInWithPassword: (_credentials: unknown) => QueryResult<{ user: User | null; session: Session | null }>;
    signInWithOAuth: (_options: unknown) => QueryResult<{ provider?: string | null; url?: string | null }>;
    signInWithOtp: (_options: unknown) => QueryResult<{ user: User | null; session: Session | null }>;
    verifyOtp: (_options: unknown) => QueryResult<{ user: User | null; session: Session | null }>;
    exchangeCodeForSession: (_code: string) => QueryResult<{ user?: User | null; session: Session | null }>;
    setSession: (_session: unknown) => QueryResult<{ user?: User | null; session: Session | null }>;
    updateUser: (_attributes: unknown) => QueryResult<{ user: User | null }>;
    signOut: () => QueryResult<{}>;
    onAuthStateChange: (_callback: (_event: string, _session: Session | null) => void) => AuthListener;
  };
  from: <T = unknown>(_table: string) => MockQueryBuilder<T>;
};

function createQueryBuilder<T = unknown>(): MockQueryBuilder<T> {
  const resolved: QueryBuilderResult<T> = Promise.resolve({
    data: null as T,
    error: null,
  });

  const builder: MockQueryBuilder<T> = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    upsert: () => builder,
    eq: () => builder,
    neq: () => builder,
    order: () => builder,
    limit: () => builder,
    single: () => Promise.resolve({ data: null as T, error: null }),
    maybeSingle: () => Promise.resolve({ data: null as T | null, error: null }),
    then: resolved.then.bind(resolved),
    catch: resolved.catch.bind(resolved),
    finally: resolved.finally.bind(resolved),
  };

  return builder;
}

export function createClient(
  _url: string,
  _key: string,
  _options?: unknown
): SupabaseClient {
  void _url;
  void _key;
  void _options;

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
      signInWithOAuth: async () => ({ data: { provider: null, url: null }, error: null }),
      signInWithOtp: async () => ({ data: { user: null, session: null }, error: null }),
      verifyOtp: async () => ({ data: { user: null, session: null }, error: null }),
      exchangeCodeForSession: async () => ({ data: { user: null, session: null }, error: null }),
      setSession: async () => ({ data: { user: null, session: null }, error: null }),
      updateUser: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ data: {}, error: null }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => undefined,
          },
        },
      }),
    },
    from: () => createQueryBuilder(),
  };
}
