from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
import mysql.connector
from mysql.connector import errorcode
import bcrypt
import os
import atexit

app = Flask(__name__)
app.secret_key = os.urandom(24)

# MySQL connection
try:
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",         
        database="brain_test"
    )
    cursor = cnx.cursor(buffered=True)  # Use buffered cursor to fetch later
except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("Something is wrong with your username or password")
        exit(1)
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print("Database does not exist")
        exit(1)
    else:
        print(err)
        exit(1)

# Close database connection on exit
@atexit.register
def close_database_connection():
    cursor.close()
    cnx.close()

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/quiz')
def quiz():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        if cursor.fetchone():
            flash('نام کاربری وجود دارد', "error")
            return redirect(url_for('signup'))

        hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        try:
            cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed_pw))
            cnx.commit()
            flash('ثبت نام موفقیت آمیز بود', "success")
            return redirect(url_for('quiz'))
        except mysql.connector.Error as err:
            flash(f'Error: {str(err)}', "error")
            return redirect(url_for('signup'))

    return render_template('signup.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    cursor.execute("SELECT password FROM users WHERE username = %s", (username,))
    result = cursor.fetchone()

    if result and bcrypt.checkpw(password.encode('utf-8'), result[0].encode('utf-8')):
        session['username'] = username
        flash('ورود موفقیت آمیز بود', "success")
        return redirect(url_for('quiz'))
    else:
        flash('نام کاربری یا رمز عبور اشتباه است!', "error")
        return redirect(url_for('home'))

@app.route('/submit_score', methods=['POST'])
def submit_score():
    if 'username' in session:
        username = session['username']
        score_data = request.get_json()

        score = score_data.get('score')
        brain_color = score_data.get('brainColor')
        description = score_data.get('description')

        try:
            cursor.execute(
                "INSERT INTO quiz (username, score, brainColor, description) VALUES (%s, %s, %s, %s)",
                (username, score, brain_color, description)
            )
            cnx.commit()
            flash('نمره با موفقیت ذخیره شد!', "success")
        except mysql.connector.Error as err:
            flash(f'Error: {str(err)}', "error")

    return jsonify(success=True)

@app.route('/dashboard')
def dashboard():
    if 'username' in session:
        username = session['username']
        cursor.execute("SELECT * FROM quiz WHERE username = %s", (username,))
        scores = cursor.fetchall()
        return render_template('dashboard.html', scores=scores)
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)