def canVote(this,id):
    '''
    input: an integer named id, output: whether the id is in the cookies, meaning whether the user already upvoted or downvoted the id
    '''
    return not ((this.request.cookies).has_key(str(id)))

def add_to_cookies(this, id):
    '''
    input: and integer named id
    output: adds the id to the cookies
    Remark: if the the id already is the cookies does not raises an error
    '''
    this.response.set_cookie(str(id), 'yes', max_age = None, path='/',domain=None, secure=False)

def del_from_cookies(this, id):
    '''
    input: and integer named id
    output: deletes the id to the cookies
    Remark: if the the id isn't in the cookies raises an error
    '''
    this.response.delete_cookie(str(id))

def convert_Answer_to_id(answer):
    return str(answer.answer) + "," +str(answer.definition)
