"use client"
import { Card } from "@/components/ui/card"
import { SessionProvider, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"


const LoginForm = () => {

    const router = useRouter()
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formdata = new FormData(e.currentTarget)
        const response = await signIn('credentials', {
            name: formdata.get('name'),
            password: formdata.get('password'),
            redirect: false
        });
        if (response?.error) {
            console.log(response?.error)
            response?.status ===401 ? toast.error("Invalid username or password") : toast.error(response?.error);
            
        }
        else {
            router.push('/admin/dashboard')
        }

    }
    return (
        <div className=' grid place-items-center h-screen'>
            <Card className="hover:shadow-lg border-t-4 border-blue-400  py-4 p-2 space-y-5">
                <h3>Enter Details</h3>
                <form onSubmit={handleSubmit} className=" flex flex-col gap-5">
                    <input name="name" className='min-w-[320px] p-2 bg-slate-300 rounded-md ' type="text" placeholder='Username' />
                    <input name="password" className='min-w-[320px] p-2 bg-slate-300 rounded-md ' type="password" placeholder='Password' />
                    <button className='bg-green-600  text-white font-bold cursor-pointer px-6 py-2 rounded-md hover:opacity-90'>Login</button>
                </form>
            </Card>
        </div>
    )
}

export default LoginForm