from django.db import models
from unixtimestampfield.fields import UnixTimeStampField

class Application(models.Model):
    class Status(models.IntegerChoices):
        INITIAL = 0
        CHALLENGE_STARTED = 1
        IN_REVIEW = 2
        COMPLETED = 3
        ARCHIVED = 4

    applicationId = models.CharField(max_length=8, blank=False)  # Validate that only Numbers can be Stored.

    # Problem: it is not defined now how to deal with authentication in django.
    # Perhaps `applicationKey` and `applicationId`
    # has to be in a separate model,
    # that supports authentication

    # following 3 attributes would be redundant:
    #### applicationKey = models.CharField(max_length=256)
    #### applicationToken = models.CharField(max_length=256)
    #### passphrase = models.CharField(max_length=256)

    challengeId = models.IntegerField()
    operatingSystem = models.CharField(max_length=100, blank=True)
    programmingLanguage = models.CharField(max_length=100, blank=True)
    expiry = UnixTimeStampField(use_numeric=True)
   # expiry = models.DateTimeField()  # Uses ISO-8601 as DateTime Format (can be changed)
    submission = UnixTimeStampField(blank=True, use_numeric=True)
    githubRepo = models.URLField(max_length=200, blank=True)
    status = models.IntegerField(choices=Status.choices,
                                 default=Status.INITIAL)
    applicantEmail = models.CharField(max_length=50)
    created = UnixTimeStampField(auto_now_add=True, use_numeric=True)
    modified = UnixTimeStampField(auto_now=True, use_numeric=True)

    def __str__(self):
        return self.applicationId

    class Meta:
        app_label = "api"