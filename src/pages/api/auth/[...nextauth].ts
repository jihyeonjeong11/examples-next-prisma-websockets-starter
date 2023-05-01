import NextAuth from 'next-auth';
import { AppProviders } from 'next-auth/providers';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/GoogleProvider"

let useMockProvider = process.env.NODE_ENV === 'test';
const { Google_ID, GOOGLE_SECRET, NODE_ENV, APP_ENV } = process.env;
if (
  (NODE_ENV !== 'production' || APP_ENV === 'test') &&
  (!Google_ID || !GOOGLE_SECRET)
) {
  console.log('⚠️ Using mocked GitHub auth correct credentials were not added');
  useMockProvider = true;
}
const providers: AppProviders = [];
if (useMockProvider) {
  providers.push(
    CredentialsProvider({
      id: 'github',
      name: 'Mocked GitHub',
      async authorize(credentials) {
        if (credentials) {
          const user = {
            id: credentials.name,
            name: credentials.name,
            email: credentials.name,
          };
          return user;
        }
        return null;
      },
      credentials: {
        name: { type: 'test' },
      },
    }),
  );
} else {
  if (!Google_ID || !GOOGLE_SECRET) {
    throw new Error('Google_ID and GOOGLE_SECRET must be set');
  }
  providers.push(
    GoogleProvider({
      clientId: Google_ID,
      clientSecret: GOOGLE_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.login,
          email: profile.email,
          image: profile.avatar_url,
        } as any;
      },
    }),
  );
}
export default NextAuth({
  // Configure one or more authentication providers
  providers,
});
