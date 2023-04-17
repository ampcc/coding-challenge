from django.db import models

class Status(models.TextChoices):
    NOTHING = 0,
    ACTIVE = 1,
    PASSIVE = 2

    class Meta:
        app_label = "api"