# -*- coding: utf-8 -*-

from google.appengine.ext import ndb

import webapp2, cgi, re
import urllib
from encodingUtils import fix_encoding

ACTIVITIES_LIST = 'activities_list'

ADD_DEFI_TYPE = 1 # args: [definition, answer, source]
ADD_DEFI_TEMPLATE = "<h3>%s</h3>	 <i>%s</i> הוסיף להגדרה <i>%s</i> את הפתרון <i>%s</i>"
ADD_DEFI_FUNC = "searchDefi('%s', '%s')"

STRING_TYPE = 9 # just prints its args[0]
 
MAX_ACTIVITIES = 10 # number of maximum activities shown

# ra - recent activity
# activity - tuple of activity type number and activity args.
# every activity type has its own parser

class Activity(ndb.Model):
	id_num = ndb.IntegerProperty()
	description = ndb.StringProperty(indexed=False)
	onclick_func = ndb.StringProperty(indexed=False)

	@staticmethod
	def create(id_num, description, onclick_func):
		return Activity(id_num=id_num, description=fix_encoding(description), onclick_func=fix_encoding(onclick_func))

	def as_tuple(self):
		return (self.id_num, self.description, self.onclick_func)

def add_to_ra(activity):
	app = webapp2.get_app()
	ra_list = app.registry.get(ACTIVITIES_LIST)
	if not ra_list:
		app.registry[ACTIVITIES_LIST] = [activity]
	else:
		app.registry[ACTIVITIES_LIST] = ([activity] + ra_list)[:MAX_ACTIVITIES]

def get_ra():
	app = webapp2.get_app()
	ra_list = app.registry.get(ACTIVITIES_LIST)
	if not ra_list:
		return [(9, [fix_encoding('אין חדשות בינתיים')])]
	return ra_list

def add_ra(act_type, args):
	activity = (act_type, args)
	add_to_ra(activity)

def parse_ra_string(indexed_activity):
	i, activity = indexed_activity
	if activity[0] == 1:
		# Add Definition
		template = fix_encoding(ADD_DEFI_TEMPLATE%(fix_encoding(activity[1][0]), fix_encoding(activity[1][2]), fix_encoding(activity[1][0]), fix_encoding(activity[1][1])))
		func = fix_encoding(ADD_DEFI_FUNC%(fix_encoding(activity[1][0]), fix_encoding(activity[1][1])))
		return (template, func)
	if activity[0] == 9:
		# String
		return (activity[1][0], "")

def get_ra_strings():
	ra = get_ra()
	indexed_ra = [(i, ra[i]) for i in xrange(len(ra))]
	return list(map(parse_ra_string, indexed_ra))