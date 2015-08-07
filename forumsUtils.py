# -*- coding: utf-8 -*-

import cgi
import re
import json
import urllib
from encodingUtils import fix_encoding
from google.appengine.ext import ndb

class Comment(ndb.Model):
    name = ndb.StringProperty(indexed=False)
    answer = ndb.StringProperty(indexed=False)
    description = ndb.StringProperty(indexed=False)
    commentID = ndb.IntegerProperty()
    
    @staticmethod
    def create(name, answer, description, commentID):
        return Question(name=fix_encoding(name),\
            answer=fix_encoding(answer),\
            description=fix_encoding(description),\
            commentID=commentID)

class Question(ndb.Model):
    name = ndb.StringProperty(indexed=False)
    question = ndb.StringProperty(indexed=False)
    pattern = ndb.StringProperty(indexed=False)
    description = ndb.StringProperty(indexed=False)
    comments = ndb.StructuredProperty(Comment, indexed=False, repeated=True)
    questionID = ndb.IntegerProperty()
    
    @staticmethod
    def create(name, question, pattern, description, questionID):
        return Question(name=fix_encoding(name),\
            question=fix_encoding(question),\
            pattern=fix_encoding(pattern),\
            description=fix_encoding(description),\
            comments = [],\
            questionID=questionID)

def get_raw_questions_feed():
    return Question.query().order(-Question.questionID).fetch()
    
def get_questions_feed():
    return map(lambda x:(x.name,x.question,x.pattern,x.description,x.questionID), get_raw_sb())

def add_question(name, question, pattern, description):
    name = ' '.join(name.split())
    questions = get_raw_questions_feed()
    new_question = Question.create(name, question, pattern, description, max(questions,key=lambda x:x.questionID)+1)
    new_question.put()
    return [new_question] + questions

def add_comment(QuestionURL, name, answer, description):
    name = ' '.join(name.split())
    question = ndb.Key(urlsafe=QuestionURL).get()
    comments = question.comments
    new_comment=Comment.create(name,answer,description,max(comments,key=lambda x:x.commentID)+1)
    question.comments.append(new_comment)
    question.put()