from flask import Flask, render_template, send_from_directory
import redis
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

    @app.route('/')
    def index():
        word = r.randomkey()
        definition = r.get(word)
        return render_template(
        'index.html',
        word=word,
        definition=definition
        )

    @app.route('/assets/<path:path>')
    def send_assets(path):
        return send_from_directory('assets', path)

    return app
