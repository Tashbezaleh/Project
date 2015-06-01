# -*- coding: utf-8 -*-

from google.appengine.ext import ndb

import webapp2, cgi, re
import urllib
from encodingUtils import fix_encoding

SOLVER_NAME = "תשבצל'ה"
NUMBER_OF_PARTS = 20
DEFINTIONS_FILE_NUMBER_OF_LINES = 12810

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
    source = ndb.StringProperty(indexed = False)
    rank = ndb.IntegerProperty(indexed = False)

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


def create_NDBAnswer(answer, definition, source, rank):
	return NDBAnswer(answer=urllib.quote(fix_encoding(answer)), \
					 definition=urllib.quote(fix_encoding(definition)), \
					 source=urllib.quote(fix_encoding(source)), \
					 rank=rank)
    
def add_to_ndb(definition, answer, source, rank):
	if not entry_exists(definition, answer):
		entry = create_NDBAnswer(answer, definition, source, rank)
		entry.put()

def text_to_database_part(part):
	# """reads the entities from solver.defs_to_sols and store them in ndb"""
	# the input indicated which part of the database to upload
	defs = ''
	ls = []
	with open( (r'definitions.txt' ), 'rb') as f:
		part_size = (DEFINTIONS_FILE_NUMBER_OF_LINES / NUMBER_OF_PARTS) +1
		defs = "".join(f.readlines()[ (part-1)*(part_size) : part*part_size] )

	defs_to_sols = {l.split('-')[0].strip(): map(str.strip, l.split('-')[1].split(';')) for l in defs.split('\n')[:-1]}
	
	# peleg's. maybe it checks if the first new entry is in the db, and if so it returns
	# if entry_exists(defs_to_sols.items()[0][0], defs_to_sols.items()[0][1][0]):
	# 	return

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
    
def vote_to_ndb(definition, answer, action):
    '''action in ['up', 'down']'''
    if action not in ['up', 'down']:
        return False
    tmp_answer = create_NDBAnswer(fix_encoding(answer), fix_encoding(definition), '', 0)
    entities = NDBAnswer.query(ndb.AND(NDBAnswer.answer == tmp_answer.answer, NDBAnswer.definition == tmp_answer.definition))
    vote = 1 if action == 'up' else -1
    if entities.get() == None:
        add_to_ndb(definition, answer, SOLVER_NAME, vote)
        return True
    entity = entities.get()
    entity.rank = entity.rank + vote
    entity.put()
    return False
        
def entry_exists(definition, answer):
	tmp_answer = create_NDBAnswer(fix_encoding(answer), fix_encoding(definition), '', 0)
	entities = NDBAnswer.query(ndb.AND(NDBAnswer.answer == tmp_answer.answer, \
									 NDBAnswer.definition == tmp_answer.definition))
	return entities.get() != None

def clean_db():
	#''' not fully checked, may cause problems'''
	ndb.delete_multi(NDBAnswer.query().fetch(keys_only=True))

def uploadPart(part):
	# uploads part number the argument, receives an integer
	# does it iff the last part uploaded was exactly the preceding one
	#order part from 1 to N
	# N is 5(can change)
	#stores part in the registry as int
	app = webapp2.get_app()
	registry_dict= app.registry
	part = int(part)

	if ('part' in registry_dict) and (int(registry_dict['part']) == (part - 1) ) :
		#the first part or (is in the dict and the last one uploaded is the right one
		text_to_database_part(part)
		app.registry['part'] = str(part)
		if ( part == NUMBER_OF_PARTS):
			app.registry['ready'] = "yes"
		return True
	return False

			