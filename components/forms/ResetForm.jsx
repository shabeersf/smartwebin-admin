"use client"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {  passwordValidation } from "@/constants/categoryValidation"
import {  resetPassword } from "@/lib/actions/category.action"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Card } from "../ui/card"
import toast from "react-hot-toast"

const ResetForm = () => {

  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(passwordValidation),
    defaultValues: {
      old_pass: "",
      new_pass: "",
      conf_pass: "",
    }
  })


  let isLoading = form.formState.isSubmitting;

  const onSubmit = async (values) => {

    if(values.new_pass === values.conf_pass)
    {
        try {
            // Start the form submission
            await resetPassword({
              password: values.new_pass,
              old_pass: values.old_pass,
              path: pathname
            });
            toast.success('Password reset successfully')
            form.reset()
          } catch (error) {
      
            // Handle other errors
            toast.error(error.message);
      
          } finally {
            // Finish the form submission, whether it succeeds or fails
            isLoading = false
          }
    }
    else{
        toast.error('Password and Confirm Password do not match.')
    }

    
  };

  return (
    <>
      
      <Card className={cn("p-3 mt-4 shadow-lg")}>
      <h5 className="font-semibold py-3 border-b border-muted">
            Reset Password
          </h5>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 grid grid-cols-12 gap-2 ">
              <FormField
                name="old_pass"
                render={({ field }) => (
                  <FormItem className=" col-span-12 py-2">
                    <FormLabel>Current Password</FormLabel>
                    <FormControl className="m-0 p-0">
                      <Input type="text" className=" w-full border shadow-sm p-2 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading}
                        placeholder="Current Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="new_pass"
                render={({ field }) => (
                  <FormItem className=" col-span-12 py-2">
                    <FormLabel>New Password</FormLabel>
                    <FormControl className="m-0 p-0">
                      <Input type="text" className=" w-full border shadow-sm p-2 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading}
                        placeholder="New Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="conf_pass"
                render={({ field }) => (
                  <FormItem className=" col-span-12 py-2">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl className="m-0 p-0">
                      <Input type="text" className=" w-full border shadow-sm p-2 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading}
                        placeholder="Confirm Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="md:col-span-2 col-span-5 w-full" disabled={isLoading}>
                Update
              </Button>
            </form>
          </Form>
        </div>
      </Card>
    </>
  )
}

export default ResetForm