from rest_framework import serializers
from .models import Challenge, Application
from django.db.models import CharField

class GetChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ["id", "challengeHeading", "challengeText"]

class GetApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["applicationId", "challengeId", "operatingSystem", "programmingLanguage", "expiry", "submission", "githubRepo",
                  "status", "created", "modified", "user"]

class PostApplicationSerializer(serializers.ModelSerializer):
    tmpLink = serializers.SerializerMethodField()

    def get_tmpLink(self, obj):
        key = self.context.get("key")
        applicationId = self.context.get("applicationId")
        if key:
            tmpLink = "www.amplimind.io/application/" + key
            return tmpLink
        return False

    class Meta:
        model = Application
        tmpLink = CharField()

        fields = ["applicationId", "created", "status", "expiry", "tmpLink"]

class GetApplicationStatus(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["applicationId", "challengeId", "operatingSystem", "programmingLanguage", "expiry", "submission", "status"]