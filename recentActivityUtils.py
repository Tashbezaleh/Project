# -*- coding: utf-8 -*-

from google.appengine.ext import ndb

import webapp2, cgi, re
import urllib
from encodingUtils import fix_encoding

ACTIVITIES_LIST = 'activities_list'

ADD_DEFI_TYPE = 1 # args: [definition, answer, source]
ADD_DEFI_TEMPLATE = "<h3>נוסף פתרון!</h3>	 <i>%s</i> הוסיף להגדרה <i>%s</i> את הפתרון <i>%s</i>"
ADD_DEFI_FUNC = "searchDefi('%s', '%s')"

SCORING_BOARD_TYPE = 2 # args: [name, score]
SCORING_BOARD_TEMPLATE = "<h3>שיא חדש!</h3> <i>%s</i> זכה בניקוד <i>%s</i> במשחק תשבצל'ה"
SCORING_BOARD_FUNC = "window.location='\MiniGame.html'"

NEW_QUESTION_TYPE = 3 # args: [name, question, pattern]
NEW_QUESTION_TEMPLATE = "<h3>שאלה חדשה בפורום!</h3> <i>%s</i> שאל בפורום לבגי ההגדרה <i>%s</i> עם התבנית <i>%s</i>"
NEW_QUESTION_FUNC = "window.location='\forums.html'"

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
		description = fix_encoding(ADD_DEFI_TEMPLATE%(fix_encoding(args[2]), fix_encoding(args[0]), fix_encoding(args[1])))
		onclick_func = fix_encoding(ADD_DEFI_FUNC%(fix_encoding(args[0]), fix_encoding(args[1])))
		return (description, onclick_func)
	if act_type == 2:
		# Scoring Board
		description = fix_encoding(SCORING_BOARD_TEMPLATE%(fix_encoding(args[0]), fix_encoding(args[1])))
		onclick_func = fix_encoding(SCORING_BOARD_FUNC)
		return (description, onclick_func)
	if act_type == 3:
		# New Question
		description = fix_encoding(NEW_QUESTION_TEMPLATE%(fix_encoding(args[0]), fix_encoding(args[1]), fix_encoding(args[2])))
		onclick_func = fix_encoding(NEW_QUESTION_FUNC)
		return (description, onclick_func)
	if act_type == 9:
		# String
		return (args[0], "")