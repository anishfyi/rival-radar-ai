from rest_framework import serializers
from .models import Competitor, CompetitorAnalysis

class CompetitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competitor
        fields = [
            'id',
            'name',
            'description',
            'website',
            'features',
            'market_position',
            'created_at',
            'updated_at',
            'last_analyzed',
        ]
        read_only_fields = ['created_at', 'updated_at', 'last_analyzed']

class CompetitorAnalysisSerializer(serializers.ModelSerializer):
    competitor_name = serializers.CharField(source='competitor.name', read_only=True)

    class Meta:
        model = CompetitorAnalysis
        fields = [
            'id',
            'competitor',
            'competitor_name',
            'analysis_date',
            'strengths',
            'weaknesses',
            'opportunities',
            'threats',
            'market_share',
            'ai_insights',
            'sentiment_score',
        ]
        read_only_fields = ['analysis_date'] 