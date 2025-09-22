import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
interface AuthUser {
  id: string;
  token: string;
  email: string;
  name: string;
  image?: string;
}

declare module "next-auth" {
  interface User {
    id: string;
    token: string;
    email: string;
    name: string;
    image?: string;
  }

  interface Session extends DefaultSession {
    accessToken?: string;
    user: User & DefaultSession["user"];
  }
}

const authOptions: NextAuthOptions = {
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
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const res = await fetch("http://localhost:3001/api/user/login", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });

        const user = await res.json();

        if (!res.ok || !user.token) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.user.id,
          token: user.token,
          email: user.user.email,
          name: user.user.name,
          image: user.user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.token = user.token;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      console.log("JWT Token:", token);
      return token;
    },
    async session({ session, token }) {
      if (token.token) {
        session.user.id = token.id as string;
        session.accessToken = token.token as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
