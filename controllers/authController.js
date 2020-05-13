/*
 * Contains all Authentication controllers.
 * i.e Login, Signup, Token Generator, Token Validator etc
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Config = require('../config.js');
const { User, Otp } = require('../models')
const { 
	Insert, IsExists, Find, FindAndUpdate,
	HandleSuccess, HandleError, HandleServerError
} = require('./baseController')

const SendOTP = async (req, res, next) => {
    try {
    	const mobileNumber = req.params.mobileNumber
    	let currentTime = new Date();
    	let validTime = new Date(currentTime.getTime() - 5*60000)
    	let where = {mobile: mobileNumber, createdAt: { $gt: validTime } }
    	const exists = await IsExists(Otp,where)
    	if(!exists){
    		/*
			 * Call SMS API and Store OTP
			 *
    		 */
    		const otpValue = '21434';		//Temp OTP for test
    		let inserted = await Insert(Otp,{ mobile: mobileNumber, otp: otpValue })
    		if(inserted)
    			return HandleSuccess(res,inserted)
    		else
    			throw new Error("Failed to insert OTP in database.")
    	}
    	else
    		return HandleError(res,'Try again after '+Config.otpLimitInMinute+' minute.')

    } catch (err) {
    	errLog = {module: 'SendOTP', params: req.params, query: req.query, post: req.body, error: err}
    	HandleServerError(res, errLog, '500 Internal server error')
        next(err);
    }
}

const VerifyOTP = async (req, res, next) => {
    try {
    	const mobileNumber = req.query.mobile
    	const otpValue = req.query.otp
    	let where = { mobile: mobileNumber, otp: otpValue }
    	const exists = await IsExists(Otp,where)

    	if(!exists)
    		return HandleError(res,'Failed to verify OTP.')

    	return HandleSuccess(res,null)

    } catch (err) {
    	errLog = {module: 'VerifyOTP', params: req.params, query: req.query, post: req.body, error: err}
    	HandleServerError(res, errLog, '500 Internal server error')
        next(err);
    }
}

const Signup = async (req, res, next) => {
    try {
    	let name = req.body.name || ''
    	let email = req.body.email || ''
    	let password = req.body.password || ''
    	let confirmPassword = req.body.confirmPassword || ''
    	let mobile = req.body.mobile || ''
    	let address = req.body.address || ''
    	email = email.toLowerCase()
    	let validateError = null

    	/* Validate email phone and password */
    	if(!validateEmail(email))
    		validateError = 'Invalid Email.'
    	else if(!validateMobile(mobile))
    		validateError = 'Invalid Mobile Number. It must be only 10 digits.'
    	else if(password != confirmPassword)
    		validateError = 'Password did not matched.' 
    	else if(name=='' || address=='' || password=='')
    		validateError = 'All fields are required.'
        
        if(validateError)
        	return HandleError(res,validateError)

        let salt = await bcrypt.genSalt(12);
        password = await bcrypt.hash(password, salt);

        const data = { name: name, email: email, password: password, confirmPassword: confirmPassword, mobile: mobile, address: address }
        let inserted = await Insert(User,data)
        if(inserted){
        	inserted = Object.assign({}, inserted._doc);		//Cannot delete from immutable so creating new obj
        	delete inserted.password
        	delete inserted.__v
        	return HandleSuccess(res,inserted)
        }
        else
        	return HandleError(res,'Email or Mobile already exists.')


    } catch (err) {
        errLog = {module: 'Signup', params: req.params, query: req.query, post: req.body, error: err}
    	HandleServerError(res, errLog, 'Failed to signup.')
        next(err);
    }
}

const Login = async (req, res, next) => {
        try {
    	let email = req.body.email || ''
    	let password = req.body.password || ''
    	email = email.toLowerCase()
    	let validateError = null

    	if(email=='' || password=='')
    		validateError='Fields can not be empty.'
        
        if(validateError)
        	return HandleError(res,validateError)

        const where = { $or: [{'email': email},{'mobile': email}] }
        let doc = await Find(User,where)
        if(doc){
        	doc = doc[0]
        	if( await bcrypt.compare(password,doc.password) == true){	//if password matches
        		//Creating access token.
        		doc.token = jwt.sign({ id: doc._id }, Config.secret, {
			      expiresIn: 86400 // 86400 expires in 24 hours
			    });
			    delete doc.password
			    delete doc.__v
			    return HandleSuccess(res,doc)
        	}
        	else
        		return HandleError(res,'Incorrect Password.')
        }
        else
        	return HandleError(res,'User does not exists.')


    } catch (err) {
        errLog = {module: 'Login', params: req.params, query: req.query, post: req.body, error: err}
    	HandleServerError(res, errLog, 'Failed to login. Unexpected error.')
        next(err);
    }
}

const ResetPassword = async (req, res, next) => {
    /*
     * We can reset password after verifying the mobile number with OTP.
     * Based on the front-end design.
     */
    try {
    	let mobileNumber = req.query.mobile || ''
    	mobileNumber = String(mobileNumber)
    	let validateError = null

    	if(mobileNumber=='')
    		validateError='Mobile can not be empty.'
        
        if(validateError)
        	return HandleError(res,validateError)

        let where = {mobile: mobileNumber}
        let select = '_id mobile'
    	const exists = await IsExists(User,where,select)

    	if(!exists)
    		return HandleError(res,'User does not exists.')

        let salt = await bcrypt.genSalt(12);
        let password = plainPassword = generatePassword(10);
        password = await bcrypt.hash(password, salt);
        let updated = await FindAndUpdate(User,where,{password: password})
    	if(!updated)
    		return HandleError(res,'Failed to reset password.')

    	/*
    	 * Use SMS API
    	 * Reset Password and send to mobile.
    	 */
    	console.log(plainPassword)
    	return HandleSuccess(res,null)

    } catch (err) {
        errLog = {module: 'ResetPassword', params: req.params, query: req.query, post: req.body, error: err}
    	HandleServerError(res, errLog, 'Unexpected error.')
        next(err);
    }
}



/*
 * Other internal methods below
 *
 */

const validateEmail = email => {
	let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
	return re.test(String(email).toLowerCase());
}

const validateMobile = mobile => {
	let re = /^\d{10}$/
	return re.test(mobile);
}

const generatePassword = length => {
   let result           = '';
   let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let charactersLength = characters.length;
   for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}



/*
 * Exporting controller methods
 *
 */
exports.Signup = Signup
exports.Login = Login
exports.ResetPassword = ResetPassword
exports.SendOTP = SendOTP
exports.VerifyOTP = VerifyOTP