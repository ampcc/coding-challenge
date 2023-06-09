from django_extensions.management.jobs import DailyJob

# import model
from ....api.models import Application

# import serializer
import time


class Job(DailyJob):
    help = "Correctly set EXPIRED status on outdated applications"

    def execute(self):
        applications = Application.objects.filter(status=0)
        # applications.iterator()
        for application in applications:
            if (application.expiry - time.time()) < 0:
                application.status = 4
                application.save()
