const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session middleware for all routes
app.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware for protected routes
app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authorization) {
        const token = req.session.authorization.accessToken;
        
        try {
            jwt.verify(token, "826657a98e396172f8aed51d110d529d", (err, user) => {
                if(!err){
                    req.user = user;
                    next();
                } else {
                    return res.status(403).json({message: "User not authenticated"});
                }
            });
        } catch(err) {
            return res.status(403).json({message: "User not authenticated"});
        }
    } else {
        return res.status(403).json({message: "User not logged in"});
    }
});

// Customer routes (including both auth and non-auth routes)
app.use("/customer", customer_routes);

// General routes
app.use("/", genl_routes);

const PORT = 5050;

app.listen(PORT,()=>console.log("Server is running on port", PORT));
