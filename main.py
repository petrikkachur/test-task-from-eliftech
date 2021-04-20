from flask import Blueprint, render_template, request, jsonify, redirect, url_for
from flask_login import login_required, current_user
from datetime import datetime, date
import sqlite3
from .app import database
from .models import User, UserSpents, UserIncomes
from sqlalchemy.orm import contains_eager

main = Blueprint('main', __name__)


def insert_spent(user_id, category, spent, date):

    new_post = UserSpents(category=category,
                          spent=int(spent), date=date, user_id=user_id)
    database.session.add(new_post)
    database.session.commit()


def select_spents(user_id, date_from, date_to=None):
    response = None
    if date_to is None:
        response = UserSpents.query.filter(
            UserSpents.user_id == user_id, UserSpents.date == date_from).order_by(UserSpents.date).all()

    else:
        response = UserSpents.query.filter(
            UserSpents.user_id == user_id, UserSpents.date >= date_from, UserSpents.date < date_to).order_by(UserSpents.date).all()

    return response


def update_spent(user_id, spent_id, category, spent):
    response = database.session.query(User, UserSpents).join(UserSpents, User.id == UserSpents.user_id).filter(
        User.id == user_id, UserSpents.id == spent_id).first()
    response._data[1].category = category
    response._data[1].spent = spent

    database.session.commit()


def delete_spent(user_id, spent_id):
    response = database.session.query(User, UserSpents).join(UserSpents, User.id == UserSpents.user_id).filter(
        User.id == user_id, UserSpents.id == spent_id).first()
    database.session.delete(response._data[1])
    database.session.commit()


def insert_income(user_id, income, date):
    new_post = UserIncomes(income=int(income), date=date, user_id=user_id)
    database.session.add(new_post)
    database.session.commit()


def select_incomes(user_id, date_from, date_to):
    response = UserIncomes.query.filter(
        UserIncomes.user_id == user_id, UserIncomes.date >= date_from, UserIncomes.date < date_to).order_by(UserIncomes.date).all()
    return response


def update_income(user_id, income_id, income):
    response = database.session.query(User, UserIncomes).join(UserIncomes, User.id == UserIncomes.user_id).filter(
        User.id == user_id, UserIncomes.id == income_id).first()
    response._data[1].income = income
    database.session.commit()


def delete_income(user_id, income_id):
    response = database.session.query(User, UserIncomes).join(UserIncomes, User.id == UserIncomes.user_id).filter(
        User.id == user_id, UserIncomes.id == income_id).first()
    database.session.delete(response._data[1])
    database.session.commit()


# @login_required


@main.route('/')
def main_page():
    return render_template('main.html')


@main.route('/calendar')
@login_required
def calendar_page():

    return render_template('calendar.html')


@main.route('/calendar', methods=['POST'])
@login_required
def calendar_page_post():
    date_str = request.json['date']
    date = datetime.strptime(date_str, '%Y-%m-%d')
    response = select_spents(current_user.id, date.date())
    response_array = []
    for item in response:
        response_array.append({
            "id": item.id,
            "category": item.category,
            "spent": item.spent
        })
    return jsonify({"data": response_array})


@main.route('/calendar/insert', methods=['POST'])
@login_required
def calendar_page_insert():
    date_str = request.form.get('date')
    date = datetime.strptime(date_str, '%Y-%m-%d')
    spent = request.form.get('spent')
    category = request.form.get('category')
    insert_spent(current_user.id, category, spent, date.date())
    return jsonify({})


@main.route('/calendar/update', methods=['POST'])
@login_required
def calendar_page_update():
    spent_id = request.json['spent_id']
    spent = request.json['spent']
    category = request.json['category']
    update_spent(current_user.id, spent_id, category, spent)
    return jsonify({})


@main.route('/calendar/delete', methods=['POST'])
@login_required
def calendar_page_delete():
    spent_id = request.json['spent_id']
    delete_spent(current_user.id, spent_id)
    return jsonify({})


@main.route('/calendar/monthly-report')
@login_required
def monthly_report_page():

    return render_template('monthly_report.html')


@main.route('/calendar/monthly-report', methods=['POST'])
@login_required
def monthly_report_page_post():
    date_str = request.json['date_from']
    date_from = datetime.strptime(date_str, '%Y-%m-%d')
    date_str = request.json['date_to']
    date_to = datetime.strptime(date_str, '%Y-%m-%d')

    response_spents = select_spents(
        current_user.id, date_from.date(), date_to.date())
    response_incomes = select_incomes(
        current_user.id, date_from.date(), date_to.date())
    response_incomes_array = []
    response_spents_array = []

    for item in response_spents:
        response_spents_array.append({
            "category": item.category,
            "spent": item.spent,
            "date": item.date.strftime('%Y-%m-%d')
        })

    for item in response_incomes:
        response_incomes_array.append({
            "id": item.id,
            "income": item.income,

        })
    return jsonify({"spents": response_spents_array, "incomes": response_incomes_array})


@main.route('/calendar/monthly-report/insert', methods=['POST'])
@login_required
def monthly_report_page_insert():
    date_str = request.form.get('date')
    date = datetime.strptime(date_str, '%Y-%m-%d')
    income = request.form.get('income')
    insert_income(current_user.id, income, date.date())
    return jsonify({})


@main.route('/calendar/monthly-report/update', methods=['POST'])
@login_required
def monthly_report_page_update():

    income = request.json['income']
    income_id = request.json['income_id']
    update_income(current_user.id, income_id, income)
    return jsonify({})


@main.route('/calendar/monthly-report/delete', methods=['POST'])
@login_required
def monthly_report_page_delete():
    income_id = request.json['income_id']
    delete_income(current_user.id, income_id)
    return jsonify({})
