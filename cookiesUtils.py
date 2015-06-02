# -*- coding: utf-8 -*-

from urllib import quote, unquote
from encodingUtils import fix_encoding

def del_from_cookies(self, answer):
    '''
    input: and integer named identifier
    output: deletes the identifier to the cookies
    Remark: if the the identifier isn't in the cookies raises an error
    '''
    #has a bug regarding the merging (later comment[yehonatan]: used it, can't find bug | even later comment[stiil yehonatan]: still can't find any bug, seems alright)
    identifier = convert_Answer_to_identifier(answer)
    self.response.delete_cookie(identifier)
    self.request.cookies.pop(identifier)
    
def convert_Answer_to_identifier(answer):
    return quote(fix_encoding(answer.definition)) + '+' + quote(fix_encoding(answer.answer))

def rate_cookie(self, answer, rate):
    identifier = convert_Answer_to_identifier(answer)
    self.response.set_cookie(identifier, str(rate), max_age=None, path='/', domain=None, secure=False)
    self.request.cookies[identifier] = str(rate)
    
def has_rated(self, answer):
    return self.request.cookies.has_key(convert_Answer_to_identifier(answer))
    
def get_rate_from_cookie(self, answer):
    if has_rated(self, answer):
        return int(self.request.cookies[convert_Answer_to_identifier(answer)])
    return 0