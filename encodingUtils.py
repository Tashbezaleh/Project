# -*- coding: utf-8 -*-

# seems to work but it's voodoo
def fix_encoding(s):
    '''Fixes Hebrew encoding issues.'''
    if not s:
        return s
    return s if type(s) == str else s.encode('utf')
    # try:
    #     return s if s.find('\xd7') % 2 == 0 else s.encode('utf')
    #     return s if s.find('\xd7') == 0 else s.encode('utf')
    # except:
    #     return s