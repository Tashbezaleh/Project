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
	activityID = ndb.IntegerProperty()
	description = ndb.StringProperty(indexed=False)
	onclick_func = ndb.StringProperty(indexed=False)

	@staticmethod
	def create(activityID, description, onclick_func):
		return Activity(activityID=activityID, description=fix_encoding(description), onclick_func=fix_encoding(onclick_func))

def get_raw_ra_feed():
	return Activity.query().order(-Activity.activityID).fetch(MAX_ACTIVITIES)

def get_ra_feed():
	ra_feed = map(lambda x: (fix_encoding(x.description), fix_encoding(x.onclick_func)), get_raw_ra_feed())
	if not ra_feed:
		return [(fix_encoding('אין חדשות בינתיים'), "")]
	return ra_feed

def add_ra(act_type, args):
	description, onclick_func = parse_ra_string(act_type, args)
	activities = get_raw_ra_feed()
	new_activity = Activity.create(1 + max(map(lambda x:x.activityID, activities)) if activities else 0, description, onclick_func)
	new_activity.put()
	return [new_activity] + activities

def parse_ra_string(act_type, args):
	if act_type == 1:
		# Add Definition
		description = fix_encoding(ADD_DEFI_TEMPLATE%(fix_encoding(args[0]), fix_encoding(args[2]), fix_encoding(args[0]), fix_encoding(args[1])))
		onclick_func = fix_encoding(ADD_DEFI_FUNC%(fix_encoding(args[0]), fix_encoding(args[1])))
		return (description, onclick_func)
	if act_type == 9:
		# String
		return (args[0], "")