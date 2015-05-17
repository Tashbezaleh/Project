# -*- coding: utf-8 -*-

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
# WITHOUT WARRANTIES OR COsNDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
from google.appengine.api import users

import urllib
import webapp2, solver, cgi, re, time
import jinja2
import os

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
        pattern = cgi.escape(self.request.get('pattern'))
        regex = user_pat_to_regex(pattern)

        # cooldown control
        app = webapp2.get_app()
        if 'num calls' not in app.registry:
            app.registry['num calls'] = 0
        if 'last call' not in app.registry:
            app.registry['last call'] = time.time()
        if (time.time() - app.registry['last call']) / 60 > 5:
            app.registry['num calls'] = 0
        results, online = solver.find(intext.encode('utf'), regex, app.registry['num calls'] < 20)
        if online:
            app.registry['num calls'] += 1
            app.registry['last call'] = time.time()

        template_values= {
            'results_list' : results,
            'definition' : intext,
            'pattern' : pattern
        }
        template = JINJA_ENVIRONMENT.get_template('/templates/results.html')
        in_text = template.render(template_values)
        self.response.write(in_text)

class Result_ActionHandler(webapp2.RequestHandler):
    def get(self):
        definition = cgi.escape(self.request.get('definition'))
        answer = cgi.escape(self.request.get('answer'))
        action = cgi.escape(self.request.get('action'))
        if not entry_exits(definition,answer):
            add_to_ndb(definition,answer, "אונליין", 0)
        #call peleg's func
        if (action == 'up'):
            upvote_to_ndb(definition, answer)
        elif (action == 'down'):
            downvote_to_ndb(definition, answer)
        elif (action == 'add'):
            source = cgi.escape(self.request.get('source'))
            add_to_ndb(definition, answer, source, 0)

        self.response.write(action)

class TestHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('/templates/test.html')
        output = template.render({})
        self.response.write(output)




app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/results.html', ResultsHandler),
    ('/results_action.html', Result_ActionHandler),
    ('/test.html', TestHandler)
], debug=True)
