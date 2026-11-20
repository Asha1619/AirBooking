from django.urls import path

from .views import (
    FlightSearchView,
    FlightDetailView,
    AdminFlightListView,
    AdminFlightStatusView
)

urlpatterns = [
    path('search/', FlightSearchView.as_view()),
    path('<int:pk>/', FlightDetailView.as_view()),
   
]