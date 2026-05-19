import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import type { FunctionComponent, ReactNode } from "react";

const convexUrl = (import.meta.env.PUBLIC_CONVEX_URL || import.meta.env.NEXT_PUBLIC_CONVEX_URL) as string;
const clerkPubKey = (import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) as string;

if (!convexUrl) {
  console.error("URL Convex manquante ! Vérifiez votre fichier .env");
}

if (!clerkPubKey) {
  console.error("Clerk Publishable Key manquante ! Vérifiez votre fichier .env");
}

const client = new ConvexReactClient(convexUrl);

/**
 * Higher-order component to wrap React islands in both Clerk and Convex providers.
 * Required because Astro islands run in separate React roots.
 */
export function withConvexProvider<P extends object>(
  Component: FunctionComponent<P>
) {
  return function WithConvexProvider(props: P) {
    return (
      <ClerkProvider publishableKey={clerkPubKey}>
        <ConvexProviderWithClerk client={client} useAuth={useAuth}>
          <Component {...props} />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    );
  };
}

/**
 * Default export provider to support Layout.astro's wrapping of slot if needed.
 */
export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ConvexProviderWithClerk client={client} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}