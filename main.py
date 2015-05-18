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
from google.appengine.ext import ndb

import urllib
import webapp2, solver, cgi, re, time
import jinja2, os, databaseUtils, cookiesUtils

JINJA_ENVIRONMENT = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)), extensions=['jinja2.ext.autoescape'],autoescape=True) 

red_font = '<font color="red">%s</font>'
missing_field_message = red_font % 'אנא הכנס %s'

#main page, "/"
class MainHandler(webapp2.RequestHandler):
    def get(self):      
        template_values = {}
        # begin probably bad 
        #ndb.delete_multi(databaseUtils.NDBAnswer.query().fetch(keys_only = True))
       # databaseUtils.initialize_ndb()
        # end probably bad
        template = JINJA_ENVIRONMENT.get_template('/templates/index.html')
        in_text = template.render(template_values)
        self.response.write(in_text)

class ResultsHandler(webapp2.RequestHandler):
    def get(self):
        search_pattern_definition(self)

class ResultActionHandler(webapp2.RequestHandler):
    def get(self):
        
        definition = cgi.escape(self.request.get('definition'))
        answer = cgi.escape(self.request.get('answer'))
        action = cgi.escape(self.request.get('action'))
        pattern = cgi.escape(self.request.get('pattern'))
        
        #check GET input
        if definition == '':
            self.response.write(missing_field_message % 'הגדרה')
            return
        elif answer == '':
            self.response.write(missing_field_message % 'פתרון')
            return
        elif action == '':
            self.response.write(red_font % 'פעולה לא נתמכת')
            return
        elif pattern == '':
            self.response.write(missing_field_message % 'תבנית')

        # if not databaseUtils.entry_exists(definition, answer):
        #     databaseUtils.add_to_ndb(definition, answer, databaseUtils.SOLVER_NAME, 0)

       

        answer_object = databaseUtils.Answer(answer.encode('utf'), definition.encode('utf'), '', 0)
        if cookiesUtils.canVote(self, answer_object):
            if action == 'up':
                databaseUtils.upvote_to_ndb(definition, answer)
                cookiesUtils.add_to_cookies(self, answer_object)
            elif action == 'down':
                databaseUtils.downvote_to_ndb(definition, answer)
                cookiesUtils.add_to_cookies(self, answer_object)

        if action == 'add':
            source = cgi.escape(self.request.get('source'))
            if source == '':
                source = 'אנונימי'
            databaseUtils.add_to_ndb(definition, answer, source, 0)
            return self.response.write('תודה על תרמתך')

        search_pattern_definition(self)
        




class ResetDBHandler(webapp2.RequestHandler):
    def get(self):
        self.response.write("START WORKING <br>")
        ndb.delete_multi(databaseUtils.NDBAnswer.query().fetch(keys_only = True))
        self.response.write("DONE DELETING <br>")
        databaseUtils.initialize_ndb()
        self.response.write("GREAT SUCCESS")

# class TestHandler(webapp2.RequestHandler):
#     def get(self):
#         template = JINJA_ENVIRONMENT.get_template('/templates/test.html')
#         output = template.render({})
#         self.response.write(output)

debug = os.environ.get('SERVER_SOFTWARE', '').startswith('Dev')

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/results.html', ResultsHandler),
    ('/result_action', ResultActionHandler) #,
   # ('/reset_db.html', ResetDBHandler) #,
    # ('/test.html', TestHandler)
], debug=True)



def search_pattern_definition(this):
    definition = cgi.escape(this.request.get('definition'))
    pattern = cgi.escape(this.request.get('pattern'))
    
    #check GET input
    if definition == '':
        this.response.write(missing_field_message % 'הגדרה')
        return
    elif pattern == '':
        this.response.write(missing_field_message % 'תבנית')
        return

    regex = solver.user_pat_to_regex(pattern)
    #each element in results is of class Answer defined in databaseUtils.py
    results = solver.find(definition, regex)
    #convert it to 

    results = [(result, cookiesUtils.canVote(this, result)) for result in results]
    #render page with results of the computation
    template_values= {
        'results_list' : results,
        'definition' : definition,
        'pattern' : pattern
    }
    template = JINJA_ENVIRONMENT.get_template('/templates/results.html')
    this.response.write(template.render(template_values))