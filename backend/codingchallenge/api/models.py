from django.db import models

from django.db import models
from django.contrib.auth.models import User

class Test(models.Model):
    task = models.CharField(max_length = 180)
    extra = models.CharField(max_length=100, blank= True)
    timestamp = models.DateTimeField(auto_now_add = True, auto_now = False, blank = True)

    def __str__(self):
        return self.task

