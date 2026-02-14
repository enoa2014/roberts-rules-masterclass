import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

import { verifyPassword } from "@/lib/password";
import { findUserById, findUserByUsername } from "@/lib/user-store";

const credentialSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "用户名密码",
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const user = findUserByUsername(parsed.data.username);
        if (!user || !user.password) {
          return null;
        }

        const isValidPassword = await verifyPassword(
          parsed.data.password,
          user.password,
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: String(user.id),
          name: user.nickname ?? user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.role) {
        token.role = user.role;
      }

      if (!token.role && token.sub) {
        const dbUser = findUserById(Number(token.sub));
        if (dbUser) {
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as string | undefined) ?? "registered";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
