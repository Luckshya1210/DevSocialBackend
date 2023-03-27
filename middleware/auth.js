import jwt from 'jsonwebtoken'
const auth= async(req,res,next)=>{
    try{
        console.log(req.headers)
        const token=req.headers.authorization.split(" ")[1];
        const len=token.length<500;
        let decodeddata;
        if(token && len){
            decodeddata=jwt.verify(token,'test');
            // console.log(decodeddata);
            req.userId=decodeddata?.id;
        }else{
            decodeddata=jwt.decode(token);
            req.userId=decodeddata?.sub
        }   
        next()
    }
    catch(err){
        console.log(err);
    }
}
export default auth