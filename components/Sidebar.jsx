"use client"
import {  signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { LayoutDashboard,ThermometerIcon, List, LogOut, Phone, Globe2Icon, SmartphoneIcon, StampIcon, GalleryHorizontal } from "lucide-react"
import { Montserrat } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] })


const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin/dashboard",
        color: "text-sky-500",
    },
    {
        label: "Category",
        icon: List,
        href: "/admin/category",
        color: "text-pink-700",
    },
    {
        label: "Website",
        icon: Globe2Icon,
        href: "/admin/website",
        color: "text-violet-500",
    },
    {
        label: "Mobile",
        icon: SmartphoneIcon,
        href: "/admin/mobile",
        color: "text-amber-500",
    },
    {
        label: "Print",
        icon: StampIcon,
        href: "/admin/print",
        color: "text-indigo-500",
    },
    {
        label: "Other Works",
        icon: ThermometerIcon,
        href: "/admin/other-works",
        color: "text-slate-500",
    },
    {
        label: "Blogs",
        icon: GalleryHorizontal,
        href: "/admin/blogs",
        color: "text-rose-500",
    },
    {
        label: "Contact",
        icon: Phone,
        href: "/admin/contact",
        color: "text-green-700",
    },


]


const Sidebar = () => {

    const pathname = usePathname()
   
    return (
        <div className=" space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1 relative">
                <Link href="/admin/dashboard" className=" flex items-center pl-3 mb-14">
                    <div className=" w-8 relative h-8 mr-4">
                        <Image alt="Logo" fill src={'/logo.png'} />
                    </div>
                    <h1 className={cn("text-2xl font-bold", montserrat.className)}>Smartwebin</h1>
                </Link>
                <div className=" space-y-1">
                    {
                        routes.map((route) => {
                            return (
                                <Link href={route.href} key={route.label} className={cn("text-sm group p-3 flex w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition", pathname === route.href ||  pathname.includes(route.href) ? "text-white bg-white/10" : "text-zinc-400")}>
                                    <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                    {
                                        route.label
                                    }
                                </Link>
                            )
                        })
                    }
                    <div onClick={()=>signOut({ callbackUrl:'/admin'})}  className={cn("text-sm group p-3 flex w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition  text-zinc-400")}>
                        <LogOut className={cn("h-5 w-5 mr-3 text-blue-500")} />
                        Logout
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar