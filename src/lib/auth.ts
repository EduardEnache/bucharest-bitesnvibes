import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

function getWhitelistedEmails(): string[] {
  const emails = process.env.WHITELISTED_EMAILS || '';
  return emails
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  callbacks: {
    async signIn({ user }) {
      const whitelisted = getWhitelistedEmails();
      if (whitelisted.length === 0) {
        // If no whitelist is configured, allow all (dev mode)
        return true;
      }
      const email = user.email?.toLowerCase();
      if (!email || !whitelisted.includes(email)) {
        return false;
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.picture = user.image;
        token.name = user.name;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
