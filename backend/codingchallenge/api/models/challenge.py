from django.db import models


class Challenge(models.Model):

    challengeHeading = models.TextField()
    challengeText = models.TextField()
    active = models.BooleanField(default=True, blank=False)

    def __str__(self):
        return self.challengeHeading

    class Meta:
        app_label = "api"
