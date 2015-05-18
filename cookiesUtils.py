from urllib import quote, unquote

def canVote(this,answer):
    '''
    input: an integer named identifier, output: whether the identifier is in the cookies, meaning whether the user already upvoted or downvoted the identifier
    '''
    identifier = convert_Answer_to_identifier(answer)
    return not (this.request.cookies.has_key(str(identifier).encode('utf')))

def add_to_cookies(this, answer):
    '''
    input: and integer named identifier
    output: adds the identifier to the cookies
    Remark: if the the identifier already is the cookies does not raises an error
    '''
    identifier = convert_Answer_to_identifier(answer)
    this.response.set_cookie(identifier, 'yes', max_age = None, path='/',domain=None, secure=False)
    this.request.cookies[identifier] = 'yes'

def del_from_cookies(this, answer):
    '''
    input: and integer named identifier
    output: deletes the identifier to the cookies
    Remark: if the the identifier isn't in the cookies raises an error
    '''
    #has a bug regarding the merging
    identifier = convert_Answer_to_identifier(answer)
    this.response.delete_cookie(identifier)
    # this.request.cookies.remove(identifier)

def convert_Answer_to_identifier(answer):
    return quote(answer.definition) + '+' + quote(answer.answer)