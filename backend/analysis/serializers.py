from rest_framework import serializers
from .models import Analysis

class AnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analysis
        fields = [
            'id',
            'title',
            'description',
            'created_at',
            'updated_at',
            'competitors',
            'data',
        ]
        read_only_fields = ['created_at', 'updated_at'] 