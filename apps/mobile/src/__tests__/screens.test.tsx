import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

const mockUseAuth = jest.fn();
jest.mock('@/src/providers/AuthProvider', () => ({
  useAuth: () => mockUseAuth(),
}));

const mockSignOut = jest.fn();
jest.mock('@/src/lib/auth', () => ({
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

import { ScreenShell } from '@/src/components/ScreenShell';
import HomeScreen from '../../app/(tabs)/index';
import MarketsScreen from '../../app/(tabs)/markets';
import PortfolioScreen from '../../app/(tabs)/portfolio';
import ProfileScreen from '../../app/(tabs)/profile';

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuth.mockReturnValue({
    session: { user: { id: 'u1', email: 'alice@example.com' } },
    isLoading: false,
  });
});

describe('ScreenShell', () => {
  it('renders without a subtitle', () => {
    render(<ScreenShell title="Bare" />);
    expect(screen.getByText('Bare')).toBeTruthy();
  });
});

describe('tab screens', () => {
  it('Home shows the starting portfolio value', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('$100,000.00')).toBeTruthy();
  });

  it('Markets renders its header', () => {
    render(<MarketsScreen />);
    expect(screen.getByText('Markets')).toBeTruthy();
  });

  it('Portfolio renders its header', () => {
    render(<PortfolioScreen />);
    expect(screen.getByText('Portfolio')).toBeTruthy();
  });

  it('Profile shows the signed-in email and signs out', async () => {
    mockSignOut.mockResolvedValue(undefined);
    render(<ProfileScreen />);

    expect(screen.getByText('alice@example.com')).toBeTruthy();

    fireEvent.press(screen.getByTestId('sign-out'));
    await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1));
  });

  it('Profile surfaces sign-out failures', async () => {
    mockSignOut.mockRejectedValue(new Error('network down'));
    render(<ProfileScreen />);

    fireEvent.press(screen.getByTestId('sign-out'));
    await waitFor(() => expect(screen.getByText('network down')).toBeTruthy());
  });

  it('Profile shows a generic message for non-Error failures', async () => {
    mockSignOut.mockRejectedValue('boom');
    render(<ProfileScreen />);

    fireEvent.press(screen.getByTestId('sign-out'));
    await waitFor(() =>
      expect(screen.getByText('Sign-out failed. Try again.')).toBeTruthy()
    );
  });

  it('Profile shows Unknown when no session email exists', () => {
    mockUseAuth.mockReturnValue({ session: null, isLoading: false });
    render(<ProfileScreen />);
    expect(screen.getByText('Unknown')).toBeTruthy();
  });
});
