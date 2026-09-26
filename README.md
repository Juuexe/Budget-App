# Smart Budget Analytics Dashboard

A full-stack budgeting and financial analytics web application that helps users track transactions, manage budgets, view spending trends, and monitor projected monthly spending.

## Run with Docker

Install Docker Desktop, then from the repository root run:

```sh
docker compose up --build
```

Open the client at [http://localhost:3000](http://localhost:3000). The API is available at [http://localhost:5000](http://localhost:5000). Docker Compose starts a local MongoDB database and stores its data in a named volume.

Stop the app with `Ctrl+C`, then run `docker compose down`. To also delete the local database data, run `docker compose down -v`.

## Tech Stack

**Frontend**
- React.js
- TypeScript
- CSS
- Recharts

**Backend**
- Python
- Flask
- Flask-CORS
- PyMongo

**Database**
- MongoDB

## Features

- Add and delete transactions
- Store transactions in MongoDB
- Create, update, and delete category budgets
- Persistent budget tracking
- Category spending analytics
- Pie chart spending breakdown
- Monthly spending trend graph
- Rule-based monthly spending prediction
- Search and filter transactions
- Dashboard-style UI with reusable React components
