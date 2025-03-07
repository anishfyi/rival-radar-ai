from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Analysis
from .serializers import AnalysisSerializer

class AnalysisViewSet(viewsets.ModelViewSet):
    queryset = Analysis.objects.all()
    serializer_class = AnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        
    @action(detail=False, methods=['get'])
    def dashboard_data(self, request):
        """
        Return mock data for the dashboard visualization.
        In a real implementation, this would calculate actual metrics.
        """
        data = [
            {"category": "Feature Coverage", "yourCompany": 85, "competitors": 65},
            {"category": "Market Share", "yourCompany": 35, "competitors": 65},
            {"category": "Innovation", "yourCompany": 90, "competitors": 70},
            {"category": "Pricing", "yourCompany": 60, "competitors": 75},
            {"category": "Customer Satisfaction", "yourCompany": 88, "competitors": 72}
        ]
        return Response(data) 