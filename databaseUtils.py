from google.appengine.api import users
from google.appengine.ext import ndb
from google.appengine.ext.ndb import stats

import webapp2, cgi, re
import urllib


class Answer:
	def __init__(self, answer, definition, source, rank):
		self.answer = answer
		self.definition = definition
		self.source = source
		self.rank = rank

class NDBAnswer(ndb.Model):
    """Models an individual answer entry with ranking and source"""
    answer = ndb.StringProperty()
    definition = ndb.StringProperty()
    source = ndb.StringProperty()
    rank = ndb.IntegerProperty()

    @classmethod
    def query_answer(cls, definition):
    	"""returns the query in which definition is as given"""
        return cls.query(cls.defnition == definition).order(cls.rank)

def NDBAnswer_to_Answer(ndb_answer):
	return Answer(urllib.unquote(str(ndb_answer.answer)), \
				  urllib.unquote(str(ndb_answer.definition)), \
				  ndb_answer.source, ndb_answer.rank)

def Answer_to_NDBAnswer(answer):
	return CreateNDBAnswer(answer.answer, answer.definition, \
								answer.source, answer.rank)

def initialize_ndb():
	global_stat = stats.GlobalStat.query().get()
	if global_stat.count == 0:
		text_to_database()

def create_NDBAnswer(answer, definition, source, rank):
	return NDBAnswer(answer=urllib.quote(answer), \
					 definition=urllib.quote(definition), \
					 source=source, rank=rank)
    

def add_to_ndb(definition, answer, source, rank):
	if (not entry_exists(definition, answer)):
		entry = CreateNDBAnswer(answer, definition, source, rank)
		entry.put()

def text_to_database():
	"""reads the entities from solver.defs_to_sols and store them in ndb"""
	ls = []
    for definition in solver.defs_to_sols:
    	for sol in solver.defs_to_sols[definition]:
        	entry = CreateNDBAnswer(sol, definition, "Tashbezaleh", 100)
        	ls.append(entry)
   	ndb.put_multi(ls)

def find_in_ndb(definition, guess):
    qry = NDBAnswer.query(NDBAnswer.definition == urllib.quote(definition))
    answers = [NDBAnswerToAnswer(ndbanswer) for ndbanswer in qry]
    return filter(lambda x: guess.match(x.answer), answers)

def upvote_to_ndb(definition, answer):
	entities = NDBAnswer.qry(ndb.AND(NDBAnswer.answer == answer, \
									 NDBAnswer.definition == definition))
	for entity in entities:
		entity.rank = entity.rank + 1
		entity.put()

def downvote_to_ndb(definition, answer):
	entities = NDBAnswer.qry(ndb.AND(NDBAnswer.answer == answer, \
									 NDBAnswer.definition == definition))
	for entity in entities:
		entity.rank = entity.rank - 1
		entity.put()0

def entry_exists(definition, answer):
	entities = NDBAnswer.qry(ndb.AND(NDBAnswer.answer == answer, \
									 NDBAnswer.definition == definition))
	for entry in entities:
		return True

	return False