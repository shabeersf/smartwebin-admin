"use client"
import { ArrowRight, GalleryHorizontal, Globe2Icon, List, SmartphoneIcon, StampIcon, ThermometerIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const tools = [
  {
    label: "Category",
    icon: List,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    href: "/admin/category",
  },
  {
    label: "Website",
    icon: Globe2Icon,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/admin/website",
  },
  {
    label: "Mobile",
    icon: SmartphoneIcon,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    href: "/admin/mobile",
  },
  {
    label: "Print",
    icon: StampIcon,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    href: "/admin/print",
  },
  {
    label: "Other Works",
    icon: ThermometerIcon,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
    href: "/admin/other-works",
  },
  {
    label: "Blogs",
    icon: GalleryHorizontal,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    href: "/admin/blogs",
  },

]

const DashboardPage = () => {
  const router = useRouter()
  return (
    <div className="p-4 md:px-8">


      <div className=" grid grid-cols-12 gap-4">
        {
          tools.map((tool) => (
            <Card key={tool.href} className="p-4 border-black/5 flex col-span-12 lg:col-span-4 items-center justify-between hover:shadow-md transition cursor-pointer" onClick={() => router.push(tool.href)} >
              <div className="flex items-center gap-x-4">
                <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                  <tool.icon className={cn("w-8 h-8", tool.color)} />
                </div>
                <div className="font-semibold">
                  {tool.label}
                </div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Card>
          ))
        }
      </div>


    </div>
  )
}

export default DashboardPage