# -*- coding: utf-8 -*-

from google.appengine.ext import ndb

import webapp2, cgi, re
import urllib
from encodingUtils import fix_encoding

ACTIVITIES_LIST = 'activities_list'

ADD_DEFI_TYPE = 1 # args: [definition, answer, source]
ADD_DEFI_TEMPLATE = "<h3 style='color: %s;'>%s</h3>	 המשתמש %s הוסיף להגדרה %s את הפתרון %s"
ADD_DEFI_FUNC = "searchDefi('%s', '%s')"

COLORS = ["rgb(255, 33,35)", "rgb(253, 165, 29)", "rgb(219, 217, 34)", "rgb(72, 182, 51)", "rgb(76, 31, 244)", "rgb(167, 71, 204)"]

STRING_TYPE = 9 # just prints its args[0]
 
# ra - recent activity
# activity - tuple of activity type number and activity args.
# every activity type has its own parser

def add_to_ra(activity):
	app = webapp2.get_app()
	ra_list = app.registry.get(ACTIVITIES_LIST)
	if not ra_list:
		app.registry[ACTIVITIES_LIST] = [activity]
	else:
		app.registry[ACTIVITIES_LIST] = ([activity] + ra_list)[:10]

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
		template = fix_encoding(ADD_DEFI_TEMPLATE%(COLORS[i%len(COLORS)],fix_encoding(activity[1][0]), fix_encoding(activity[1][2]), fix_encoding(activity[1][0]), fix_encoding(activity[1][1])))
		func = fix_encoding(ADD_DEFI_FUNC%(fix_encoding(activity[1][0]), fix_encoding(activity[1][1])))
		return (template, func)
	if activity[0] == 9:
		# String
		return (activity[1][0], "")

def get_ra_strings():
	ra = get_ra()
	indexed_ra = [(i, ra[i]) for i in xrange(len(ra))]
	return list(map(parse_ra_string, indexed_ra))