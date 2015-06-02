# -*- coding: utf-8 -*-

from google.appengine.ext import ndb

import webapp2, cgi, re
import urllib
from encodingUtils import fix_encoding

class NDBUDef(ndb.Model):
	# '''Unknown Definition NDB class '''
	definition = ndb.StringProperty()
	count = ndb.IntegerProperty()

	@classmethod
	def query_unknown_def(cls):
		return cls.query().order(-cls.count)

class UDef():
	def __init__(self, definition, count):
		self.definition = definition
		self.count = count

def NDBUDef_to_UDef(ndb_udef):
	return UDef(urllib.unquote(str(ndb_udef.definition)), int(ndb_udef.count))

def UDef_to_NDBUDef(udef):
	return create_NDBUDef(udef.definition, udef.count)

def create_NDBUDef(definition, count):
	return NDBAnswer(definition=urllib.quote(fix_encoding(definition)), \
                     count=count)

def add_NDBUDef(definition, count):
	if not udef_exists(definition):
		entry = create_NDBUDef(definition, count)
		entry.put()

def udef_exists(definition):
	tmp_udef = create_NDBUDef(fix_encoding(definition), 1)
	entities = NDBUDef.query(NDBUDef.definition == tmp_udef.definition)
	return entities.get() != None

def udef_remove(definition):
	tmp_udef = create_NDBUDef(fix_encoding(definition), 1)
	entities = NDBUDef.query(NDBUDef.definition == tmp_udef.definition).get()
	for entry in entities:
		entry.key.delete()

def get_udef():
	entities = NDBUDef.query_unknown_def().fetch(1)
	if (len(entities) == 0):
		return None
	return NDBUDef_to_UDef(entities[0])