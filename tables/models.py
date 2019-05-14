from django.db import models


class TableModel(models.Model):
    SHAPE_CHOICES = (
        ('r', 'rectangle'),
        ('o', 'oval'),
    )

    seats_qty = models.IntegerField()
    shape = models.CharField(
        max_length=1,
        choices=SHAPE_CHOICES,
    )
    coordinate_min_x = models.IntegerField()  # min val: 0, max val: 100
    coordinate_min_y = models.IntegerField()  # min val: 0, max val: 100
    width = models.IntegerField()  # min: 1, max: 100
    length = models.IntegerField()  # min: 1, max: 100
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'<TableModel id: {self.id}, ' \
               f'shape: {self.shape}, ' \
               f'coordinates: {self.coordinate_min_x, self.coordinate_min_y}, ' \
               f'width: {self.width}, ' \
               f'length: {self.length}>'


class ReservationModel(models.Model):
    class Meta:
        unique_together = (('date', 'table'),)
    table = models.ForeignKey(TableModel, related_name='reservation', on_delete=models.CASCADE)
    date = models.DateField()
    client_name = models.CharField(max_length=50)
    client_email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
