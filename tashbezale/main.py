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
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
from google.appengine.api import users
from google.appengine.ext import ndb
from google.appengine.ext.ndb import stats

import webapp2, solver, cgi, re
import urllib

class Answer(ndb.Model):
    """Models an individual answer entry with ranking and source"""
    answer = ndb.StringProperty()
    definition = ndb.StringProperty()
    source = ndb.StringProperty()
    rank = ndb.IntegerProperty()

    @classmethod
    def query_answer(cls, definition):
        return cls.query(cls.defnition == definition).order(cls.rank)

def text_to_database():
    for definition in solver.defs_to_sols:
    	for sol in solver.defs_to_sols[definition]:
        	entry = Answer(answer=urllib.quote(sol), definition=urllib.quote(definition), source="Tashbezaleh", rank=100)
        	entry.put()
    return "Success"   

def find_offline2(definition, guess):
    qry = Answer.query(Answer.definition == urllib.quote(definition))
    answers = [urllib.unquote(str(entry.answer)) for entry in qry]
    return filter(lambda x: guess.match(x), answers)

class MainHandler(webapp2.RequestHandler):
    def get(self):
        with open('index.html') as stream:
            source = stream.read()
        in_text = source
        # qry = Answer.query(Answer.definition == urllib.quote('אבי הנצרות'))
        # i = 0
        # for answer in qry:
        #     self.response.write(urllib.unquote(str(answer.answer))+'<br>')
        #     i += 1
        #     if (i > 10):
        #         break
        answers = find_offline2('אבי הנצרות', re.compile('^..ש..$', re.UNICODE))
        self.response.write('<br>'.join(answers))
        global_stat = stats.GlobalStat.query().get()
      	#self.response.write(str(global_stat))
        self.response.write('<br>'+str(len(solver.defs_to_sols.items())))
        self.response.write('<br> Great Success')

app = webapp2.WSGIApplication([('/', MainHandler)], debug=True)
