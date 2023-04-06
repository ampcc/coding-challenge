from django.db import models
from django.contrib.auth.models import User


# The Default Values can be looked up at: https://docs.djangoproject.com/en/4.1/ref/models/fields/

class Status(models.TextChoices):
    NOTHING = 0,
    ACTIVE = 1,
    PASSIVE = 2


class Challenge(models.Model):
    challengeHeading = models.CharField(max_length=100)
    challengeText = models.CharField(max_length=5000)

    def __str__(self):
        return self.challengeId


class Application(models.Model):
    applicationId = models.CharField(max_length=8, blank=False)  # Validate that only Numbers can be Stored.

    # Problem: its not defined now how to deal with authentication in django.
    # Perhaps `applicationKey` and `applicationId`
    # has to be in a seperate model,
    # that supports authentication

    # following 3 attributes would be redundant:
    #### applicationKey = models.CharField(max_length=256)
    #### applicationToken = models.CharField(max_length=256)
    #### passphrase = models.CharField(max_length=256)

    challengeId = models.IntegerField()
    operatingSystem = models.CharField(max_length=100, blank=True)
    programmingLanguage = models.CharField(max_length=100, blank=True)
    expiry = models.DateTimeField()  # Uses ISO-8601 as DateTime Format (can be changed)
    submission = models.DateTimeField(blank=True)
    githubRepo = models.URLField(max_length=200, blank=True)
    status = models.IntegerField(choices=Status.choices,
                                 default=Status.NOTHING)
    applicantEmail = models.CharField(max_length=50)
    created = models.DateTimeField(auto_now_add=True, auto_now=False, editable=False)
    modified = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.applicationId
