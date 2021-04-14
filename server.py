from flask import Flask, Response, request
from requests import get
from urllib.parse import unquote
import main

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
  return Response("{'status': '400', 'message': 'Bad request. Read the documentation at 1pt.co/api'}", status=400, mimetype="application/json")

@app.route('/status', methods=['GET'])
def status():
  response = Response("{'status': '200', 'message': 'I'm alive!'}", status=200, mimetype="application/json")
  response.headers['Access-Control-Allow-Origin'] = '*'
  return response

@app.route('/addURL', methods=['GET'])
def add_URL():
  short = request.args.get("short")
  long = unquote(request.args.get("long"))
  ip = request.headers.get('X-Forwarded-For')

  if(long == None):
    response = Response("{'status': '400', 'message': 'Bad request. Read the documentation at 1pt.co/api'}", status=400, mimetype="application/json")
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

  return(main.add_row(short, long, ip))

@app.route('/getURL', methods=['GET'])
def get_URL():
  short_url = request.args.get("url")

  if(short_url == None):
    response = Response("{'status': '400', 'message': 'Bad request. Read the documentation at 1pt.co/api'}", status=400, mimetype="application/json")
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

  return(main.get_row(short_url))

@app.route('/getInfo', methods=['GET'])
def get_info():
  short_url = request.args.get("url")

  if(short_url == None):
    response = Response("{'status': '400', 'message': 'Bad request. Read the documentation at 1pt.co/api'}", status=400, mimetype="application/json")
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

  return(main.get_info(short_url))

@app.route('/getStats', methods=['GET'])
def get_stats():
  return(main.get_stats())

@app.route('/proxy', methods=['GET'])
def proxy():
  if(request.args.get("url") == None):
    return Response("{'status': '400', 'message': 'Bad request.'}", status=400, mimetype="application/json")
  site = request.args.get("url")
  return get(site).content

@app.route('/', defaults={'u_path': ''})
@app.route('/<path:u_path>')
def catch_all(u_path):
  response = Response("{'status': '404', 'message': 'Not found'}", status=404, mimetype="application/json")
  response.headers['Access-Control-Allow-Origin'] = '*'
  return response

app.run(host='0.0.0.0')
