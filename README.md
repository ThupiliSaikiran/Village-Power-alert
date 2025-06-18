# Village Power Alert System

A full-stack web application for managing and alerting villagers about power outages.

## Features

- User (Villager) Features:
  - View power outage updates for their village
  - Receive SMS alerts
  - Toggle SMS notifications
  - View outage history

- Employee (Electricity Staff) Features:
  - Add new power outage reports
  - View all outages
  - Mark outages as resolved
  - Send SMS notifications

## Tech Stack

- Backend: Django + Django REST Framework
- Database: MySQL
- Frontend: React
- SMS: Twilio/Fast2SMS

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a .env file in the backend directory with the following variables:
```
DEBUG=True
SECRET_KEY=your_secret_key
DB_NAME=village_power
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Start the development server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file with:
```
REACT_APP_API_URL=http://localhost:8000/api
```

4. Start the development server:
```bash
npm start
```

## API Documentation

The API documentation will be available at `/api/docs/` when running the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 