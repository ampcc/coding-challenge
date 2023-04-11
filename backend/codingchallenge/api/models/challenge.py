from django.db import models


class Challenge(models.Model):

    challengeHeading = models.CharField(max_length=100)
    challengeText = models.CharField(max_length=5000)

    def __str__(self):
        return self.challengeId

    class Meta:
        app_label = "api"