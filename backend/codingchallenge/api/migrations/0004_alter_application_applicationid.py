# Generated by Django 4.1.7 on 2023-04-03 16:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_application_id_alter_application_applicationid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='application',
            name='applicationId',
            field=models.CharField(max_length=8),
        ),
    ]