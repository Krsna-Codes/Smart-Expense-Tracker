import jwt from 'jsonwebtoken';

const auth = (req,res,next) => {
    try{
        const authHeader = req.headers.authorization;

        // header exists & starts with Bearer.
        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({message: "No Token, Authorization Denied"});
        }

        // get token
        const token = authHeader.split(" ")[1];

        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request
        req.user = {id: decoded.userId};

        // continue
        next();
    }catch(error) {
        console.error("Auth Middleware Error", error);
        return res.status(401).json({message: "Token is not Valid"});
    }
}

export default auth;