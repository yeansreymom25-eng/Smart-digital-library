type QueryResult<T = unknown> = Promise<{ data: T; error: null }>;

type AuthListener = {
  data: {
    subscription: {
      unsubscribe: () => void;
    };
  };
};

type MockQueryBuilder = {
  select: (..._args: unknown[]) => MockQueryBuilder;
  insert: (..._args: unknown[]) => MockQueryBuilder;
  update: (..._args: unknown[]) => MockQueryBuilder;
  delete: (..._args: unknown[]) => MockQueryBuilder;
  upsert: (..._args: unknown[]) => MockQueryBuilder;
  eq: (..._args: unknown[]) => MockQueryBuilder;
  neq: (..._args: unknown[]) => MockQueryBuilder;
  order: (..._args: unknown[]) => MockQueryBuilder;
  limit: (..._args: unknown[]) => MockQueryBuilder;
  single: () => QueryResult<null>;
  maybeSingle: () => QueryResult<null>;
  then: QueryResult<unknown>["then"];
  catch: QueryResult<unknown>["catch"];
  finally: QueryResult<unknown>["finally"];
};

export type SupabaseClient = {
  auth: {
    getSession: () => QueryResult<{ session: null }>;
    getUser: () => QueryResult<{ user: null }>;
    signInWithPassword: (_credentials: unknown) => QueryResult<null>;
    signInWithOAuth: (_options: unknown) => QueryResult<null>;
    onAuthStateChange: (_callback: (..._args: unknown[]) => void) => AuthListener;
  };
  from: (_table: string) => MockQueryBuilder;
};

function createQueryBuilder(): MockQueryBuilder {
  const resolved = Promise.resolve({ data: null, error: null });

  const builder: MockQueryBuilder = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    upsert: () => builder,
    eq: () => builder,
    neq: () => builder,
    order: () => builder,
    limit: () => builder,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
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
      signInWithPassword: async () => ({ data: null, error: null }),
      signInWithOAuth: async () => ({ data: null, error: null }),
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
