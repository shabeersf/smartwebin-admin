import LoginForm from '@/components/forms/LoginForm'
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

const AdminLogin = async() => {
  const session = await getServerSession();
  if(session) redirect('/admin/dashboard')
  return (
    <div >
        <LoginForm />
    </div>
  )
}

export default AdminLogin