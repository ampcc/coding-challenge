# Generated by Django 4.1.7 on 2023-04-23 14:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_rename_userid_application_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='application',
            name='applicantEmail',
        ),
        migrations.AlterField(
            model_name='application',
            name='status',
            field=models.IntegerField(choices=[(0, 'Initial'), (1, 'Challenge Started'), (2, 'In Review'), (3, 'Completed'), (4, 'Archived')], default=0),
        ),
    ]
