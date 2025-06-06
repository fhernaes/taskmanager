import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/app/libs/prisma";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "tuemail@ejemplo.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, email: true, username: true, password: true, role: true}, 
        });

        if (!user) throw new Error("Usuario no encontrado");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error("Credenciales incorrectas");

        return { id: user.id, email: user.email, username: user.username, role: user.role };
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login", // Ruta para errores de autenticación
    verifyRequest: "/login", // Ruta para verificar solicitud
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Solo redirigir a dashboard si el usuario intenta acceder a la raíz con sesión iniciada
      if (url.pathname === '/' && url === baseUrl) {
        return baseUrl + '/dashboard';
      }
      return url;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
        token.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 2;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        username: token.username,
        role: token.role,
      };
      session.expires = new Date(token.exp * 1000).toISOString(); 
      return session;
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
        token.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 2;
      }
      
      return token;
    },


    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        username: token.username,
        role: token.role,
      };
   
      session.expires = new Date(token.exp * 1000).toISOString(); 
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt", 
    maxAge: 2 * 60 * 60, 
  },

  jwt: {
    maxAge: 2 * 60 * 60, 
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
