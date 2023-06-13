import time

from django_extensions.management.jobs import DailyJob

from ...models import Application


class Job(DailyJob):
    help = "Correctly set EXPIRED status on outdated applications"

    def execute(self):
        not_started_applications = Application.objects.filter(status=0)
        not_uploaded_applications = Application.objects.filter(status=1)
        for application in not_started_applications:
            if (application.expiry - time.time()) < 0:
                application.status = 4
                application.save()

        for application in not_uploaded_applications:
            if (application.expiry - time.time()) < 0:
                application.status = 4
                application.save()
