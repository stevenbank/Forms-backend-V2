const pool = require('../../config/db');
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_KEY;


const IS_SUPER = async (req,res,next) => {
    const { admin_key } = req.body;
    if(admin_key != process.env.super_admin_key){
        return res.sendStatus(401);
    }

    next();
}

const IS_ADMIN = async (req,res,next) => {
    try {
        const  { auth_token } = req.body;
        const decode = await jwt.verify(auth_token,jwt_key);

        // console.log(decode);

        const {admin_id} = decode;
        
        const sql = `SELECT * FROM admin WHERE admin_id = ?`;
        const bind = [admin_id];

        pool.query(sql,bind,(error,result) => {
            if(error){
                console.log(error);
                return res.sendStatus(500);
            }

            // console.log(result);

            if(result.length == 0) return res.sendStatus(401);

            const admin = result[0];
            if(admin.enabled){
                req.adminuser = admin;
                next();
            }else{
                
                return res.sendStatus(401);
            }
        });
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
        
    }
}

module.exports = { IS_SUPER,IS_ADMIN }