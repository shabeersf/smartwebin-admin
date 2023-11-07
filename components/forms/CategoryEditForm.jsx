import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { categoryValidation } from "@/constants/categoryValidation";
import { updateCategory } from "@/lib/actions/category.action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


const CategoryEditForm = ({ id, result }) => {

    const router = useRouter();


    const form = useForm({
        resolver: zodResolver(categoryValidation),
        defaultValues: {
            title: result?.title || ""
        }
    })

    let isLoading = form.formState.isSubmitting;

    const onSubmit = async (values) => {
        // console.log(values);
        try {
            // Start the form submission
            await updateCategory({
                id,
                title: values.title
            });
            toast.success('Category updated successfully')

        } catch (error) {

            // Handle other errors
            toast.error(error.message);

        } finally {
            // Finish the form submission, whether it succeeds or fails
            isLoading = false
            router.back()
        }
    };
    return (
        <Card className={cn("p-3 mt-4 shadow-lg")}>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 grid grid-cols-12 gap-2 ">
                        <FormField
                            name="title"
                            render={({ field }) => (
                                <FormItem className=" col-span-12 py-2">
                                    <FormControl className="m-0 p-0">
                                        <Input type="text" className=" w-full border shadow-sm p-2 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading}
                                            placeholder="Title"  {...field} />
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
    )
}

export default CategoryEditForm