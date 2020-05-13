/*
 * Default Routers
 * 
 */
const express = require('express');
const router = express.Router();

/*
 * Importing all required controllers
 * i.e authController, orderController
 */
const Controllers = require('../controllers')
const { VerifyToken } = require('../middlewares')
const { Signup, Login, ResetPassword } = Controllers.Auth


router.use('/*',(req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,POST');
	res.header('Cache-Control', 'no-cache');
	next()
});

router.post('/signup',Signup);
router.post('/login',Login);
router.get('/reset-password',ResetPassword);


// Protect all routes after this middleware
router.use(VerifyToken);




//Global error handler
router.use((err, req, res, next) => {
    if (! err) {
        return next();
    }
    if (res.headersSent) {
		return next(err)
	}
    res.status(500);
    res.json({error:'500 Internal server error'});
});


module.exports = router;