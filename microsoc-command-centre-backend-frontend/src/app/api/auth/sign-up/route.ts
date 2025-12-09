import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { signupSchema } from "@/schema/userschema";
import bcrypt from "bcryptjs"; 
import {ZodError} from "zod";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    // 1. Parse and validate input using Zod
    const body = await req.json();
    const parsedData = signupSchema.parse(body);

    const { name, email, password } = parsedData; //remove roll from {}

    // 2. Check if user already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists with this email" },
        { status: 400 }
      );
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: "analyst", // default role
      isActive: true,
      isApproved: false, //pending approval added new
    });

    return NextResponse.json(
      {
        success: true,
        message: "Signup successful. Waiting for admin approval.",
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
  }  catch (error: any) {
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



// //catch (error: any) {
//     console.error("Signup Error:", error);

//     // Zod validation error
//     if (error.errors) {
//       return NextResponse.json(
//         { success: false, message: error.errors[0].message },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { success: false, message: "Server error during signup" },
//       { status: 500 }
//     );
//   }
// }






// After signup, show: “Your account is pending admin approval.”