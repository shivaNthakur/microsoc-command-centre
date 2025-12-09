import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";

import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { loginSchema } from "@/schema/auth.schema";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    // 1. Parse + validate request body
    const body = await req.json();
    const { email, password, loginAs } = loginSchema.parse(body);

    // 2. Find user (normalize email to lowercase + trim)
    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.findOne({ email: normalizedEmail });
    console.log("Login attempt:", normalizedEmail, "Found:", !!user)

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 3. Enforce role-based login
    if (loginAs === "admin" && user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied! Not an Admin." },
        { status: 403 }
      );
    }

    if (loginAs === "analyst" && user.role !== "analyst") {
      return NextResponse.json(
        { success: false, message: "Login restricted to Analysts only." },
        { status: 403 }
      );
    }
//added new to check approved analyst
    if (user.role === "analyst" && !user.isApproved) {
      return NextResponse.json(
        {
          success: false,
          message: "Your account is pending admin approval.",
        },
        { status: 403 }
      );
    }

    // 4. Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    // 5. Generate JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
        isApproved: user.isApproved,
      },
      process.env.NEXTAUTH_SECRET!, // Use NEXTAUTH_SECRET so getToken() can decode it
      { expiresIn: "7d" }
    );

    // Set a cookie so middleware's `getToken` can read the JWT.
    // Cookie name must match NextAuth's session token cookie name.
    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
    
    // For NextAuth v4 with JWT strategy, use `next-auth.session-token` for dev
    // or adjust based on your NEXTAUTH_URL environment
    const cookieName = process.env.NODE_ENV === "production" 
      ? "__Secure-next-auth.session-token" 
      : "next-auth.session-token";
    
    const cookie = `${cookieName}=${token}; Path=/; HttpOnly; Max-Age=${maxAge}; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`;

    // 6. Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save();

    // 7. Respond Success
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          email: user.email,
          isApproved: user.isApproved,
        },
      },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  } catch (error: any) {
    console.error("Login Error:", error);

    // Zod Validation Error
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, message: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error during login" },
      { status: 500 }
    );
  }
}


// see loginas 


//	•	❌ Analyst cannot login until admin approves.
//	•	✅ Admin can log in as usual.