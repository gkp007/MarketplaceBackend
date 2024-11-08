import dotenv from "dotenv";
import app from "./app";
import connectDb from "./config/db";

dotenv.config();
// DB
connectDb();
const server = app.listen(process.env.PORT,()=>{
    console.log(`server is Working..`)
})

// unhandel Promise rejection
process.on('unhandledRejection',(err:any)=>{
    console.log(`Error ${err.message}`);
    console.log(`Shutting down the server due to Unhadel Promise rejection`);

    server.close(()=>{
        process.exit(1)
    })
})