from django.core.mail import EmailMessage
from rest_framework.generics import ListCreateAPIView, ListAPIView

from tables.models import ReservationModel, TableModel
from tables.serializers import ReservationSerializer, TableSerializer


def send_email(subject, body, recipient):
    email = EmailMessage(subject, body, to=[recipient])
    email.send()


class RoomSchemaView(ListAPIView):
    serializer_class = TableSerializer
    queryset = TableModel.objects.all()


class ReservationView(ListCreateAPIView):
    serializer_class = ReservationSerializer

    def get_queryset(self):
        queryset = ReservationModel.objects.all()
        # TODO: validate query param: date
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(date=date)
        return queryset

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        subject = 'Acknowledgement of reservation'
        body = f'Hello {request.data["client_name"]}, ' \
               f'you have reserved table # {request.data["table"]} on {request.data["date"]}'
        send_email(subject=subject, body=body, recipient=request.data['client_email'])
        return response
