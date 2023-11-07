

import  { Toaster } from 'react-hot-toast';

const AdminLayout = ({children}) => {
  return (
    <main>
     {children}  
     <Toaster /> 
    </main>
  )
}

export default AdminLayout