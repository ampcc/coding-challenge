from django_extensions.management.jobs import MinutelyJob


class Job(MinutelyJob):
    help = "My sample job."

    def execute(self):
        print("I print every minute")
