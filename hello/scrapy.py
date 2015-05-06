#!/usr/bin/env python
# -*- coding: utf-8 -*-

import urllib, json, re

defs = ''
with open(r"C:\Users\PelegPC\Desktop\app engine\tashbezaleh\hello\definitions2.txt", 'rb') as f:
    defs = f.read()

    
defs_to_sols = {l.split('-')[0].strip():
                map(str.strip, l.split('-')[1].split(';'))
                for l in defs.split('\n')[:-1]}

def get_matches(res, regex):
    '''Returns a list of all possible matches of 'regex' in 'res'.'''
    res=res.split()
    res=map(lambda i: "".join([x for x in i if x in r"אבגדהוזחטיכלמנסעפצקרשתץףםךן"]),res)
    res=filter(lambda x: x.strip()!="",res)
    res = filter(lambda x: re.match(regex, x), res)
    return res

def add_to_hist(hist, res, regex):
    '''Adds the matches of 'regex' in 'res' to the histogram 'hist'.'''
    res = get_matches(res, regex)
    for r in res:
        hist[r] = 1 + (hist[r] if r in hist else 0)

def style(hist):
    '''Return a sorted list of the 10 most frequent occurences in 'hist'.'''
    items = sorted(hist.items(), key=lambda t:-t[1])[:10]
    n_matches = sum(t[1] for t in items)
    return [(k, 100.0 * v / n_matches) for (k,v) in items]

def print_hist(hist):
    for i in hist:
        print '%s: %.2f%%' % i
        
def find_online(searchfor, regex):
    '''Searches for 'searchfor' (the definition) in google and then scans for 'regex'.'''
    global defs
    query = urllib.urlencode({u'q': searchfor})
    url = 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&%s' % query
    search_response = urllib.urlopen(url)
    search_results = search_response.read()
    results = json.loads(search_results)
    data = results['responseData']
    hits = data['results']
    histogram = dict()
    for h in hits:
        res=urllib.urlopen(urllib.unquote(h['url'])).read()
        add_to_hist(histogram, res, regex)
    histogram = style(histogram)
    return histogram

##def deep_online_search(definition, guess):
##    hist = style(find_online(definition + ' תשבץ', guess))[:5]
##    regex = r'|'.join(definition.split())
##    lst = []
##    for (w, f) in hist:
##        sub_hist = find_online(w, regex)
##        lst += [(w, sum(sub_hist.values()))]
##    total = sum(f for (w, f) in lst)
##    return sorted([(w, 100.0 * f / total) for (w,f) in lst], key = lambda t: -t[1])
        
def search_guess_in_sols(regex):
    hist = dict()
    add_to_hist(hist, defs, regex)
    return hist

def find_offline(definition, guess):
    if definition in defs_to_sols:
        return filter(lambda w: re.match(guess, w), defs_to_sols[definition])
    return []

def solve(definition, guess):
    lst = find_offline(definition, guess)
    if lst:
        return [(w, 100.0 / len(lst)) for w in lst]
    return find_online(definition, guess)

def best_func(search , regex):
    #with open(r'C:\Users\PelegPC\Desktop\appengine-try-python-django-2015-04-28\appengine-try-python-django\appengine-try-python-django\hello\log.txt', 'wb') as f:
    #    f.write(search)
    #return map(lambda t: ': '.join(map(str,t)), solve('עוף דורס', r'^ת.{8}$'))
    return '</br>'.join(map(lambda t: '%s: %.2f%%' % t, solve(search, regex)))
    


#guess = r'^ת.{8}$'
#definition = 'עוף דורס'
#print_hist(solve(definition, guess))
#print '----------------------'
#print find_online('אבבא', r'להקה|שוודית')
##print_hist(deep_online_search(definition, guess))
