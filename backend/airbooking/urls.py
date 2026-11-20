"""
URL configuration for booking project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from accounts.views import PendingUsersView, ApproveUserView

from flights.views import (
    AdminFlightListView,
    AdminFlightStatusView
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication APIs
    path('api/auth/', include('accounts.urls')),

    # Admin user approval APIs
    path('api/admin/users/pending/', PendingUsersView.as_view()),
    path('api/admin/users/<int:id>/approve/', ApproveUserView.as_view()),

    # Normal flight APIs
    path('api/flights/', include('flights.urls')),

    # Admin flight APIs
    path('api/admin/flights/', AdminFlightListView.as_view()),
    path('api/admin/flights/<int:pk>/status/', AdminFlightStatusView.as_view()),

    path('api/bookings/', include('bookings.urls')),
]