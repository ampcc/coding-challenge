from rest_framework import serializers
from .models import Challenge, Application


class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ["id", "challengeHeading", "challengeText"]

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["id", "applicationId", "challengeId", "operatingSystem", "programmingLanguage", "expiry", "submission", "githubRepo",
                  "status", "applicantEmail", "created", "modified", "user"]
