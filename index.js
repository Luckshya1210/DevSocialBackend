import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'
import dotenv from 'dotenv'
const app=express();

dotenv.config();
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());
app.use(express.json());
app.use('/posts',postRoutes);
app.use('/user',userRoutes);
app.get("/",(req,res)=>{
    res.send("<h1>Working</h1>");
});
const CONNECTION=process.env.URL
const PORT=process.env.PORT || 8800
mongoose.set('strictQuery', true);
mongoose.connect(CONNECTION,{useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>app.listen(PORT,()=>console.log(`Server running on port ${PORT}`)))
    .catch((error)=>console.log(error.message))

// mongoose.set('useFindAndModify',false)