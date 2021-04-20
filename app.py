from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from flask_login import LoginManager
app = Flask(__name__)
# init SQLAlchemy so we can use it later in our models
database = SQLAlchemy()


def create_app():
    db_path = os.path.join(os.path.dirname(__file__), 'database.db')
    db_uri = 'sqlite:///{}'.format(db_path)
    app.config['SECRET_KEY'] = 'fkg;sdkgkdjfgndfldlf;ssdfg34134fsdfsfgdfbdvbghjytyhfgfvxrpodsfpospoxa'
    app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    database.init_app(app)

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    from .models import User, UserSpents

    @login_manager.user_loader
    def load_user(user_id):
        
        return User.query.get(int(user_id))
    
    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app


create_app()
