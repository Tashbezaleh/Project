# -*- coding: utf-8 -*-
from django import http
import scrapy

source="""<html>
	<title>Awesome Crossome</title>
	<body>
		<center>
			<h1>Awesome Crossome</h1>
			<br>
			<form method="GET" action=".">
				<input type="text" id="definition" name="definition" style="text-align: center; direction: rtl;" value=""/>
				<br>
				<input type="text" id="guess" name="guess" style="text-align: center; direction: rtl;" value=""/>
				<br>
				<input type="submit" value="Search!"/>
			</form>
		<br><br><br><br>The Answer is:</br>%s
		</center>
	</body>
</html>
"""

def home(request):
	if request.method=="GET" and 'definition' in request.GET:
			in_text = request.GET['definition']
			in_text = source % scrapy.best_func('עוף דורס', r'^ת.{8}$')
			return http.HttpResponse(in_text)
	return http.HttpResponse(source)









