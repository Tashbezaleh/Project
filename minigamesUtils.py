# -*- coding: utf-8 -*-

from google.appengine.ext import ndb

import webapp2, cgi, re
import urllib
from encodingUtils import fix_encoding
from random import randint


N = 60 # the size of the defiintions arrau the getNdefinition returns

def getNdefinitions():
	defs = ''
	ls = []
	with open( (r'definitions.txt' ), 'rb') as f:
		for i int xrange(60):
			defs	
		defs = "".join(f.readlines()[ (part-1)*(part_size) : part*part_size] )

	defs_to_sols = {l.split('-')[0].strip(): map(str.strip, l.split('-')[1].split(';')) for l in defs.split('\n')[:-1]}
