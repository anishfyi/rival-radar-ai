from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Competitor, CompetitorAnalysis
from .serializers import CompetitorSerializer, CompetitorAnalysisSerializer
import google.generativeai as genai
from django.conf import settings

# Configure Gemini AI
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

class CompetitorViewSet(viewsets.ModelViewSet):
    queryset = Competitor.objects.all()
    serializer_class = CompetitorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def analyze(self, request, pk=None):
        competitor = self.get_object()
        
        # Prepare prompt for Gemini AI
        prompt = f"""
        Analyze the following competitor and provide insights:
        Name: {competitor.name}
        Description: {competitor.description}
        Website: {competitor.website}
        Features: {', '.join(competitor.features)}
        Market Position: {competitor.market_position}
        
        Please provide:
        1. Key strengths
        2. Weaknesses
        3. Market opportunities
        4. Potential threats
        5. Sentiment analysis
        """

        try:
            # Get AI analysis
            response = model.generate_content(prompt)
            ai_insights = response.text

            # Create analysis record
            analysis = CompetitorAnalysis.objects.create(
                competitor=competitor,
                created_by=request.user,
                ai_insights=ai_insights,
                # You would need to parse the AI response to extract these
                strengths=["Strength 1", "Strength 2"],
                weaknesses=["Weakness 1", "Weakness 2"],
                opportunities=["Opportunity 1", "Opportunity 2"],
                threats=["Threat 1", "Threat 2"],
                sentiment_score=0.75  # This would be calculated from the AI response
            )

            # Update competitor's last analyzed timestamp
            competitor.last_analyzed = analysis.analysis_date
            competitor.save()

            serializer = CompetitorAnalysisSerializer(analysis)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def market_overview(self, request):
        competitors = self.get_queryset()
        data = {
            'total_competitors': competitors.count(),
            'market_positions': list(competitors.values_list('market_position', flat=True).distinct()),
            'recent_analyses': CompetitorAnalysis.objects.filter(
                competitor__in=competitors
            ).order_by('-analysis_date')[:5].values(
                'competitor__name',
                'analysis_date',
                'market_share',
                'sentiment_score'
            )
        }
        return Response(data) 