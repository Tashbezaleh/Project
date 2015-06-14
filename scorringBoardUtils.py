# -*- coding: utf-8 -*-

import cgi, re, json
import urllib
from encodingUtils import fix_encoding

SCORRING_BOARD = 'scorring_board.txt'
#sb - scorring board.
def get_sb():

        #temp for testing:
        return [(u"אבי",14),(u"יוסי",15)]

        #real code:
        with open(SCORRING_BOARD) as f:
                s=f.read()
        return map(lambda x: (x.split('\t')[0], int(x.split('\t')[1])),s.split('\n'))

def add_sb(name,score):
        name=" ".join(name.split())
        board=get_sb()+[[name,score]]
        board=sorted(board,key=lambda x:x[1],reverse=True)
        # TODO: take only top 15
        string="\n".join(x[0]+"\t"+str(x[1]) for x in board)
        # TODO: save string to file SCORRING_BOARD
        return board
