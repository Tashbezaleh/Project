# 	# -*- coding: utf-8 -*-

from google.appengine.ext import ndb

import webapp2, cgi, re
import urllib
from encodingUtils import fix_encoding
from random import randint
from databaseUtils import DEFINTIONS_FILE_NUMBER_OF_LINES


NUMBER_OF_DEFINTION_ANSWER_PAIRS_TO_RETURN = 60 # the size of the defiintions arrau the getNdefinition returns

def get_n_definitions():
	line_numbers_set = generate_random_set()

	#read all lines
	defs = ''
	lines = []
	relevant_lines = []
	with open( (r'definitions.txt' ), 'rb') as f:
		lines = f.readlines()

	#extract relevant lines
	for line_number in line_numbers_set:
		relevant_lines.append(lines[line_number])

	defs = "".join(lines)#relevant lines defs string

	defs_to_sols = {l.split('-')[0].strip(): map(str.strip, l.split('-')[1].split(';')) for l in defs.split('\n')[:-1]} #extract from the relevant lines the solutions
	
	#make a list of 
	definitions_list = []
	for definition in defs_to_sols:
		answers_list = []
		for sol in defs_to_sols[definition]:
			answers_list += [(fix_encoding(sol)).decode('utf')]
		definition = (fix_encoding(definition)).decode('utf')
		definitions_list += [ (definition, answers_list) ]	

	return definitions_list




def generate_random_set():
	#generates a random set in the size of NUMBER_OF_DEFINTION_ANSWER_PAIRS_TO_RETURN, each element is line number 
	s = set ()
	while len(s) < NUMBER_OF_DEFINTION_ANSWER_PAIRS_TO_RETURN:
		s.add(randint(1,DEFINTIONS_FILE_NUMBER_OF_LINES ))
	return s
