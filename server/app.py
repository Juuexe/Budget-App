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
        "category": data["category"]
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
            "category": transaction["category"]
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

if __name__ == "__main__":
    app.run(debug=True)