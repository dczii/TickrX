import { render, screen } from '@testing-library/react-native';

const mockUseAuth = jest.fn();
jest.mock('@/src/providers/AuthProvider', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('expo-router', () => {
  const { Text, View } = jest.requireActual('react-native');
  function Tabs({ children }: { children: React.ReactNode }) {
    return <View>{children}</View>;
  }
  Tabs.Screen = ({
    name,
    options,
  }: {
    name: string;
    options: {
      title: string;
      tabBarIcon: (props: { color: string; size: number }) => React.ReactNode;
    };
  }) => (
    <View>
      <Text>{`tab:${name}:${options.title}`}</Text>
      {options.tabBarIcon({ color: '#8B949E', size: 24 })}
    </View>
  );
  return {
    Tabs,
    Redirect: ({ href }: { href: string }) => <Text>{`redirect:${href}`}</Text>,
  };
});

import TabLayout from '../../app/(tabs)/_layout';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TabLayout', () => {
  it('renders all four tabs when signed in', () => {
    mockUseAuth.mockReturnValue({
      session: { user: { id: 'u1' } },
      isLoading: false,
    });

    render(<TabLayout />);

    expect(screen.getByText('tab:index:Home')).toBeTruthy();
    expect(screen.getByText('tab:markets:Markets')).toBeTruthy();
    expect(screen.getByText('tab:portfolio:Portfolio')).toBeTruthy();
    expect(screen.getByText('tab:profile:Profile')).toBeTruthy();
  });

  it('redirects to login when signed out', () => {
    mockUseAuth.mockReturnValue({ session: null, isLoading: false });

    render(<TabLayout />);

    expect(screen.getByText('redirect:/login')).toBeTruthy();
  });

  it('shows a loading state while the session is restored', () => {
    mockUseAuth.mockReturnValue({ session: null, isLoading: true });

    render(<TabLayout />);

    expect(screen.getByTestId('auth-loading')).toBeTruthy();
  });
});
