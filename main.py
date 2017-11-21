import sys
import os.path
sys.path.append(os.path.join(os.path.dirname(__file__), "libs")) 

import webapp2
import StringIO
import json
import base64
import logging

# import cloudstorage
from google.appengine.api import app_identity

bucketName = app_identity.get_default_gcs_bucket_name()

class RestHandler(webapp2.RequestHandler):
    def dispatch(self):
        # time.sleep(1)
        super(RestHandler, self).dispatch()
    
    def SendImage(self,file_base64):
    	self.response.headers['Content-Type'] = 'application/pdf'
    	self.response.write(file_base64)
    def SendJson(self, r):
        self.response.headers['content-type'] = 'text/plain'
        self.response.write(json.dumps(r))

class GetFile(RestHandler):
	def get(self):
		file = open('pdf_item/uLab_PDfRenderingPage.pdf','rb')
		# logging.info(file.read())
		file_value = file.read().encode('base64')
		self.SendImage(file_value)

class SaveFile(RestHandler):
	def post(self):
		req = json.loads(self.request.body)
		fileName  = 'editd.pdf'
		
		base64Data = req.get( 'filebody' ,'not working')

		with cloudstorage.open(fileName, "w") as gcsFile:
			gcsFile.write(base64Data)
		with cloudstorage.open(fileName, "r") as gcsFile:
			output =  gcsFile.read()
		# file.write(base64Data)
		self.SendJson({'body','write success'})

APP = webapp2.WSGIApplication([
		('/rest/getFile' ,	GetFile ),
		('/rest/writeFile', SaveFile),
	],debug=True)