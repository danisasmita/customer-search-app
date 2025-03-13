# Customer Search Application

## ⚙️ Start the Backend Project First
Before cloning and running the frontend, make sure to start the backend project by following these steps:

```bash
git clone https://github.com/danisasmita/customer-search.git
```

Navigate to the backend project directory:

```bash
cd customer-search
```

Copy and configure the environment file:

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials.

Install dependencies:

```bash
go mod tidy
```

Run the database migration and seed data:

```bash
go run cmd/main.go --migrate --seed
```

Start the backend application:

```bash
go run cmd/main.go
```

## 🚀 Clone the Frontend Repository
To register, log in, and search for customers, set up the frontend project:

```bash
git clone https://github.com/danisasmita/customer-search-app.git
```

Navigate to the frontend project directory:

```bash
cd customer-search-app
```

## 🔧 Install Frontend Dependencies
Make sure Node.js and npm/yarn are installed, then run:

```bash
npm install  
```
**or**
```bash
yarn install  
```

## ▶️ Start the Frontend Application
Run the frontend application with:

```bash
npm run dev  
```
**or**
```bash
yarn dev  
```

Once the application is running, open it in your browser. You can now register, log in, and search for customers directly from the frontend. 🚀

## 🔍 Example Customer Data for Search
Here are some example customer records you can search for in the application:

| Name            | Email                 |
|----------------|----------------------|
| John Doe       | john@example.com      |
| Jane Smith     | jane@example.com      |
| Robert Johnson | robert@example.com    |
| Emily Davis    | emily@example.com     |
| Michael Wilson | michael@example.com   |
| Sarah Brown    | sarah@example.com     |
| David Lee      | david@example.com     |
| Jennifer Taylor| jennifer@example.com  |
| Kevin Martinez | kevin@example.com     |
| Lisa Anderson  | lisa@example.com      |
| Thomas Wright  | thomas@example.com    |

You can now search for customers by name or email using the search feature in the frontend application! 🎯

## ✅ Quick Access
You can **register, log in, and search for customer data** immediately after starting the frontend application.

