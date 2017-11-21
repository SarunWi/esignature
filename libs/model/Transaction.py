from google.appengine.ext import ndb
from model import Account
class RequestTransaction(ndb.Model):
	account_id 		= ndb.KeyProperty(kind='Account')
	request_date 	= ndb.DateTimeProperty(auto_now_add=True)
	barcode_no 		= ndb.StringProperty()
	is_anynomous 	= ndb.BooleanProperty()

def insert_transaction_withaccount(transaction_as_dict):
	import logging
	logging.info(transaction_as_dict.get('account_id') )
	# logging.info(ndb.key('Account', transaction_as_dict.get('account_id') )  )
	transaction  = RequestTransaction( 
						account_id 		= transaction_as_dict.get('account_id') ,
						barcode_no 		= transaction_as_dict.get('barcode_no'),
						is_anynomous 	= False )
	transaction.put()

def insert_transaction_anonymous(transaction_as_dict):
	transaction  = RequestTransaction(
							barcode_no 		= transaction_as_dict.get('barcode_no'),
							is_anynomous 	= True
						)
	transaction.put()

def query_transaction_byaccountkey(account_key):
	return RequestTransaction.query( RequestTransaction.account_id == account_key ).fetch()