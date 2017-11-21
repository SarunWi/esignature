from google.appengine.ext import ndb

class Account(ndb.Model):
	account_name 	= ndb.StringProperty() 						# Name of company or something else .. 
	account_email 	= ndb.StringProperty() 						# using email from this field to sending register email
	password		= ndb.StringProperty()						#
	account_status 	= ndb.StringProperty()   					# pending, verified, holding, cancel
	created_date    = ndb.DateTimeProperty(auto_now_add=True) 	#
	account_token 	= ndb.StringProperty() 						#
	last_modified_date =  ndb.DateTimeProperty(auto_now=True) 	# 
	def as_dict(self):
		return { 	'account_name'	:self.account_name,  
					'account_email' :self.account_email,
					'password' 		:self.password,
					# 'created_date' 	:self.created_date,
					# 'last_modified_date':self.last_modified_date,
					'account_token' :self.account_token
				}

def GetAccount():
	return Account.query().fetch(10)

def get_account_by_token(token):
	return Account.query(Account.account_token == token).get()

def InsertAccount(account_as_dict):
	account_to_put = Account( 
								account_name =account_as_dict.get('account_name',None),
								account_email=account_as_dict.get('account_email',None),
								password 	 =account_as_dict.get('password',None),
								account_token=account_as_dict.get('account_token',None),
								# account_status= account_as_dict.get('account_status',None)
								account_status='Pending'
							)
	account_to_put.put()
	return account_to_put

def UpdateAccount(account_as_dict):
	account_to_put = Account( 
								id 			  = account_as_dict.get('id',None),
								account_name  = account_as_dict.get('account_name',None),
								account_email = account_as_dict.get('account_email',None),
								password 	  = account_as_dict.get('password',None),
								account_token = account_as_dict.get('account_token',None),
								account_status= account_as_dict.get('account_status',None)
							)
	account_to_put.put()
	return account_to_put

def DeleteAccount(id):
	key = ndb.Key(Account, id)
	key.delete()