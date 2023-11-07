import MobileSidebar from '@/components/MobileSidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { LogOut, Settings } from 'lucide-react'
import LogoutFunction from './LogoutFunction'


const Navbar = () => {
    return (
        <div className='flex items-center px-4 py-3 border-b border-slate-400'>
            <MobileSidebar />
            <div className='flex w-full justify-end'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Admin</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup >


                            <DropdownMenuItem >
                                <Link href="/admin/reset-password" className="w-full">
                                    <div className='flex justify-between items-center w-full'>
                                        <p className='w-fit'> Settings</p>
                                        <Settings size={20} />
                                    </div>
                                </Link>

                            </DropdownMenuItem>

                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />



                        <DropdownMenuItem>
                            <LogoutFunction />
                           
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

        </div>
    )
}

export default Navbar