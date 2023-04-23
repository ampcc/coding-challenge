from django.db import models
from django.contrib.auth.models import User
from unixtimestampfield.fields import UnixTimeStampField


class Application(models.Model):
    class Status(models.IntegerChoices):
        INITIAL = 0
        CHALLENGE_STARTED = 1
        IN_REVIEW = 2
        COMPLETED = 3
        EXPIRED = 4
        ARCHIVED = 5

    applicationId = models.CharField(max_length=8, blank=False)  # Validate that only Numbers can be Stored.
    challengeId = models.IntegerField()
    operatingSystem = models.CharField(max_length=100, blank=True)
    programmingLanguage = models.CharField(max_length=100, blank=True)
    expiry = UnixTimeStampField(use_numeric=True)
    submission = UnixTimeStampField(blank=True, use_numeric=True)
    githubRepo = models.URLField(max_length=200, blank=True)
    status = models.IntegerField(choices=Status.choices,
                                 default=Status.INITIAL)
    created = UnixTimeStampField(auto_now_add=True, use_numeric=True)
    modified = UnixTimeStampField(auto_now=True, use_numeric=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.applicationId

    class Meta:
        app_label = "api"
