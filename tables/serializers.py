import datetime

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from tables.models import ReservationModel, TableModel


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableModel
        fields = ('id', 'seats_qty', 'shape', 'coordinate_min_x', 'coordinate_min_y', 'width', 'length')


class ReservationSerializer(serializers.ModelSerializer):
    # is_reserved = serializers.SerializerMethodField(method_name='is_available')

    class Meta:
        model = ReservationModel
        fields = ('id', 'table', 'date', 'client_name', 'client_email')

    def validate_date(self, validated_data):
        print('validate date', [validated_data])
        if validated_data < datetime.date.today():
            raise ValidationError('You can not set a date that has already passed!')

        return validated_data

    # def is_available(self, instance):
    #     request = self.context['request']
    #     date = request.query_params.get('date')
    #     print('req:', [str(instance.date)], [date])
    #     if str(instance.date) == date:
    #         return True
    #     return False
