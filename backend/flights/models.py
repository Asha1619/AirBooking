from django.db import models


class Flight(models.Model):

    STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('On Time', 'On Time'),
        ('Delayed', 'Delayed'),
        ('Cancelled', 'Cancelled'),
        ('Completed', 'Completed'),
    ]

    flight_number = models.CharField(max_length=20)

    airline = models.CharField(max_length=100)

    departure_airport = models.CharField(max_length=100)

    arrival_airport = models.CharField(max_length=100)

    departure_time = models.DateTimeField()

    arrival_time = models.DateTimeField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    total_seats = models.PositiveIntegerField()

    available_seats = models.PositiveIntegerField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Scheduled'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.flight_number