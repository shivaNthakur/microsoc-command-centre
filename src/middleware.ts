export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs',
};
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup", "/auth/login", "/auth/signup"];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Get session token using NextAuth
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Protected routes
  const adminProtectedRoutes = ["/admin/dashboard"];
  const analystProtectedRoutes = ["/analyst/dashboard"];

  // If no token, redirect to login
  if (!token) {
    if (adminProtectedRoutes.includes(pathname) || analystProtectedRoutes.includes(pathname)) {
      return NextResponse.redirect(
        new URL("/login?error=Please login first to access this route", request.url)
      );
    }
  }

  // If token exists, check role-based access control
  if (token) {
    const userRole = (token as any).role as string;

    // Admin trying to access analyst routes
    if (analystProtectedRoutes.includes(pathname) && userRole === "admin") {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }

    // Analyst trying to access admin routes
    if (adminProtectedRoutes.includes(pathname) && userRole === "analyst") {
      return NextResponse.redirect(
        new URL("/analyst/dashboard", request.url)
      );
    }
  }

  return NextResponse.next();
}






// see that admin is doing signup or not atleast one time 



// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";
// //import { CustomUser } from "./app/api/auth/[...nextauth]/options";

// export type CustomUser = {
//   id?: string | null;
//   name?: string | null;
//   email?: string | null;
//   role?: string | null;
//   avatar?: string | null;
// };
// export async function middleware(request:NextRequest) {
//     const {pathname} = request.nextUrl;
//     //add login route of admin or genral login
//     if(pathname == '/' || pathname == "/")  {
//         return NextResponse.next();
//     }    //add login route of admin or genral login

//     const token = await getToken({req:request}) 

//     // Protected routes for user
//     const userProtectedRoutes = ['/','/']  //could make multiple protected routes to stop user from from accessing

//     const adminProtectedRoutes = ["/admin/dashboard"];

//     // dont have token
// if (
//     token == null &&
//     (userProtectedRoutes.includes(pathname) ||
//       adminProtectedRoutes.includes(pathname))
//   ) {
//     return NextResponse.redirect(
//       new URL(
//         "/login?error=Please login first to access this route",
//         request.url
//       )
//     );
//   }
//     // * Get user from token
//     const user: CustomUser | null = token?.user as CustomUser;

//   // * if user try to access admin routes
//   if (adminProtectedRoutes.includes(pathname) && user.role == "analyst") {
//     return NextResponse.redirect(
//       new URL(
//         "/admin/login?error=Please login first to access this route.",
//         request.url
//       )
//     );
//   }

//   //   * If Admin try to access user routes
//   if (userProtectedRoutes.includes(pathname) && user.role == "admin") {
//     return NextResponse.redirect(
//       new URL(
//         "/login?error=Please login first to access this route.",
//         request.url
//       )
//     );
//   }
// }






// // see that admin is doing signup or not atleast one time 