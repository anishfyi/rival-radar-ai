from django.db import models
from django.contrib.auth import get_user_model
from competitors.models import Competitor

User = get_user_model()

class Analysis(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    competitors = models.ManyToManyField(Competitor, related_name='competitor_analyses')
    data = models.JSONField(default=dict)
    
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = "Analyses"
        ordering = ['-created_at'] 