from django.db import models

class Status(models.TextChoices):
    INITIAL = 0,
    CHALLENGE_STARTED = 1,
    IN_REVIEW = 2,
    COMPLETED = 3,
    ARCHIVED = 4,

    class Meta:
        app_label = "api"