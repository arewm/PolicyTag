import uuid
from django.db import models

# Create your models here.

class Demographics(models.Model):
    age = 12
    education_level = 'kindergarten'
    gender = 'N/A'

class Survey(models.Model):
    pass


class Person(models.Model):
    expert_class = models.BooleanField(default=False)
    person_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    consent_accepted = models.BooleanField(default=False)
    demographics = models.ForeignKey(Demographics, on_delete=models.CASCADE)
    questions = models.ForeignKey(Survey, on_delete=models.CASCADE)


    def __str__(self):
        return '{}: expert={}'.format(self.person_id, self.expert_class)


class Tag(models.Model):
    tag_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    text = models.CharField(max_length=50)
    tag_class = models.CharField(max_length=50)
    custom = models.BooleanField(default=False)
    creator = models.ForeignKey(Person, on_delete=models.CASCADE, default=None, null=True)

    def __str__(self):
        return '{}: {}'.format(self.tag_class, self.text)


class Action(models.Model):
    action_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    text = models.CharField(max_length=100)

    def __str__(self):
        return '{}'.format(self.text)


class PolicyAction(models.Model):
    action_id = models.ForeignKey(Action, on_delete=models.PROTECT)
    allow = models.BooleanField()

    def __str__(self):
        return '{}'.format(self.allow)


class PolicyTag(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    priority = models.IntegerField()


class Policies(models.Model):
    policy_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tags = models.ManyToManyField(PolicyTag)
    actions = models.ManyToManyField(PolicyAction)
    owner = models.ForeignKey(Person, on_delete=models.CASCADE)
    time_to_generate = models.FloatField()
    generated = models.BooleanField(default=False)
