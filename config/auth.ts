import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
let beUrl = process.env.BE_URL;


export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    //max age 1 jam
    maxAge: 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Email",
          type: "text",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {    
        const { username, password } = credentials as any;        
        const payload = {
          username: username,
          password: password,
          system: "General"
        }
        const res = await fetch(beUrl+"/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });                
        
        const user = await res.json() 
        console.log(user.responseCode);
               
        if(user.responseCode == 200){ 
          const users = user
          return users
        }else{
          return null           
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return {...token, ...user}
    },
    async session({ session, user, token }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },

};