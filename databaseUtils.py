# -*- coding: utf-8 -*-

from google.appengine.ext import ndb

import webapp2, cgi, re
import urllib
from encodingUtils import fix_encoding

SOLVER_NAME = 'הפותר האוטומטי'

class Answer:
	def __init__(self, answer, definition, source, rank):
		self.answer = answer
		self.definition = definition
		self.source = source
		self.rank = rank

	def __hash__(self):
		return hash((self.answer, self.definition))

	def __eq__(self, other):
		return (self.answer, self.definition) == (other.answer, other.definition)

class NDBAnswer(ndb.Model):
    # """Models an individual answer entry with ranking and source"""
    answer = ndb.StringProperty()
    definition = ndb.StringProperty()
    source = ndb.StringProperty()
    rank = ndb.IntegerProperty()

    @classmethod
    def query_answer(cls, new_definition):
    	# """returns the query in which definition is as given"""
    	return cls.query(cls.definition == urllib.quote(new_definition.encode('utf'))).order(-cls.rank)

def NDBAnswer_to_Answer(ndb_answer):
	return Answer(urllib.unquote(str(ndb_answer.answer)), \
				  urllib.unquote(str(ndb_answer.definition)), \
				  urllib.unquote(str(ndb_answer.source)), \
				  ndb_answer.rank)

def Answer_to_NDBAnswer(answer):
	return create_NDBAnswer(answer.answer, answer.definition, \
								answer.source, answer.rank)

def initialize_ndb():
	app = webapp2.get_app()
	if 'ndb initialized' not in app.registry:
		text_to_database()
		app.registry['ndb initialized'] = 1	

def create_NDBAnswer(answer, definition, source, rank):
	return NDBAnswer(answer=urllib.quote(fix_encoding(answer)), \
					 definition=urllib.quote(fix_encoding(definition)), \
					 source=urllib.quote(fix_encoding(source)), \
					 rank=rank)
    
def add_to_ndb(definition, answer, source, rank):
	if not entry_exists(definition, answer):
		entry = create_NDBAnswer(answer, definition, source, rank)
		entry.put()

def text_to_database():
	# """reads the entities from solver.defs_to_sols and store them in ndb"""
	defs = ''
	ls = []
	with open(r'definitions.txt', 'rb') as f:
		defs = f.read()

	defs_to_sols = {l.split('-')[0].strip(): map(str.strip, l.split('-')[1].split(';')) for l in defs.split('\n')[:-1]}
	if entry_exists(*defs_to_sols.items()[0]):
		return

	for definition in defs_to_sols:
		for sol in defs_to_sols[definition]:
			entry = create_NDBAnswer(sol, definition, "תשבצל'ה", 100)
			ls.append(entry)
 	ndb.put_multi(ls)

def find_in_ndb(definition, guess):
	'''Returns a list of Answers to definition that match guess'''
	qry = NDBAnswer.query(NDBAnswer.definition == urllib.quote(fix_encoding(definition)))
	answers = filter(lambda x: guess.match(x.answer),\
					map(NDBAnswer_to_Answer, qry.fetch()))
	return sorted(list(set(answers)), key=lambda ans: ans.rank, reverse=True)
    #qry = NDBAnswer.query(NDBAnswer.definition == urllib.quote(str(definition.encode('utf'))))
    # answers = [NDBAnswer_to_Answer(ndbanswer) for ndbanswer in qry.fetch(20)]
    # return qry
    #return filter(lambda x: guess.match(x.answer) and x.rank > -10, answers)

def upvote_to_ndb(definition, answer):
	tmp_answer = create_NDBAnswer(answer.encode('utf'), definition.encode('utf'), '', 0)
	entities = NDBAnswer.query(ndb.AND(NDBAnswer.answer == tmp_answer.answer, \
									 NDBAnswer.definition == tmp_answer.definition))
	if (entities.get() == None):
		add_to_ndb(definition, answer, SOLVER_NAME, 1)
		return
	entity = entities.get()
	entity.rank = entity.rank + 1
	entity.put()

def downvote_to_ndb(definition, answer):
	tmp_answer = create_NDBAnswer(answer.encode('utf'), definition.encode('utf'), '', 0)
	entities = NDBAnswer.query(ndb.AND(NDBAnswer.answer == tmp_answer.answer, \
									 NDBAnswer.definition == tmp_answer.definition))
	if (entities.get() == None):
		add_to_ndb(definition, answer, SOLVER_NAME, -1)
		return
	entity = entities.get()
	entity.rank = entity.rank - 1
	entity.put()

def vote_to_ndb(definition, answer, action):
    '''action in ['up', 'down']'''
    if action == 'up':
        upvote_to_ndb(definition, answer)
    elif action == 'down':
        downvote_to_ndb(definition, answer)
    
def entry_exists(definition, answer):
	tmp_answer = create_NDBAnswer(answer.encode('utf'), definition.encode('utf'), '', 0)
	entities = NDBAnswer.query(ndb.AND(NDBAnswer.answer == tmp_answer.answer, \
									 NDBAnswer.definition == tmp_answer.definition))
	return entities.get() != None
