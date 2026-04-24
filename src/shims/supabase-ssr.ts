import { createClient } from "@supabase/supabase-js";

type CookieOptions = {
  domain?: string;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: "lax" | "strict" | "none" | boolean;
  secure?: boolean;
};

type CookieRecord = {
  name: string;
  value: string;
  options?: CookieOptions;
};

type SsrOptions = {
  cookies?: {
    getAll?: () => CookieRecord[];
    setAll?: (cookiesToSet: CookieRecord[]) => void;
  };
  [key: string]: unknown;
};

type QueryResult<T = unknown> = Promise<{ data: T; error: { message: string } | null }>;

type MockQueryBuilder<T = unknown> = {
  select: (..._args: unknown[]) => MockQueryBuilder<T>;
  insert: (..._args: unknown[]) => MockQueryBuilder<T>;
  update: (..._args: unknown[]) => MockQueryBuilder<T>;
  delete: (..._args: unknown[]) => MockQueryBuilder<T>;
  upsert: (..._args: unknown[]) => MockQueryBuilder<T>;
  eq: (..._args: unknown[]) => MockQueryBuilder<T>;
  neq: (..._args: unknown[]) => MockQueryBuilder<T>;
  gt: (..._args: unknown[]) => MockQueryBuilder<T>;
  gte: (..._args: unknown[]) => MockQueryBuilder<T>;
  lt: (..._args: unknown[]) => MockQueryBuilder<T>;
  lte: (..._args: unknown[]) => MockQueryBuilder<T>;
  ilike: (..._args: unknown[]) => MockQueryBuilder<T>;
  filter: (..._args: unknown[]) => MockQueryBuilder<T>;
  order: (..._args: unknown[]) => MockQueryBuilder<T>;
  limit: (..._args: unknown[]) => MockQueryBuilder<T>;
  single: () => QueryResult<T>;
  maybeSingle: () => QueryResult<T | null>;
  then: QueryResult<T>["then"];
  catch: QueryResult<T>["catch"];
  finally: QueryResult<T>["finally"];
};

function createQueryBuilder<T = unknown>(): MockQueryBuilder<T> {
  const resolved: QueryResult<T> = Promise.resolve({
    data: [] as unknown as T,
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
    gt: () => builder,
    gte: () => builder,
    lt: () => builder,
    lte: () => builder,
    ilike: () => builder,
    filter: () => builder,
    order: () => builder,
    limit: () => builder,
    single: async () => ({ data: null as T, error: null }),
    maybeSingle: async () => ({ data: null, error: null }),
    then: resolved.then.bind(resolved),
    catch: resolved.catch.bind(resolved),
    finally: resolved.finally.bind(resolved),
  };

  return builder;
}

function createMockClient(): any {
  return {
    auth: {
      admin: {
        createUser: async () => ({ data: { user: null }, error: null }),
        listUsers: async () => ({ data: { users: [] }, error: null }),
      },
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
      signInWithOAuth: async () => ({ data: { provider: null, url: null }, error: null }),
      signInWithOtp: async () => ({ data: { user: null, session: null }, error: null }),
      verifyOtp: async () => ({ data: { user: null, session: null }, error: null }),
      exchangeCodeForSession: async () => ({ data: { user: null, session: null }, error: null }),
      setSession: async () => ({ data: { user: null, session: null }, error: null }),
      updateUser: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => undefined,
          },
        },
      }),
    },
    from: () => createQueryBuilder(),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: { message: "Supabase is not configured." } }),
        getPublicUrl: (_path: string) => ({ data: { publicUrl: "" } }),
      }),
    },
  };
}

function createSafeClient(url?: string, key?: string, options?: SsrOptions): any {
  if (!url || !key) {
    return createMockClient();
  }

  return createClient(url, key, options as Parameters<typeof createClient>[2]) as any;
}

export function createServerClient(url: string, key: string, options?: SsrOptions): any {
  return createSafeClient(url, key, options);
}

export function createBrowserClient(url: string, key: string, options?: SsrOptions): any {
  return createSafeClient(url, key, options);
}
