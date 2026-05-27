from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os


app = Flask(__name__)
CORS(app)

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
mongo_client = None


def get_db():
    global mongo_client

    if not MONGO_URI:
        raise RuntimeError("MONGO_URI environment variable is not set")

    if mongo_client is None:
        mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)

    return mongo_client["budgetDB"]


def get_transactions_collection():
    return get_db()["transactions"]


def get_budgets_collection():
    return get_db()["budgets"]


def database_error_response(error):
    return jsonify({
        "error": "Database connection failed",
        "details": str(error),
    }), 500


@app.route("/")
def home():
    return jsonify({"message": "Budget API is running!"})


@app.route("/api/health")
def health():
    try:
        get_db().client.admin.command("ping")
        return jsonify({
            "status": "ok",
            "database": "connected",
        })
    except Exception as error:
        return database_error_response(error)


@app.route("/api/transactions", methods=["POST"])
def add_transaction():
    try:
        data = request.json

        transaction = {
            "title": data["title"],
            "amount": data["amount"],
            "category": data["category"],
            "date": data["date"],
        }

        result = get_transactions_collection().insert_one(transaction)

        return jsonify({
            "message": "Transaction added!",
            "id": str(result.inserted_id),
        })
    except Exception as error:
        return database_error_response(error)


@app.route("/api/transactions", methods=["GET"])
def get_transactions():
    try:
        transactions = []

        for transaction in get_transactions_collection().find():
            transactions.append({
                "id": str(transaction["_id"]),
                "title": transaction["title"],
                "amount": transaction["amount"],
                "category": transaction["category"],
                "date": transaction.get("date", ""),
            })

        return jsonify(transactions)
    except Exception as error:
        return database_error_response(error)


@app.route("/api/transactions/<id>", methods=["DELETE"])
def delete_transaction(id):
    try:
        get_transactions_collection().delete_one({
            "_id": ObjectId(id),
        })

        return jsonify({
            "message": "Transaction deleted!",
        })
    except Exception as error:
        return database_error_response(error)


@app.route("/api/budgets", methods=["GET"])
def get_budgets():
    try:
        budgets = {}

        for budget in get_budgets_collection().find():
            budgets[budget["category"]] = budget["limit"]

        return jsonify(budgets)
    except Exception as error:
        return database_error_response(error)


@app.route("/api/budgets", methods=["POST"])
def save_budget():
    try:
        data = request.json

        get_budgets_collection().update_one(
            {"category": data["category"]},
            {"$set": {"limit": data["limit"]}},
            upsert=True,
        )

        return jsonify({"message": "Budget saved!"})
    except Exception as error:
        return database_error_response(error)


@app.route("/api/budgets/<category>", methods=["DELETE"])
def delete_budget_route(category):
    try:
        category = category.strip()

        get_budgets_collection().delete_one({
            "category": category,
        })

        return jsonify({"message": "Budget deleted!"})
    except Exception as error:
        return database_error_response(error)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)