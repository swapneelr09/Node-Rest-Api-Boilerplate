All API endpoints :

1. GET 	/send-otp/:MobileNumber	
	Data : 
	Response:  status, otp
	Notes: OTP can be generated from same mobile number only once in every 5 minute to prevent spamming.
	

2. GET  /verify-otp				
	Data : mobile,otp
	Response:  status


3. POST  /signup					
	Data: name,email,password,confirmPassword,mobile,address										
	Response: status,id,name,email,mobile,address,token
	Notes: Mobile Number is 10 digit without special character
 

4. POST  /login	
	Data: email,password
	Response: status,id,name,email,mobile,address,token
	Notes: Can send the mobile number in email field. On splash screen every time user open the app it should verify login credentials(stored in async storage) and generate access token. To prevent unauthorized access from multiple device sessions after password change.


5. GET  /reset-password			
	Data: mobile
	Response: status
	Notes: It will generate a new password and sms to mobile 
 

6. POST  /user/new-order			
	Data: name,gender,userId,type,measurement
	Response: status,all fields
	Header: Header required as  'Authorization' : 'Bearer: ACCESS_TOKEN_GENERATED_FROM_LOGIN'
	Notes: type = ['shorts','skirt','shirt']
			measurement is and json object with below keys :
			for type short = 'waist','length','thigh','width'
			for type skirt = 'waist','length'
			for type shirt = 'lengthFromShoulder','shoulderToChest','chest','shoulderLength','sleeveLength','armHole','neck','sleeveWidth'


7. POST  /admin/confirm-order
	Data: orderId
	Response: status
	Header: Header required as  'Authorization' : 'Bearer: ACCESS_TOKEN_GENERATED_FROM_LOGIN'


** Emails are sent through SMTP authentication to prevent spam.
# Node-Rest-Api-Boilerplate
