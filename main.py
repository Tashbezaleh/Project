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

import webapp2, solver, cgi, re, time

class MainHandler(webapp2.RequestHandler):
    def get(self):
        with open('index.html') as stream:
           source = stream.read();

        intext = cgi.escape(self.request.get('definition'))
        regex = cgi.escape(self.request.get('guess'))
        regex = re.compile('^' + regex.replace('?', '..').encode('utf') + '$', re.UNICODE)
        app = webapp2.get_app()
        if 'num calls' not in app.registry:
        	app.registry['num calls'] = 0
        if 'last call' not in app.registry:
        	app.registry['last call'] = time.time()
        if (time.time() - app.registry['last call']) / 60 > 5:
        	app.registry['num calls'] = 0
        results, online = solver.html_solve(intext.encode('utf'), regex, app.registry['num calls'] < 20)
        if online:
        	app.registry['num calls'] += 1
        	app.registry['last call'] = time.time()
        self.response.write(source % results)

app = webapp2.WSGIApplication([('/', MainHandler)], debug=True)
