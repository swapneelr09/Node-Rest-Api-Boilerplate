module.exports = {
	port: 3001,
	mongodb: {
		connectionString: 'mongodb://localhost/ripbook',
		db: 'api'
	},
	otpLimitInMinute: 5,
	secret: 'MySecretKey',
	mail: {
		host: 'phoenix.ditinex.com',
		port: 465,
		auth: {
			user: 'test@ditinex.com',
			pass: 'o}bB&rDlYP9I'
		}
	},
	adminEmail: 'asifakramsk@gmail.com'
}
