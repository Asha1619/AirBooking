from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from .models import Flight
from .serializers import FlightSerializer


class FlightSearchView(generics.ListAPIView):

    serializer_class = FlightSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        flights = Flight.objects.all()

        departure = self.request.query_params.get('departure')
        arrival = self.request.query_params.get('arrival')
        date = self.request.query_params.get('date')
        available = self.request.query_params.get('available')

        if departure:
            flights = flights.filter(
                departure_airport__icontains=departure
            )

        if arrival:
            flights = flights.filter(
                arrival_airport__icontains=arrival
            )

        if date:
            flights = flights.filter(
                departure_time__date=date
            )

        if available == 'true':
            flights = flights.filter(available_seats__gt=0)

        return flights


class FlightDetailView(generics.RetrieveAPIView):

    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [IsAuthenticated]



class AdminFlightListView(generics.ListAPIView):

    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [IsAdminUser]



class AdminFlightStatusView(APIView):

    permission_classes = [IsAdminUser]

    def put(self, request, pk):

        flight = Flight.objects.filter(id=pk).first()

        if flight is None:
            return Response(
                {'error': 'Flight not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        new_status = request.data.get('status')

        valid_statuses = [
            'Scheduled',
            'On Time',
            'Delayed',
            'Cancelled',
            'Completed'
        ]

        if new_status not in valid_statuses:
            return Response(
                {'error': 'Invalid flight status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        flight.status = new_status
        flight.save()

        return Response({
            'message': 'Flight status updated successfully',
            'status': flight.status
        })