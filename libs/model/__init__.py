# -*- coding: utf-8 -*-
"""
Sarun Wiriyapistan
==========
This is model structure of barcode generater 
having 1 main object , account login 
"""
__project__ = 'barcodeRequestAPI'
__author__ = 'Sarun Wiriyapistan'
__copyright__ = ''
__author_email__ = 'sarun.wiriyap@gmail.com'
__description__ = ('To contains structure of account login detail, has register and token module.')
__version__ = '0.0.1'
__release__ = '{version}'.format(version=__version__)
__license__ = ''
__url__ = 'https://sarun-wiriyapistan.appspot.com/'

def GetHash(account_email):
	import hashlib
	import datetime
	micro_sec = datetime.datetime.now().strftime('%f')

	hash_object = hashlib.sha256(bytes(account_email+micro_sec))
	hex_dig = hash_object.hexdigest()
	return hex_dig

# class Account(ndb.Model):
# 	account_name 	= ndb.StringProperty() 						# Name of company or something else .. 
# 	account_email 	= ndb.StringProperty() 						# using email from this field to sending register email
# 	password		= ndb.StringProperty()						#
# 	account_status 	= ndb.StringProperty()   					# pending, verified, holding, cancel
# 	created_date    = ndb.DateTimeProperty(auto_now_add=True) 	#
# 	account_token 	= ndb.StringProperty() 						#
# 	last_modified_date =  ndb.DateTimeProperty(auto_now=True) 	# 
# 	def as_dict(self):
# 		return { 	'account_name'	:self.account_name,  
# 					'account_email' :self.account_email,
# 					'password' 		:self.password,
# 					# 'created_date' 	:self.created_date,
# 					# 'last_modified_date':self.last_modified_date,
# 					'account_token' :self.account_token
# 				}

# def GetAccount():
# 	return Account.query().fetch(10)

# def InsertAccount(account_as_dict):
# 	import logging 
# 	logging.info(account_as_dict)
# 	account_to_put = Account( 
# 								account_name =account_as_dict.get('account_name',None),
# 								account_email=account_as_dict.get('account_email',None),
# 								password 	 =account_as_dict.get('password',None),
# 								account_token=account_as_dict.get('account_token',None),
# 								# account_status= account_as_dict.get('account_status',None)
# 								account_status='Pending'
# 							)
# 	account_to_put.put()
# 	return account_to_put

# def UpdateAccount(account_as_dict):
# 	account_to_put = Account( 
# 								id 			  = account_as_dict.get('id',None),
# 								account_name  = account_as_dict.get('account_name',None),
# 								account_email = account_as_dict.get('account_email',None),
# 								password 	  = account_as_dict.get('password',None),
# 								account_token = account_as_dict.get('account_token',None),
# 								account_status= account_as_dict.get('account_status',None)
# 							)
# 	account_to_put.put()
# 	return account_to_put

# def DeleteAccount(id):
# 	key = ndb.Key(Account, id)
# 	key.delete()
