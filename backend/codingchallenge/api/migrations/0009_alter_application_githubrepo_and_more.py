# Generated by Django 4.1.7 on 2023-05-02 13:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_remove_application_applicantemail_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='application',
            name='githubRepo',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='application',
            name='status',
            field=models.IntegerField(choices=[(0, 'Initial'), (1, 'Challenge Started'), (2, 'In Review'), (3, 'Completed'), (4, 'Expired'), (5, 'Archived')], default=0),
        ),
    ]
