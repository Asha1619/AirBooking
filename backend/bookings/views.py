from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db import transaction
from .models import Booking
from flights.models import Flight
from .serializers import BookingSerializer
import uuid


class BookingListCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        bookings = Booking.objects.filter(user=request.user)

        serializer = BookingSerializer(bookings, many=True)

        return Response(serializer.data)

    def post(self, request):

        flight_id = request.data.get('flight')
        seats = request.data.get('seats')

        if not flight_id or not seats:
            return Response(
                {'error': 'Flight and seats are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            seats = int(seats)
        except (ValueError, TypeError):
            return Response(
                {'error': 'Seats must be a valid number'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if seats <= 0:
            return Response(
                {'error': 'Seats must be greater than zero'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            flight = Flight.objects.get(id=flight_id)
        except Flight.DoesNotExist:
            return Response(
                {'error': 'Flight not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if flight.status in ['Cancelled', 'Completed']:
            return Response(
                {'error': 'This flight cannot be booked'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if flight.available_seats < seats:
            return Response(
                {'error': 'Not enough seats available'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():

            flight = Flight.objects.select_for_update().get(id=flight_id)

            if flight.available_seats < seats:
                return Response(
                    {'error': 'Not enough seats available'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            total_price = flight.price * seats

            flight.available_seats = flight.available_seats - seats
            flight.save()

            booking = Booking.objects.create(
                user=request.user,
                flight=flight,
                seats=seats,
                total_price=total_price,
                payment_status='Paid',
                booking_reference=uuid.uuid4().hex[:10].upper()
            )

        serializer = BookingSerializer(booking)

        return Response(
            {
                'message': 'Booking confirmed successfully',
                'booking': serializer.data
            },
            status=status.HTTP_201_CREATED
        )


class BookingDetailView(generics.RetrieveAPIView):

    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Booking.objects.filter(user=self.request.user)