const mockCreateClient = jest.fn().mockReturnValue({ auth: {} });
jest.mock('@supabase/supabase-js', () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}));

describe('supabase client', () => {
  it('creates a client with AsyncStorage-backed session persistence', () => {
    jest.isolateModules(() => {
      require('@/src/lib/supabase');
    });

    expect(mockCreateClient).toHaveBeenCalledTimes(1);
    const [url, anonKey, options] = mockCreateClient.mock.calls[0] as [
      string,
      string,
      { auth: Record<string, unknown> },
    ];

    expect(url).toBe('https://test.supabase.co');
    expect(anonKey).toBe('test-anon-key');
    expect(options.auth).toMatchObject({
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    });
    expect(options.auth.storage).toBeDefined();
  });
});
