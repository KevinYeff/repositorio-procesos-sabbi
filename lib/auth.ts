import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { authConfig } from "@/lib/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.nombre,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        const dbUser = await prisma.usuario.findUnique({
          where: { id: token.id as string },
          select: {
            id: true,
            email: true,
            nombre: true,
            cargo: true,
            esAprobador: true,
            areaId: true,
          },
        });
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.nombre = dbUser.nombre;
          session.user.esAprobador = dbUser.esAprobador;
          session.user.cargo = dbUser.cargo;
          session.user.areaId = dbUser.areaId;
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
