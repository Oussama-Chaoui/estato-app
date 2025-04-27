"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/components/lib/utils/twMerge"
import { Poppins } from "next/font/google"
import CustomBreadcrumbs from "@/components/lib/navigation/CustomBreadCrumbs"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

interface HeroHeaderProps {
  title: string
  image: string
  className?: string
}

const HeroHeader = ({ title, image, className }: HeroHeaderProps) => {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbs = [{ name: "Home", href: "/" }]
  segments.forEach((seg, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    breadcrumbs.push({ name: seg.charAt(0).toUpperCase() + seg.slice(1), href })
  })

  return (
    <div className={cn(poppins.className, `relative w-full h-[320px] ${className}`)}>
      <Image
        src={image}
        alt={title}
        layout="fill"
        objectFit="cover"
      />
      <div className="absolute inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center">
        <h1 className="text-black text-5xl font-medium tracking-widest">{title}</h1>
        <div className="mt-4">
          <CustomBreadcrumbs links={breadcrumbs} />
        </div>
      </div>
    </div>
  )
}

export default HeroHeader
