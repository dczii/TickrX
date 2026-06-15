import { render, screen } from "@testing-library/react-native";

const mockGetSession = jest.fn();
jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
  },
}));

jest.mock("expo-router", () => {
  const { Text, View } = jest.requireActual("react-native");
  function Stack({ children }: { children: React.ReactNode }) {
    return <View>{children}</View>;
  }
  Stack.Screen = ({ name }: { name: string }) => <Text>{`screen:${name}`}</Text>;
  return { Stack };
});

jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));

import RootLayout from "../../app/_layout";

describe("RootLayout", () => {
  it("wraps the router stack in the auth provider", () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });

    render(<RootLayout />);

    expect(screen.getByText("screen:(tabs)")).toBeTruthy();
    expect(screen.getByText("screen:login")).toBeTruthy();
  });
});
