from .app import database
from flask_login import UserMixin, current_user


class User(UserMixin, database.Model):

    id = database.Column(database.Integer, primary_key=True)
    email = database.Column(database.String(100), unique=True)
    password = database.Column(database.String(100))
    name = database.Column(database.String(1000))
    spents = database.relationship(
        'UserSpents', cascade="all,delete", backref='user', lazy="subquery")
    incomes = database.relationship(
        'UserIncomes', cascade="all,delete", backref='user', lazy="subquery")


class UserSpents(database.Model):
    __tablename__ = 'spent'
    id = database.Column(database.Integer, primary_key=True)
    category = database.Column(database.String(100))
    spent = database.Column(database.Integer)
    date = database.Column(database.Date)
    user_id = database.Column(database.Integer, database.ForeignKey('user.id'))


class UserIncomes(database.Model):
    __tablename__ = 'income'
    id = database.Column(database.Integer, primary_key=True)
    income = database.Column(database.Integer)
    date = database.Column(database.Date)
    user_id = database.Column(database.Integer, database.ForeignKey('user.id'))
