import mongoose from "mongoose";
mongoose.set('strictQuery', true)

const connectDB = async (url:string) => {
   await mongoose.connect(url)
   console.log("connected to mongodb")
}
export default connectDB