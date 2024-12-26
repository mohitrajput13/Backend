import jwt from 'jsonwebtoken'

export const auth  = (request, response, next) =>{
    try {
        let token  = request.headers.authorization.split(" ")[1];
        let status = jwt.verify(token, "klsnd8asdkasldmr9374rasd98");
        if(status)
            next();
        else
            return response.status(401).json({error : "Invalid token"});
    } catch (error) {
        console.log(error);
        return response.status(501).json({error : "Internal server error"});
    }
}