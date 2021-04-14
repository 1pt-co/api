import json
import string
import random
from datetime import datetime

import pytz
from flask import Response
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import validators
from pysafebrowsing import SafeBrowsing

import config
import credentials

# Authorize Google Sheets
try:
	scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
	gc = gspread.authorize(ServiceAccountCredentials.from_json_keyfile_dict(credentials.credentials(), scope))
except OSError:
	print("JSON file with Google account credentials not found!")
	exit(1)

# Open sheets
datasheet = gc.open(config.spreadsheet).sheet1
indexsheet = gc.open(config.spreadsheet).worksheet("index")
index = int(indexsheet.cell(1, 1).value)

def add_row(short, long, ip):
	global index

	if long[:7] != "http://" and long[:8] != "https://":
		long = "http://" + long

	if not validators.url(long):
		response = Response(json.dumps({"status": 400, "message": "Bad request: The provided URL is malformed"}), status=400, mimetype="application/json")
		response.headers['Access-Control-Allow-Origin'] = '*'
		return response

	short = _ensure_unique(short)

	timestamp = datetime.now(pytz.timezone("US/Eastern")).strftime("%d/%m/%Y %H:%M:%S")

	cells = datasheet.range("B" + str(index + 1) + ":F" + str(index + 1))
	cells[0].value = timestamp
	cells[1].value = 0
	cells[2].value = short
	cells[3].value = long
	cells[4].value = ip
	datasheet.update_cells(cells, "USER_ENTERED")

	index += 1
	indexsheet.update("A1", index)

	response = Response(json.dumps({"status": 201, "message": "Added!", "short": short, "long": long}), status=201, mimetype="application/json")
	response.headers['Access-Control-Allow-Origin'] = '*'
	return response

def get_row(short_url):
  data = datasheet.get_all_values()

  for i, row in enumerate(data):
    if(row[3].lower() == short_url):
      datasheet.update_cell(i+1, 3, int(row[2])+1)

      response = Response(json.dumps({"status": 301, "url": row[4]}), status=301, mimetype="application/json")
      response.headers['Access-Control-Allow-Origin'] = '*'
      return response

  response = Response(json.dumps({"status": 404, "message": "URL doesn't exist!"}), status=404, mimetype="application/json")
  response.headers['Access-Control-Allow-Origin'] = '*'
  return response

def get_info(short_url):
  data = datasheet.get_all_values()

  for row in data:
    if(row[3].lower() == short_url):
      s = SafeBrowsing(credentials.safe_browsing_api_key())
      r = s.lookup_urls([row[4]])

      malicious = r[row[4]]["malicious"]

      response = Response(json.dumps({"status": 200, "short": row[3], "long": row[4], "date": row[1], "hits": int(row[2]), "malicious": malicious}), status=301, mimetype="application/json")
      response.headers['Access-Control-Allow-Origin'] = '*'
      return response

  response = Response(json.dumps({"status": 404, "message": "URL doesn't exist!"}), status=404, mimetype="application/json")
  response.headers['Access-Control-Allow-Origin'] = '*'
  return response

def get_stats():
  stats_sheet = gc.open(config.spreadsheet).worksheet("stats")
  visits = int(stats_sheet.cell(2, 3).value)
  links = int(stats_sheet.cell(3, 3).value)

  response = Response(json.dumps({"status": 200, "total_links": links, "total_visits": visits}), status=200, mimetype="application/json")
  response.headers['Access-Control-Allow-Origin'] = '*'
  return response

def _generate_random(length):
  letters = string.ascii_lowercase
  return("".join(random.choice(letters) for i in range(length)))

def _ensure_unique(url):
  data = datasheet.get_all_values()

  while True:
    already_exists = False
    for row in data:
      if url == row[3].lower() or url == None:
        already_exists = True
        url = _generate_random(config.random_url_length)
        break;

    if(not already_exists): break;

  return url
