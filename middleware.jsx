export { default } from "next-auth/middleware"

export const config = { matcher: ["/admin/dashboard","/admin/portfolio/:path*","/admin/category/:path*","/admin/website/:path*","/admin/mobile/:path*","/admin/print/:path*","/admin/blogs/:path*","/admin/other-works/:path*","/admin/contact/:path*"] }