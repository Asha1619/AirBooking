from rest_framework import serializers
from flights.serializers import FlightSerializer
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):

    flight_details = FlightSerializer(source='flight', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'user',
            'flight_details',
            'flight',
            'seats',
            'total_price',
            'payment_status',
            'booking_reference',
            'created_at'
        ]

        read_only_fields = [
            'id',
            'user',
            'total_price',
            'payment_status',
            'booking_reference',
            'created_at'
        ]