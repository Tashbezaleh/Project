with open('index.html') as stream:
            source = stream.read();
        #intext = cgi.escape(self.request.get('definition'))
        #regex = cgi.escape(self.request.get('guess'))
        #regex = regex.replace('?', '..').encode('utf')
        in_text = source #% 



intext = cgi.escape(self.request.get('definition'))
        regex = cgi.escape(self.request.get('guess'))
        regex = regex.replace('?', '..').encode('utf')

        template_values = {
            'scrapy_output': scrapy.best_func( intext.encode('utf'), '$' + regex + '^') ,
        }

        template = JINJA_ENVIRONMENT.get_template('index.html')
        in_text = template.render(template_values)

        self.response.write("hel")


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


regex = regex.replace('?', '..').encode('utf')
	        regex = cgi.escape(self.request.get('guess'))
	        regex = regex.replace('?', '..').encode('utf')
	        template_values = {
	        	'results_list' = [ " a", "b", "c", "d"]
	        }
	        template = JINJA_ENVIRONMENT.get_template('/template/results.html')
	        in_text = template.render(template_values)





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
    	template_values = {}
    	template = JINJA_ENVIRONMENT.get_template('/templates/index.html')
        in_text = template.render(template_values)
    	self.response.write(in_text)


class ResultsHandler(webapp2.RequestHandler):
    def get(self):
    	intext = cgi.escape(self.request.get('definition'))
        regex = cgi.escape(self.request.get('guess'))
        regex = regex.replace('?', '..').encode('utf')

	    template_values = {
	    	'results_list' = [ " a", "b", "c", "d"]
	    }
	    template = JINJA_ENVIRONMENT.get_template('/template/results.html')
        in_text = template.render(template_values)
        self.response.write(in_text)


app = webapp2.WSGIApplication([
    ('/', MainHandler), ('/results', ResultsHandler)], debug=True)





{% for item in results_list %}
	    	<li>{{ item }}</li>
		{% endfor %}


		<link rel="stylesheet" type="text/css" href="graphics/styles.css">
		<script type="text/javascript" src="http://code.jquery.com/jquery-2.1.4.min.js" ></script>
		<script type="text/javascript">
			$(document).ready(function () {
				$("li").each(function (index,elem) {
					$(elem).hide().delay(index * 300).fadeIn(1000);
				});
			});
		</script>