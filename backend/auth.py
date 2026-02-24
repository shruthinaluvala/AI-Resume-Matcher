from flask import Blueprint, request, jsonify
import sqlite3
from flask_jwt_extended import create_access_token

auth = Blueprint("auth", __name__)

# ---------- REGISTER ----------
@auth.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        email = data["email"]
        password = data["password"]

        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()

        # check if user exists
        cursor.execute("SELECT * FROM users WHERE email=?", (email,))
        existing = cursor.fetchone()

        if existing:
            return jsonify({"message": "User already exists"}), 400

        cursor.execute(
            "INSERT INTO users(email,password) VALUES (?,?)",
            (email, password)
        )
        conn.commit()
        conn.close()

        return jsonify({"message": "User registered successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------- LOGIN ----------
@auth.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data["email"]
        password = data["password"]

        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()

        cursor.execute(
            "SELECT * FROM users WHERE email=? AND password=?",
            (email, password)
        )
        user = cursor.fetchone()
        conn.close()

        if user:
            # 🔥 create JWT token
            access_token = create_access_token(identity=email)

            return jsonify({
                "message": "Login successful",
                "access_token": access_token
            })

        else:
            return jsonify({"message": "Invalid credentials"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500