import * as z from "zod"

export const categoryValidation = z.object({
    title:z.string().min(1,{
        message:"Category  is required."
    })
})
export const passwordValidation = z.object({
    old_pass:z.string().min(1,{
        message:"Current password  is required."
    }),
    new_pass:z.string().min(1,{
        message:"New password  is required."
    }),
    conf_pass:z.string().min(1,{
        message:"Confirm password  is required."
    }),
})


export const portfolioValidation = z.object({
    title:z.string().min(1,{
        message:"Website Name  is required."
    }),
    linkUrl:z.string().min(1,{
        message:"Weblink is required."
    }),
    category:z.string().min(1,{
        message:"Category  is required."
    }),
    image: z
    .any()
})

export const mobileValidation = z.object({
    title:z.string().min(1,{
        message:"Title  is required."
    }),
    appstore:z.string(),
    playstore:z.string(),
    description:z.string().min(1,{
        message:"Description  is required."
    }),
    type:z.string().min(1,{
        message:"Type  is required."
    }),
    logo: z
    .any()
})

export const blogValidation = z.object({
    title:z.string().min(1,{
        message:"Title  is required."
    }),
    date:z.date(),
    description:z.string().min(1,{
        message:"Description  is required."
    }),
    image: z
    .any()
})

export const otherValidation = z.object({
    title:z.string().min(1,{
        message:"Title  is required."
    }),
    cover_img: z
    .any(),
    images: z
    .any(),
})

export const printValidation = z.object({
    title:z.string().min(1,{
        message:"Title  is required."
    }),
    image: z
    .any()
})