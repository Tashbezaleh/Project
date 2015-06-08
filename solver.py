# -*- coding: utf-8 -*-

import urllib, json, re
import databaseUtils, webapp2, time
from encodingUtils import fix_encoding
from threading import Thread, Lock

MINUTES_TO_WAIT = 5
MAX_CALLS = 20
NUM_OF_SOLS_TO_SHOW = 7

#
# methods for online search
#
def get_matches(res, regex):
    '''Returns a list of all possible matches of 'regex' in 'res'.'''
    res = fix_encoding(res)
    res = res.replace('\r', '')
    res = res.replace('\n', '')
    res = ''.join(c if c in r'אבגדהוזחטיכלמנסעפצקרשתךםןףץ' else ' ' for c in res)
    res = ' '.join(res.split())
    matches = regex.findall(res)
    return [(m, res.count(m)) for m in matches]

def add_to_hist(hist, res, regex):
    '''Adds the matches of 'regex' in 'res' to the histogram 'hist'.'''
    matches = get_matches(res, regex)
    for match, count in matches:
        if match not in hist:
            hist[match] = 0
        hist[match] += count

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
        return []
    hits = data['results']
    histogram = dict()
    lock = Lock()
    # a function to download the webpages and add them to hist in parallel
    def fill_hist(url_arg):
        try:
            res = urllib.urlopen(url_arg).read()
            lock.acquire()
            add_to_hist(histogram, res, guess)
        except:
            pass # need to decide what exactly we want to do, but that seems to patch the bug
        finally:
            if lock.locked():
                lock.release()
    threads = []
    for h in hits:
        t = Thread(target=fill_hist, args=(urllib.unquote(h['url']),))
        t.daemon = True # won't hold the program running if the main thread stops
        threads += [t]
        t.start()
    
    for t in threads: # wait for all threads to finish
        t.join()
        
    for w in definition.split(): # removes the definition words from the possible answers
        if w in histogram:
            del histogram[w]

    # removing the freqs
    answers = map(lambda t: t[0], style(histogram))
    return [databaseUtils.Answer(answer, definition, databaseUtils.SOLVER_NAME, 0, 0) for answer in answers]


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
    off_lst = databaseUtils.find_in_ndb(definition, guess)
    for e in off_lst[:NUM_OF_SOLS_TO_SHOW]:
        yield e
    if len(off_lst) >= NUM_OF_SOLS_TO_SHOW:
        return
    on_lst = find_online(definition, guess)
    on_lst = filter(lambda r: r not in off_lst, on_lst)
    lst = on_lst[:NUM_OF_SOLS_TO_SHOW - len(off_lst)]
    for e in lst:
        yield e

def user_pat_to_regex(pat):
    # regex magic, please do not change without asking and testing
    # to_final = {'כ': 'ך', 'מ': 'ם', 'נ': 'ן', 'פ': 'ף', 'צ': 'ץ'}
    # if pat[-1] in to_final:
    #     pat = pat[:-1] + to_final[pat[-1]]
    pat = fix_encoding(pat)
    letters_with_final_version = [u'כ', u'מ', u'נ', u'פ', u'צ']
    first_byte = map(lambda c: c.encode('utf')[0], letters_with_final_version) # only 0xd7
    second_byte = map(lambda c: c.encode('utf')[1], letters_with_final_version)
    if len(pat) >= 2 and pat[-2] in first_byte and pat[-1] in second_byte:
        pat = pat[:-1] + chr(ord(pat[-1]) - 1)
    return re.compile('(?:^| )(' + pat.replace('?', r'[^ ]{2}') + ')(?:$| )', re.UNICODE)