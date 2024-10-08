  const jwt = require('jsonwebtoken');

  const checkTocken=(req, res, next)=>{
    try{
        
        const secretKey= process.env.JWT_SECRETKEY;
        const authorizationHeader = req.headers['authorization'];
        
        if(!authorizationHeader){
          return res.status(401).json({
            message: 'Unauthorized: No authorization header provided'
          });

        }
          const token = authorizationHeader.replace('Bearer ', '');
          jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
              res.json({message: `verification fialed due to  ${err.message}`, expiry: err.message});
            } else {
              const expirationTime = decoded.exp;
              const currentTime = Math.floor(Date.now() / 1000);
    
              if (expirationTime < currentTime) {
                console.log('Authorization header has expired');
              } else {
                req.tokens= decoded;
                next();
              }
            }
          });
      
    }
    catch (err){
        console.log(err);
        res.status(401).json({
          message: 'Unauthorized',
          error: err.message
        })
    }
  };

  module.exports=checkTocken;