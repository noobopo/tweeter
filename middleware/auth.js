import jwt  from 'jsonwebtoken'

export const isAuthonticated=async(req,res,next)=>{
    try {
        const token = req.cookies.token 
        if (!token) {
            return res.status(401).json({
                message:"Please login!",
                success:false
            })
        }
        const decode = jwt.verify(token,process.env.SECRET)
        req.user = decode.userId 
        next()
    } catch (error) {
        
    }
}