# -*- coding: utf-8 -*-

import cgi, re, json
import urllib
from encodingUtils import fix_encoding
from google.appengine.ext import ndb

MAX_WINNERS = 15
#sb - scoring board.
class Winner(ndb.Model):
    name = ndb.StringProperty(indexed=False)
    score = ndb.IntegerProperty()
    
    @staticmethod
    def create(name, score):
        return Winner(name=fix_encoding(name), score=score)
    
    def as_tuple(self):
        return (self.name, self.score)

def get_raw_sb():
    return sorted(Winner.query().fetch(), key=lambda w: w.score, reverse=True)
    
def get_sb():
    return map(Winner.as_tuple, get_raw_sb())[:MAX_WINNERS]

def add_sb(name, score):
    name = ' '.join(name.split())
    new_winner = Winner.create(name, score)
    winners = get_raw_sb()
    if len(winners) < MAX_WINNERS:
        new_winner.put()
        winners += [new_winner]
    elif new_winner.score > winners[-1].score:
        new_winner.put()
        winners[-1].key.delete()
        winners = winners[:-1] + [new_winner]
    return sorted(map(Winner.as_tuple, winners), key=lambda x:x[1], reverse=True)