import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        // 👇 you’ll send this from frontend as hidden / select
        loginAs: { label: "Login As", type: "text" }, // "admin" or "analyst"
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password || !credentials.loginAs) {
          throw new Error("Missing credentials");
        }

        const loginAs = credentials.loginAs as "admin" | "analyst";

        await dbConnect();

        // Normalize email before lookup
        const normalizedEmail = credentials.email.toLowerCase().trim();
        const user = await UserModel.findOne({ email: normalizedEmail });

        if (!user) {
          throw new Error("User not found");
        }

        // role check
        if (loginAs === "admin" && user.role !== "admin") {
          throw new Error("You are not an admin");
        }

        if (loginAs === "analyst" && user.role !== "analyst") {
          throw new Error("You are not an analyst");
        }

        // analyst must be approved
        if (user.role === "analyst" && !user.isApproved) {
          throw new Error("Your account is pending admin approval");
        }

        if (!user.isActive) {
          throw new Error("Your account has been deactivated");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }

        // update lastLogin
        user.lastLogin = new Date();
        await user.save();

        // This object becomes `user` in jwt callback
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          isApproved: user.isApproved,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // runs on login + every token refresh
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.isApproved = (user as any).isApproved;
        token.name = (user as any).name;
        token.email = (user as any).email;
      }
      return token;
    },
    async session({ session, token }) {
      // expose token data to client
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).isApproved = token.isApproved;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // your login page path
  },
  secret: process.env.NEXTAUTH_SECRET,
};






// import { ISODateString, NextAuthOptions } from "next-auth";
// /* 	    •	NextAuthOptions is a TypeScript type    used to define the shape of the authOptions object.
//         •	✅ Helps ensure you define all required fields like providers, callbacks, etc.
//         •	❌ Without it, you lose IntelliSense and type-checking.
//         •	💬 Interview Q: “Why is strong typing important in auth config? 
// */


// import CredentialsProvider from "next-auth/providers/credentials";
//  /* 	•	This enables custom email/password login.
//         •	Used instead of OAuth (Google, GitHub, etc.).
//         •	✅ Ideal for first-party apps, admin panels.
//         •	❌ Without this, you can’t define custom login logic.  
// */
// import bcrypt from "bcryptjs";

// import { dbConnect } from "@/lib/dbConnect";
// import UserModel from "@/models/User";

// // see this as requirements
// export type CustomSession = {
//   user?: CustomUser;
//   expires: ISODateString;
// };

// export type CustomUser = {
//   id?: string | null;
//   name?: string | null;
//   email?: string | null;
//   role?: string | null;
//   avatar?: string | null;
// };

// export const authOptions: NextAuthOptions = {
//     providers: [
//         // TODO: sign-in with google and github.
//         CredentialsProvider({
//             id: 'credentials',
//             name: 'Credentials',
//             credentials: {
//                  email: { label: 'Email', type: 'text' },
//                 password: { label: 'Password', type: 'password' },
//             },
//             async authorize(credentials:any): Promise<any> {
//                 await dbConnect();
//                 try {
//                     const user = await UserModel.findOne({
//                         $or: [
//                             {email: credentials.identifier},
//                             {username: credentials.identifier},
//  // • credentials.identifier = user input field. ❗But your credentials above has only email, not identifier.
// // 🔥 This will break unless your frontend sends identifier manually.
//                         ],
//                     });
//                     if(!user) {
//                         throw new Error('No user found with this email');
//                     }
//                     if (!user.isVerified) {
//                         throw new Error ('Please verify your account before logging in')
//                     }
//                     const isPasswordCorrect = await bcrypt.compare(
//                         credentials.password,
//                         user.password
//                     );
//                     if(isPasswordCorrect) {
//                         return user;
//                     } else{
//                         throw new Error('Incorrect password');
//                     }

//                 } catch (err: any) {
//                     throw new Error(err);
                    
//                 }
                
//             }
//         })
//     ],
//     callbacks: {
//  /* 
//     •	Called on login and token refresh.
// 	•	Adds extra fields to token (e.g., _id, username).
// 	•	These fields are stored in cookies (for stateless auth).
//  */       
//             async jwt({ token , user }) {
//                 if (user) {
//                     token._id = user._id?.toString();
//                     token.isVerified = user.isVerified;
//                     token.isAcceptingMessages = user.isAcceptingMessages;
//                     token.username = user.username;
//                 }
//                 return token;
//             },
//  /* 
//     •	Called when session is created (browser tab load, page refresh).
// 	•	Assigns token values into session.user.
//     •	✅ Now your frontend can use session.user.username for UI personalization.
//  */
//             async session ({ session, token }) {
//                 if (token) {
//                     session.user._id = token._id;
//                     session.user.isVerified = token.isVerified;
//                     session.user.isAcceptingMessages = token.isAcceptingMessages;
//                     session.user.username = token.username;
//                 }
//                 return session;
//             }
        
//     },
//  /* 
//     •	Using JWT strategy (token stored client-side).
// 	•	Alternative is database session storage (more control, more infra).
//  */
//     session: {
//         strategy: 'jwt',
//     },
//     secret: process.env.NEXTAUTH_SECRET,
//     pages: {
//         signIn: '/sign-in',
//     },
// };