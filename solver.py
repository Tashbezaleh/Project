# -*- coding: utf-8 -*-

import urllib, json, re
import databaseUtils, webapp2, time
from encodingUtils import fix_encoding 

MINUTES_TO_WAIT = 5
MAX_CALLS = 20
NUM_OF_SOLS_TO_SHOW = 7

#
# methods for online search
#
def get_matches(res, regex):
    '''Returns a list of all possible matches of 'regex' in 'res'.'''
    res=res.split()
    res=map(lambda i: ''.join([x for x in i if x in r'אבגדהוזחטיכלמנסעפצקרשתץףםךן']), res)
    res=filter(lambda x: len(x.strip()) > 0, res)
    res = filter(lambda x: regex.match(x), res)
    return res

def add_to_hist(hist, res, regex):
    '''Adds the matches of 'regex' in 'res' to the histogram 'hist'.'''
    res = get_matches(res, regex)
    for r in res:
        hist[r] = 1 + (hist[r] if r in hist else 0)

def style(hist):
    '''Return a sorted list of the 10 most frequent occurences in 'hist'.'''
    max_num_of_options = 5
    items = sorted(hist.items(), key=lambda t: -t[1])[:max_num_of_options]
    n_matches = sum(t[1] for t in items)
    return [(k, 100.0 * v / n_matches) for (k, v) in items]
        
def can_search_online():
    app = webapp2.get_app()
    if 'num calls' not in app.registry:
        return True
    if 'last call' not in app.registry:
        return True
    if (time.time() - app.registry['last call']) / 60 > MINUTES_TO_WAIT:
        app.registry['num calls'] = 0
        return True
    if app.registry['num calls'] <= MAX_CALLS:
        return True
    return False

def search_performed():
    app = webapp2.get_app()
    if 'num calls' not in app.registry:
        app.registry['num calls'] = 0
    app.registry['num calls'] += 1
    app.registry['last call'] = time.time()


def find_online(definition, guess):
    '''Searches for 'definition' in google and then scans for 'guess' (compiled regex).'''
    if not can_search_online():
        return []
    query = urllib.urlencode({u'q': fix_encoding(definition)})
    url = 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&%s' % query
    search_response = urllib.urlopen(url)
    search_results = search_response.read()
    results = json.loads(search_results)
    data = results['responseData']
    search_performed()
    if data == None:
        return 'Failure'
    hits = data['results']
    histogram = dict()
    for h in hits:
        res = urllib.urlopen(urllib.unquote(h['url'])).read()
        add_to_hist(histogram, res, guess)

    # removing the freqs
    answers = map(lambda t: t[0], style(histogram))
    return [databaseUtils.Answer(answer, definition, databaseUtils.SOLVER_NAME, 0) for answer in answers]


##def deep_online_search(definition, guess):
##    hist = style(find_online(definition + ' תשבץ', guess))[:5]
##    regex = r'|'.join(definition.split())
##    lst = []
##    for (w, f) in hist:
##        sub_hist = find_online(w, regex)
##        lst += [(w, sum(sub_hist.values()))]
##    total = sum(f for (w, f) in lst)
##    return sorted([(w, 100.0 * f / total) for (w,f) in lst], key = lambda t: -t[1])

def find(definition, guess):
    lst = databaseUtils.find_in_ndb(definition, guess)
    if len(lst) >= NUM_OF_SOLS_TO_SHOW:
        return lst[:NUM_OF_SOLS_TO_SHOW]
    return (sorted(lst+find_online(definition, guess), lambda answer: answer.rank)[:NUM_OF_SOLS_TO_SHOW]

def user_pat_to_regex(pat):
    return re.compile('^' + pat.replace('?', '..').encode('utf') + '$', re.UNICODE)