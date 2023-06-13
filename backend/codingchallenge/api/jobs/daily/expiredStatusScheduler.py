import time

from django_extensions.management.jobs import DailyJob

from ...models import Application


class Job(DailyJob):
    help = "Correctly set EXPIRED status on outdated applications"

    def execute(self):
        notStartedApplications = Application.objects.filter(status=0)
        notUploadedApplications = Application.objects.filter(status=1)
        for application in notStartedApplications:
            if (application.expiry - time.time()) < 0:
                application.status = 4
                application.save()

        for application in notUploadedApplications:
            if (application.expiry - time.time()) < 0:
                application.status = 4
                application.save()
