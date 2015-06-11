# -*- coding: utf-8 -*-

from google.appengine.ext import ndb

import webapp2, cgi, re
import urllib
from encodingUtils import fix_encoding

ACTIVITIES_LIST = 'activities_list'

ADD_DEFI_TYPE = 1 # args: [definition, answer, source]
ADD_DEFI_TEMPLATE = "המשתמש %s הוסיף להגדרה %s את הפתרון %s"

STRING_TYPE = 9 # just prints its args[0]
 
# ra - recent activity
# activity - tuple of activity type number and activity args.
# every activity type has its own parser

def add_to_ra(activity):
	app.registry[ACTIVITIES_LIST].append(activity)

def get_ra():
	return app.registry[ACTIVITIES_LIST]

def add_ra(act_type, args):
	activity = (act_type, args)
	add_to_recent_activity(activity)

def parse_ra_string(activity):
	if activity[0] == 1:
		# Add Definition
		return ADD_DEFI_TEMPLATE%(activity[1][2], activity[1][0], activity[1][1])
	if activity[0] == 9:
		# String
		return activity[1][0]

def get_ra_strings():
	return list(map(parse_ra_string, get_ra()))