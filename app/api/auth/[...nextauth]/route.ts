import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

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
        authorization: {
          params: {
            access_type: "offline", 
            response_type: "code",
            prompt: "consent", 
          },
        }}),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token; 
      }
      console.log(token)
      return token;
    },
    async session({ session, token }) {
      if (token.access_token) {
        session.access_token = token.access_token; 
      }
      return session;
    },
  },
  
})

export {handler as GET,handler as POST} 