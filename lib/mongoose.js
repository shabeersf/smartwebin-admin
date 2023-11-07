import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const connectToDB =async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI).then(()=>{
            console.log('connected to db')
           }) 
    } catch (error) {
        return NextResponse.json({
            message: `Error connecting mongodb : ${error}`,
            status: 500
        })
    }
}