from model.Account import * 
from Crypto.Cipher import AES
import base64
import time

SECRET_KEY = '1928401192819382'

def validate_token(token):
	if token :
		acc = Account.query(Account.account_token==token).get()
		return acc!=None
	return False

def get_time_encrypted():
	now = str(int(round(time.time() * 1000)))
	now = padding_left(now,'_',16)
	cipher = AES.new(SECRET_KEY,AES.MODE_ECB)
	return base64.b64encode(cipher.encrypt(now))

def get_time_decrypted(encodedtime):
	cipher = AES.new(SECRET_KEY,AES.MODE_ECB)
	decoded = cipher.decrypt(base64.b64decode(encodedtime))
	return decoded.strip()

def padding_left(str_val , padding_with, length ):
	while len(str_val)<16 :
		str_val = padding_with+str_val
	return str_val

def is_valid_time(encodetime):
	if encodetime :
		str_val  	= get_time_decrypted(encodetime)
		time_str 	= str_val.lstrip('_')
		time_long 	= long(time_str)
		last_ten_min 	= time.time()-600000 # 10 min* 60 sec * 1000 milli sec 
		return last_ten_min <= time_long
	return False