from rest_framework import serializers
from .models import Challenge, Application

class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ["id", "challengeHeading", "challengeText"]