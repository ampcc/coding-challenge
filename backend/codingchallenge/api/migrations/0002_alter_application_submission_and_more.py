# Generated by Django 4.1.7 on 2023-04-18 17:53

from django.db import migrations, models
import unixtimestampfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='application',
            name='submission',
            field=unixtimestampfield.fields.UnixTimeStampField(blank=True),
        ),
        migrations.AlterField(
            model_name='challenge',
            name='challengeHeading',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='challenge',
            name='challengeText',
            field=models.TextField(),
        ),
    ]
