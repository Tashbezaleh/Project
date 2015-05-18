# -*- coding: utf-8 -*-

# seems to work but it's voodoo
def fix_encoding(s):
    '''Fixes Hebrew encoding issues.'''
    if not s:
        return s
    return s if s[0] == '\xd7' else s.encode('utf')