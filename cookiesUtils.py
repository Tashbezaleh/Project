# -*- coding: utf-8 -*-

from urllib import quote, unquote
from encodingUtils import fix_encoding

def del_from_cookies(this, answer):
    '''
    input: and integer named identifier
    output: deletes the identifier to the cookies
    Remark: if the the identifier isn't in the cookies raises an error
    '''
    #has a bug regarding the merging (later comment[yehonatan]: used it, can't find bug)
    identifier = convert_Answer_to_identifier(answer)
    this.response.delete_cookie(identifier)
    this.request.cookies.pop(identifier)
    
def convert_Answer_to_identifier(answer):
    return quote(fix_encoding(answer.definition)) + '+' + quote(fix_encoding(answer.answer))
    
def vote_cookie(self, answer, action):
    '''Stores a cookie that marks action-vote was made by user on answer.
    Example: vote_cookie(self, answer, 'up')'''
    identifier = convert_Answer_to_identifier(answer)
    self.response.set_cookie(identifier, action, max_age=None, path='/', domain=None, secure=False)
    self.request.cookies[identifier] = action
    
def can_vote(self, answer, action):
    '''Checks whether the user can action-vote answer.
    Example: can_vote(self, answer, 'down')'''
    identifier = convert_Answer_to_identifier(answer)
    if not self.request.cookies.has_key(identifier):
        return True
    return self.request.cookies[identifier] != action