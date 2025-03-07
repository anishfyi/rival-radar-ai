from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Competitor(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    website = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    features = models.JSONField(default=list)
    market_position = models.CharField(max_length=100)
    last_analyzed = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-updated_at']

class CompetitorAnalysis(models.Model):
    competitor = models.ForeignKey(Competitor, on_delete=models.CASCADE, related_name='analyses')
    analysis_date = models.DateTimeField(auto_now_add=True)
    strengths = models.JSONField(default=list)
    weaknesses = models.JSONField(default=list)
    opportunities = models.JSONField(default=list)
    threats = models.JSONField(default=list)
    market_share = models.FloatField(null=True, blank=True)
    ai_insights = models.TextField()
    sentiment_score = models.FloatField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Analysis for {self.competitor.name} on {self.analysis_date}"

    class Meta:
        ordering = ['-analysis_date'] 