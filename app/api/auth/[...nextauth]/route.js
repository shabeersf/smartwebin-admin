
import NextAuth from "next-auth/next";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import User from "@/components/models/user.model";
import { connectToDB } from "@/lib/mongoose";
 const handler = NextAuth({
  session:{
    strategy:"jwt"
},
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. 'Sign in with...')
          name: 'Credentials',
          // The credentials is used to generate a suitable form on the sign in page.
          // You can specify whatever fields you are expecting to be submitted.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
          
          },
          async authorize(credentials, req) {
            // You need to provide your own logic here that takes the credentials
            // submitted and returns either a object representing a user or value
            // that is false/null if the credentials are invalid.
            // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
            // You can also use the `req` object to obtain additional parameters
            // (i.e., the request IP address)
          
          
            
            try {
                const { name, password } = credentials;
                await connectToDB(); // Make sure connectToDB returns a Promise or is an async function
                const user= await User.findOne({name});
                    if (!user){
                    return null
                    }
                    const passMatch = await bcrypt.compare(password,user.password);
                    if(!passMatch)
                    {
                        return null
                    }
                    return{
                        id:user._id,
                        name:user.name,
                        email:user.email,
                    }
                    


            } catch (error) {
                console.log(error)
            }
            // If no error and we have user data, return it
            // if (res.ok && user) {
            //   return user
            // }
            // Return null if user data could not be retrieved
            
          }
        })
      ],
      secret:process.env.NEXTAUTH_SECRET,
      pages:{
          signIn:"/admin",// pages used for login
      },
})

export {handler as GET,handler as POST}