import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { CustomUser } from "./app/api/auth/[...nextauth]/options";


export async function middlewar(request:NextRequest) {
    const {pathname} = request.nextUrl;
    //add login route of admin or genral login
    if(pathname == '/' || pathname == "/")  {
        return NextResponse.next();
    }    //add login route of admin or genral login

    const token = await getToken({req:request}) 

    // Protected routes for user
    const userProtectedRoutes = ['/','/']  //could make multiple protected routes to stop user from from accessing

    const adminProtectedRoutes = ["/admin/dashboard"];

    // dont have token
if (
    token == null &&
    (userProtectedRoutes.includes(pathname) ||
      adminProtectedRoutes.includes(pathname))
  ) {
    return NextResponse.redirect(
      new URL(
        "/login?error=Please login first to access this route",
        request.url
      )
    );
  }
    // * Get user from token
    const user: CustomUser | null = token?.user as CustomUser;

  // * if user try to access admin routes
  if (adminProtectedRoutes.includes(pathname) && user.role == "analyst") {
    return NextResponse.redirect(
      new URL(
        "/admin/login?error=Please login first to access this route.",
        request.url
      )
    );
  }

  //   * If Admin try to access user routes
  if (userProtectedRoutes.includes(pathname) && user.role == "admin") {
    return NextResponse.redirect(
      new URL(
        "/login?error=Please login first to access this route.",
        request.url
      )
    );
  }
}






// see that admin is doing signup or not atleast one time 