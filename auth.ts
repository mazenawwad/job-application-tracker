import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import z from "zod";

const credentialsSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(5, { error: "Password should be at least 5 characters long." }),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const response = credentialsSchema.safeParse(credentials);
        if (!response.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: response.data.email,
          },
        });
        if (!user) {
          return null;
        }
          const passwordsMatch = await bcrypt.compare(
            response.data.password,
            user.passwordHash,
          );
          if (!passwordsMatch) {
            return null;
        }
        return {
          email: user.email,
          id: String(user.id)
        };
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}){
      if(user){
        token.id = user.id
      }
      return token;
    },
    async session({session, token}){
      if(session){
        session.user.id = token.id as string;
      }
      return session;
    }
  }
});
