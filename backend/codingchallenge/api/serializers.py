from rest_framework import serializers
from .models import Test
class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ["id", "challengeHeading", "challengeText"]


class TestApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["id", "applicationId", "challengeId", "operatingSystem", "programmingLanguage", "expiry", "submission", "githubRepo",
                  "status", "created", "modified"]
