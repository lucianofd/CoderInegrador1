import 'dotenv/config';
import mongoose from "mongoose";

const databaseURL = process.env.DATABASE_URL;
mongoose.connect(databaseURL)
.then(()=>{
    console.log('Database connected');
})
.catch((err)=>{
      console.log('Database connection failed' + err);
})