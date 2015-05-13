#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
from google.appengine.api import users
import os
import urllib
import webapp2, scrapy, cgi
import jinja2

JINJA_ENVIRONMENT = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)), extensions=['jinja2.ext.autoescape'],autoescape=True)	

class MainHandler(webapp2.RequestHandler):
    def get(self):
    	intext = cgi.escape(self.request.get('definition'))
        regex = cgi.escape(self.request.get('guess'))

        if ( regex == '' or intext == ''): # no search request
        	template_values = {}
	        template = JINJA_ENVIRONMENT.get_template('/templates/index.html')
	        in_text = template.render(template_values)
	        self.response.write(in_text)
        else:
	        regex = regex.replace('?', '..').encode('utf')
	        regex = cgi.escape(self.request.get('guess'))
	        regex = regex.replace('?', '..').encode('utf')
	        template_values = {
	        	'results_list' = [ " a", "b", "c", "d"]
	        }
	        template = JINJA_ENVIRONMENT.get_template('/template/results.html')
	        in_text = template.render(template_values)
	        self.response.write(in_text)

app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)