import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { z } from "zod";

import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["analyst"], "Only analysts can self-register"),
});

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { name, email, password, role } = signupSchema.parse(body);

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new analyst (isApproved defaults to false)
    const newUser = new UserModel({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "analyst",
      isApproved: false, // Pending admin approval
      isActive: true,
    });

    await newUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "Signup successful! Please wait for admin approval.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          isApproved: newUser.isApproved,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup Error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, message: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error during signup" },
      { status: 500 }
    );
  }
}
