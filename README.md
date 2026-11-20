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

## Additional features beyond the requirements

- Role-aware routing: admins land on the admin dashboard, passengers on the user dashboard
- Shared navbar/layout with active-link highlighting and one-click logout
- Session restored from the saved JWT on page load
- Refresh button on flight details to fetch the latest admin-updated status
- Responsive layouts, loading states, empty states and inline error messages for every screen
- Nested flight details returned with each booking so "My Trips" is a single API call

## Screenshots

Screenshots are stored in [`screenshots/`](screenshots/):

| Screen | File |
| --- | --- |
| Registration | [11-registration.png](screenshots/11-registration.png) |
| Login | [01-login.png](screenshots/01-login.png) |
| Pending user login error | [02-pending-login-401.png](screenshots/02-pending-login-401.png) |
| Admin dashboard - pending approvals | [03-admin-dashboard-pending.png](screenshots/03-admin-dashboard-pending.png) |
| Admin approves a user | [04-admin-approved-user.png](screenshots/04-admin-approved-user.png) |
| User dashboard | [05-user-dashboard.png](screenshots/05-user-dashboard.png) |
| Flight search results | [06-flight-search.png](screenshots/06-flight-search.png) |
| Flight details and booking form | [07-flight-details-booking.png](screenshots/07-flight-details-booking.png) |
| Booking confirmation | [08-booking-confirmation.png](screenshots/08-booking-confirmation.png) |
| My Trips | [09-my-trips.png](screenshots/09-my-trips.png) |
| Admin flight status update | [10-admin-flight-status.png](screenshots/10-admin-flight-status.png) |

## Demo video

[`demo-video.mp4`](demo-video.mp4) is a silent screen recording covering pending login → admin approval → approved login → flight search → booking → My Trips → admin flight-status update.

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

### Demo credentials

| Role | Username | Password | Notes |
| --- | --- | --- | --- |
| Admin | `demo_admin` | `Admin@123` | Staff user; can log in immediately |
| User | `demo_user` | `User@1234` | Approved in the demo; has one sample booking |

You can also create your own admin:

```bash
python manage.py createsuperuser
```

Staff users can log in without waiting for approval. To test the approval flow again, register a normal user from the UI, then log in as the admin and approve them from the admin dashboard.

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
