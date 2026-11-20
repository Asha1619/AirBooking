# AirBooking

A small full-stack flight booking app built with **Django REST Framework** and **React (Vite)** for a take-home assignment.

## Features

- Custom user model with an `approval_status` (Pending / Approved / Rejected)
- JWT registration, login and token refresh
- New users start as **Pending** and can only log in after admin approval
- Flight search with airport, date and availability filters
- Flight details, seat selection and booking creation with a confirmation reference
- "My Trips" page showing the logged-in user's bookings
- Admin dashboard to approve/reject users and update flight statuses
- Responsive React UI with clear loading, empty and error states

> Note: email notifications (Celery) and third-party live flight feeds (AirLabs/OpenSky) are not wired in. Flight status is managed from the admin dashboard and can be refreshed on the flight details screen.

## Project structure

```
AirBooking/
├── backend/    # Django / DRF project
└── frontend/   # React + Vite app
```

## Backend setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API runs at `http://127.0.0.1:8000/api/`.

### Create an admin for testing

```bash
python manage.py createsuperuser
```

Staff users can log in without waiting for approval. Use the username/password you create above at `http://127.0.0.1:5173/login`.

To test the approval flow, register a normal user from the UI, then log in as the admin and approve them from the admin dashboard.

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://127.0.0.1:5173`.

If the API runs somewhere else, change `baseURL` in `frontend/src/services/api.jsx`. Allowed CORS origins are listed in `backend/airbooking/settings.py`.

## API endpoints

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register/` | Public | Register a new user (status: Pending) |
| POST | `/api/auth/login/` | Public | Log in and receive JWT tokens |
| POST | `/api/auth/token/refresh/` | Public | Refresh the access token |
| GET | `/api/auth/me/` | Authenticated | Current user details (used for role checks) |
| GET | `/api/flights/search/` | Authenticated | Search flights (`departure`, `arrival`, `date`, `available`) |
| GET | `/api/flights/{id}/` | Authenticated | Flight details |
| POST | `/api/bookings/` | Authenticated | Create a booking (`flight`, `seats`) |
| GET | `/api/bookings/` | Authenticated | List the current user's bookings |
| GET | `/api/bookings/{id}/` | Authenticated | Booking details |
| GET | `/api/admin/users/pending/` | Admin | Pending user registrations |
| POST | `/api/admin/users/{id}/approve/` | Admin | Approve or reject a user |
| GET | `/api/admin/flights/` | Admin | List flights for management |
| PUT | `/api/admin/flights/{id}/status/` | Admin | Update a flight's status |

Authenticated requests use `Authorization: Bearer <access_token>`.

## Booking flow

1. Register → admin approves the account → log in.
2. Search flights and open a flight.
3. Choose the number of seats and confirm the booking.
4. View the confirmation reference under **My Trips**.
5. Admins can change flight status; users see the latest status after refreshing the flight details page.
