from flask import Flask, render_template, send_from_directory, request
import redis
import json
import sys
reload(sys)
sys.setdefaultencoding('utf8')

def create_app():
    """
    Create a Flask application using the app factory pattern.

    :return: Flask app
    """
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_object('config.settings')
    app.config.from_pyfile('settings.py', silent=True)
    appUrl = 'https://parnaie.xyz'
    r = redis.StrictRedis(host='parnaie_redis_1', port=6379)

    def getItem (id=None):
        key = None

        if id is None:
            key = r.randomkey()
        else:
            key = id

        item = {
            'id': key,
            'word': r.hget(key, 'word'),
            'props': [
                r.hget(key, 'prop0'), r.hget(key, 'prop1'),
                r.hget(key, 'prop2'), r.hget(key, 'prop3')
            ],
            'defs': [
                r.hget(key, 'def0'), r.hget(key, 'def1'), r.hget(key, 'def2'),
                r.hget(key, 'def3'), r.hget(key, 'def4'), r.hget(key, 'def5')
            ]
        }
        return item;

    @app.route('/')
    def index():
        obj = getItem()
        props = ''
        for prop in obj['props']:
            props += ' ' + prop
        return render_template(
        'index.html',
        title=obj['word'],
        defs=obj['defs'],
        props=props,
        wordObj=json.dumps(obj),
        appUrl=appUrl,
        wordId=obj['id']
        )

    @app.route('/<id>')
    def displayId(id):
        obj = getItem(id)
        props = ''
        for prop in obj['props']:
            props += ' ' + prop
        return render_template(
        'index.html',
        title=obj['word'],
        defs=obj['defs'],
        props=props,
        wordObj = json.dumps(getItem(id)),
        appUrl=appUrl,
        wordId=obj['id']
        )

    @app.route('/assets/<path:path>')
    def send_assets(path):
        return send_from_directory('assets', path)

    @app.route('/random', methods=['GET'])
    def random():
        item = getItem()
        return json.dumps(item)

    @app.route('/word/<int:id>', methods=['GET'])
    def word(id):
        item = getItem(id)
        return json.dumps(item)

    return app
