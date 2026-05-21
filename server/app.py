from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient 
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os



app = Flask(__name__)
CORS(app)  # allow requests from frontend

#load environment var
load_dotenv()

#MongoDb connection
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)

 

db = client["budgetDB"]
transactions_collection = db["transactions"]
budgets_collection = db["budgets"]

#Home route
@app.route("/")
def home():
    return jsonify({"message": "Budget API is running!"})


# Add transaction
@app.route("/api/transactions", methods=["POST"])
def add_transaction():
    data = request.json

    transaction = {
        "title": data["title"],
        "amount": data["amount"],
        "category": data["category"],
        "date": data["date"]
    }

    result = transactions_collection.insert_one(transaction)

    return jsonify({
        "message": "Transaction added!",
        "id": str(result.inserted_id)
    })

# Get all transactions
@app.route("/api/transactions", methods=["GET"])
def get_transactions():
    transactions = []

    for transaction in transactions_collection.find():
        transactions.append({
            "id": str(transaction["_id"]),
            "title": transaction["title"],
            "amount": transaction["amount"],
            "category": transaction["category"],
            "date": transaction.get("date", "")
        })

    return jsonify(transactions)

# Delete transaction
@app.route("/api/transactions/<id>", methods=["DELETE"])
def delete_transaction(id):

    transactions_collection.delete_one({
        "_id": ObjectId(id)
    })

    return jsonify({
        "message": "Transaction deleted!"
    })


# Get all budgets
@app.route("/api/budgets", methods=["GET"])
def get_budgets():
    budgets = {}

    for budget in budgets_collection.find():
        budgets[budget["category"]] = budget["limit"]

    return jsonify(budgets)


# Add or update budget
@app.route("/api/budgets", methods=["POST"])
def save_budget():
    data = request.json

    budgets_collection.update_one(
        {"category": data["category"]},
        {"$set": {"limit": data["limit"]}},
        upsert=True
    )

    return jsonify({"message": "Budget saved!"})


@app.route("/api/budgets/<category>", methods=["DELETE"])
def delete_budget_route(category):
    category = category.strip()

    budgets_collection.delete_one({
        "category": category
    })

    return jsonify({"message": "Budget deleted!"})


if __name__ == "__main__":
    app.run(debug=True)