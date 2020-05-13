/*
 * Contains all Base controllers.
 * i.e Database CRUD
 */
const nodemailer = require('nodemailer');
const Config = require('../config.js');

const IsExists = async (model, where, select=null) => {
	try{
		let query = model.find(where)
		if(select)
			query.select(select)
		let doc = await query.lean().exec()
			if(doc.length > 0)
				return doc
			else
				return false
	}
	catch(e){
		return false
	}
}

const Insert = async (model, data) => {
	try{
		let inserted = await new model(data).save()
		return inserted
	}
	catch(e){
		console.log(e)
		return false
	}
}

const Find = async (model, where, select=null, sort=null, limit=null) => {
	try{
		let query = model.find(where)
		if(select)
			query.select(select)
		if(sort)
			query.sort(sort)
		if(limit)
			query.limit(limit)
		let doc = await query.lean().exec()
		if(doc.length > 0)
			return doc
		else
			return false
	}
	catch(e){
		return false
	}
}

const FindAndUpdate = async (model, filter, update) => {
	try{
		let query = model.findOneAndUpdate(filter,{ $set: update },{new: true})
		let doc = await query.exec()
		if(doc)
			return doc
		else
			return false
	}
	catch(e){
		return false
	}
}

const SendEmail = async (to,subject,text) => {
	try{
		let transport = nodemailer.createTransport({
			host: Config.mail.host,
			port: Config.mail.port,
			auth: {
				user: Config.mail.auth.user,
				pass: Config.mail.auth.pass
			}
		});
		const message = {
			from: Config.mail.auth.user, 
			to: [Config.adminEmail,to],     
			subject: subject, 
			text: text 
		};
		//console.log(message)
		let mail = await transport.sendMail(message);
		//console.log(mail)
		return true
	}
	catch(e){
		console.log(e)
		return false
	}
}

const HandleSuccess = (res, data) => {
	res.status(200).json({
		status: 'success',
		data: data
	});
	res.end();
}

const HandleError = (res,message) => {
	res.status(202).json({
		status: 'fail',
		error: message
	});
	res.end();
}

const UnauthorizedError = (res) => {
	res.status(401).json({
		status: 'unauthorize',
		error: 'Unauthorized API call.'
	});
	res.end();
}

const HandleServerError = (res,data,message) => {
	/*
     * Can log the error data into files to recreate and fix issue.
     * Hiding stack stace from users.
     */
    //console.log(data)
	res.status(500).json({
		error: message
	});
}


/*
 * Exporting controller methods
 *
 */
exports.IsExists = IsExists
exports.Insert = Insert
exports.Find = Find
exports.FindAndUpdate = FindAndUpdate
exports.UnauthorizedError = UnauthorizedError
exports.HandleServerError = HandleServerError
exports.HandleError = HandleError
exports.HandleSuccess = HandleSuccess
exports.SendEmail = SendEmail