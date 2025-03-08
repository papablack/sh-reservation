# SmartHotel Reservation Module

A comprehensive hotel reservation management system built with NestJS and RWS Framework. This application allows hotel staff to upload Excel files containing reservation data, which are then processed asynchronously to create or update booking records in the database.

## Features

- Excel file upload and processing for batch reservation management
- Asynchronous task processing with BullMQ and Redis
- MongoDB database for data storage
- RESTful API for managing bookings and tasks
- WebSocket support for real-time updates
- User authentication and authorization

## Prerequisites

- Node.js (v22 or higher)
- Yarn package manager
- Docker and Docker Compose
- MongoDB (provided via Docker)
- Redis (provided via Docker)

## Environment Setup

1. Clone the repository
2. Copy the environment template file:
   ```bash
   cp .env.dist .env
   ```
3. Adjust the environment variables in `.env` if needed

## Installation

Install dependencies for all workspaces (frontend, backend, docs):

```bash
yarn install
```

This will also run the postinstall script to initialize the CLI and build the application.

## Development

### Start the required services (MongoDB and Redis)

```bash
docker-compose up -d
```

### Build the application

Build workspaces:

```bash
# Build frontend
yarn build:front

# Build backend
yarn build:back

# Build CLI
yarn build:cli
```

### Watch mode for development

Start the application in watch mode for automatic rebuilding on file changes:

```bash
# Watch frontend changes
yarn watch:front

# Watch backend changes
yarn watch:back
```

### Run the application

```bash
yarn run
```

The application will be available at:
- Backend API: http://localhost:3001
- WebSocket: ws://localhost:3002

## Project Structure

```
.
├── backend/                  # Backend application
│   ├── src/                  # Source code
│   │   ├── app/              # Application module
│   │   ├── commands/         # CLI commands
│   │   ├── config/           # Configuration
│   │   ├── controllers/      # API controllers
│   │   ├── filters/          # Exception filters
│   │   ├── gateways/         # WebSocket gateways
│   │   ├── guards/           # Authentication guards
│   │   ├── models/           # Data models
│   │   ├── processors/       # Task processors
│   │   ├── routing/          # Route definitions
│   │   ├── services/         # Business logic services
│   │   └── test/             # Test files
│   ├── files/                # Uploaded files storage
│   └── build/                # Compiled output
├── frontend/                 # Frontend application
│   ├── public/               # Static files
│   └── src/                  # Source code
└── docs/                     # Documentation
```

## API Endpoints

### Booking Management

- `GET /booking` - List all bookings
- `GET /booking/:id` - Get booking details
- `PUT /booking/:id` - Update booking
- `DELETE /booking/:id` - Delete booking

### Task Management

- `POST /task/process` - Upload and process Excel file
- `GET /task/status/:taskId` - Check task processing status
- `GET /task/report/:taskId` - Get task processing report

## Excel File Format

The system expects Excel files with the following columns:

- `reservation_id` (number) - Unique identifier for the reservation
- `guest_name` (string) - Name of the guest
- `status` (string) - Status of the reservation (oczekująca, anulowana, zrealizowana)
- `check_in_date` (date) - Check-in date
- `check_out_date` (date) - Check-out date

Example files are provided in the repository:
- `backend/example.xlsx` - Correct format example
- `backend/error_example.xlsx` - Example with errors

## Testing

Run tests with:

```bash
cd backend
yarn test
```

## CLI Commands

The application provides CLI commands for administrative tasks:

```bash
# Add admin user
yarn rws cli admin-add [username] [pass]

# Generate API key
yarn rws cli api-key [username]
```

## Docker Environment

The application uses Docker Compose to provide MongoDB and Redis services:

- MongoDB: Available on port 27017
- Redis: Available on port 6379

To start the services:

```bash
docker-compose up -d
```

To stop the services:

```bash
docker-compose down
```