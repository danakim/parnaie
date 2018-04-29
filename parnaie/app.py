from flask import Flask, render_template, send_from_directory
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
    r = redis.StrictRedis(host='parnaie_redis_1', port=6379)

    def getItem ():
        key = r.randomkey()
        item = { 
            "word": r.hget(key, 'word'),
            "props": [
                r.hget(key, 'prop0'), r.hget(key, 'prop1'),
                r.hget(key, 'prop2'), r.hget(key, 'prop3')
            ],
            "defs": [
                r.hget(key, 'def0'), r.hget(key, 'def1'), r.hget(key, 'def2'),
                r.hget(key, 'def3'), r.hget(key, 'def4'), r.hget(key, 'def5'),
                r.hget(key, 'def6')
            ]
        }
        return item;

    @app.route('/')
    def index():
        key = r.randomkey()
        return render_template(
        'index.html',
        wordObj = json.dumps(getItem())
        )

    @app.route('/despre')
    def despre():
        return render_template(
        'despre.html',
        )

    @app.route('/assets/<path:path>')
    def send_assets(path):
        return send_from_directory('assets', path)

    return app
