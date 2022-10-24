from django.db import models

# Create your models here.

class Procedure(models.Model):
    name = models.CharField(max_length=200)
    price = models.IntegerField(default=0)
    #investigation type field that has a list of choices
    