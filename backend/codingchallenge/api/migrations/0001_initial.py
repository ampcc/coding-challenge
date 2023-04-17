# Generated by Django 4.1.7 on 2023-04-17 13:09

from django.db import migrations, models
import unixtimestampfield.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('applicationId', models.CharField(max_length=8)),
                ('challengeId', models.IntegerField()),
                ('operatingSystem', models.CharField(blank=True, max_length=100)),
                ('programmingLanguage', models.CharField(blank=True, max_length=100)),
                ('expiry', unixtimestampfield.fields.UnixTimeStampField()),
                ('submission', models.DateTimeField(blank=True)),
                ('githubRepo', models.URLField(blank=True)),
                ('status', models.IntegerField(choices=[('0', 'Initial'), ('1', 'Challenge Started'), ('2', 'In Review'), ('3', 'Completed'), ('4', 'Archived'), ("<class 'api.models.status.Status.Meta'>", 'Meta')], default='0')),
                ('applicantEmail', models.CharField(max_length=50)),
                ('created', unixtimestampfield.fields.UnixTimeStampField(auto_now_add=True)),
                ('modified', unixtimestampfield.fields.UnixTimeStampField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Challenge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('challengeHeading', models.CharField(max_length=100)),
                ('challengeText', models.CharField(max_length=5000)),
            ],
        ),
    ]
