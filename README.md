# ONDC Testing API

This project provides a basic CRUD API for **Store Management** within the ONDC (Open Network for Digital Commerce) network. It integrates with the **mystore (Storehippo)** third-party APIs alongside a local PostgreSQL database to synchronize store data.

---

## Features

- **Create, Read, Update, Delete** (CRUD) operations for managing stores.
- Integration with mystore (Storehippo) APIs to sync store data with ONDC network.
- Local PostgreSQL database management using Sequelize ORM.
- Built with Node.js and Express for RESTful API development.

---

## Tech Stack

- **Node.js** - Server runtime environment.
- **Express** - API routing and middleware.
- **PostgreSQL** - Relational database for local store data.
- **Sequelize** - ORM for database interaction.
- **Storehippo APIs** - Third-party API integration for ONDC store data sync.

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- PostgreSQL installed and running
- `npm` or `yarn` package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/KhushaliTrivedi/ondc_testing_api.git
   cd ondc_testing_api
   ```
2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up your PostgreSQL database and update your .env file with correct credentials:
   ```bash
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_NAME=your_db_name
   ```
4. Run database migrations (if applicable):

   ```bash
   npx sequelize-cli db:migrate
   ```
5. Start the server:
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

## API Endpoints

### Store Management (CRUD)

| Method | Endpoint      | Description        |
|--------|---------------|--------------------|
| GET    | `/stores`     | Get all stores     |
| GET    | `/stores/:id` | Get store by ID    |
| POST   | `/stores`     | Create a new store |
| PUT    | `/stores/:id` | Update store by ID |
| DELETE | `/stores/:id` | Delete store by ID |

### Integration with Storehippo (mystore)
- The API syncs store data with the Storehippo platform, which acts as a bridge to the ONDC network.
- Changes in your local store database are reflected on Storehippo and vice versa via their API.

