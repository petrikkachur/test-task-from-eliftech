# Back-end:
* app.py - this is main initialization file 
* models.py - file for work with model of database
* auth.py - authorization file(login, signup, logout)
  * login, login_post, signup, signup_post, logout - login, singup and logout functions
* main.py - CRUD and main app requests are processed there
  * insert_spent, select_spents, update_spent, delete_spent - CRUD function of spents
  * insert_income, select_incomes, update_income, delete_income - CRUD function of incomes
# Front-end:
  * directory `templates` - html templates
  * directory `static/js` - javascript 
    * `script_base.js` - responds for burger menu
    * `script_calendar.js` - responds for calendar 
    * `script_for_monthly_report.js` - responds for monthly report and adding sallary 
    *  `script_main.js` - responds for changing navbar color
  * directory `static/css` and `static/scss` - responds for html style
  
