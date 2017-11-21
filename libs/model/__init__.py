# -*- coding: utf-8 -*-
"""
Sarun Wiriyapistan
==========

"""
__project__ = 'PDF Writter'
__author__ = 'Sarun Wiriyapistan'
__copyright__ = ''
__author_email__ = 'sarun.wiriyap@gmail.com'
__description__ = ('')
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


