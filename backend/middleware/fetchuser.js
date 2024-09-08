const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Abinashisagoodb$oy';

const fetchuser = (req,res,next) => {
    // Get the user from the jwt token and add id to the req object
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).send({error: "please authenticate using valid token"});
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
        
    } catch (error) {
        res.status(401).send({error: "Internal Server Error"});
    }
}

module.exports = fetchuser;