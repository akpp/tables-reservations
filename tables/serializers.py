import datetime

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from tables.models import ReservationModel, TableModel


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableModel
        fields = ('id', 'seats_qty', 'shape', 'coordinate_min_x', 'coordinate_min_y', 'width', 'length')


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservationModel
        fields = ('id', 'table', 'date', 'client_name', 'client_email')

    def validate_date(self, validated_data):
        if validated_data < datetime.date.today():
            raise ValidationError('You can not set a date that has already passed!')

        return validated_data
