import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      nombre: string;
      esAprobador: boolean;
      cargo: string | null;
      areaId: string | null;
    } & DefaultSession["user"];
  }

  interface JWT {
    id?: string;
  }
}
