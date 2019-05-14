from django.urls import path

from . import views

urlpatterns = [
    path('schema', views.RoomSchemaView.as_view()),
    path('', views.ReservationView.as_view()),
    # path('date/<str:date>', views.DateReservationView.as_view()),
]