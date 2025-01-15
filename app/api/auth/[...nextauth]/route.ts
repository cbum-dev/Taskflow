import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import jwt from "jsonwebtoken"

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_ID || "",
        clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // Ensure this is set
    encryption: true, // Optional: encrypt the JWT
  },
  callbacks: {
    // Customize JWT token
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account && user) {
        token.accessToken = account.access_token;
      }
      // Add additional fields to the token if necessary
      return token;
    },
    // Customize session object
    async session({ session, token, user }) {
      session.user.id = token.sub;
      session.accessToken = token.accessToken;
      return session;
    },
  },
})

export {handler as GET,handler as POST} 