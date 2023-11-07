"use client"
import { LogOut } from 'lucide-react'
import { signOut } from "next-auth/react"


const LogoutFunction = () => {
    return (
        <>
            <div onClick={() => signOut({ callbackUrl: '/admin' })} className=' cursor-pointer flex justify-between items-center w-full'>
                <p className='w-fit'> Logout</p>
                <LogOut size={20} />
            </div>

        </>
    )
}

export default LogoutFunction