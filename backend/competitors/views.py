from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Competitor, CompetitorAnalysis
from .serializers import CompetitorSerializer, CompetitorAnalysisSerializer
import google.generativeai as genai
from django.conf import settings
import json
from google.generativeai.types import HarmCategory, HarmBlockThreshold

# Initialize the Gemini model
genai.configure(api_key=settings.GEMINI_API_KEY)  # Get API key from Django settings
model = genai.GenerativeModel('gemini-pro')

class CompetitorViewSet(viewsets.ModelViewSet):
    queryset = Competitor.objects.all()
    serializer_class = CompetitorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['post'])
    def search_companies(self, request):
        """
        Search for companies using Gemini AI based on a query.
        Returns a list of potential companies with basic information.
        """
        query = request.data.get('query')
        if not query:
            return Response(
                {'error': 'Query parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Prepare prompt for Gemini AI
        prompt = f"""
        Search for companies that match the following query: "{query}"
        
        Please return a JSON array of 5 companies with the following structure:
        [
            {{
                "name": "Company Name",
                "description": "Brief description of the company",
                "website": "company website URL",
                "industry": "Industry the company operates in",
                "features": ["Feature 1", "Feature 2", "Feature 3"]
            }}
        ]
        
        Only return the JSON array, no additional text.
        """

        try:
            # Get AI response
            response = model.generate_content(prompt)
            
            # Extract JSON from response
            try:
                # Try to parse the response as JSON directly
                companies = json.loads(response.text)
            except json.JSONDecodeError:
                # If direct parsing fails, try to extract JSON from the text
                text = response.text
                start_idx = text.find('[')
                end_idx = text.rfind(']') + 1
                
                if start_idx >= 0 and end_idx > start_idx:
                    json_str = text[start_idx:end_idx]
                    companies = json.loads(json_str)
                else:
                    return Response(
                        {'error': 'Failed to parse AI response as JSON'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            
            return Response(companies, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def compare_companies(self, request):
        """
        Compare two companies using Gemini AI and return detailed analysis.
        """
        company1 = request.data.get('company1')
        company2 = request.data.get('company2')
        
        if not company1 or not company2:
            return Response(
                {'error': 'Both company1 and company2 parameters are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Prepare prompt for Gemini AI
        prompt = f"""
        Compare the following two companies:
        
        Company 1: {company1.get('name', '')}
        Description: {company1.get('description', '')}
        Website: {company1.get('website', '')}
        Features: {', '.join(company1.get('features', []))}
        
        Company 2: {company2.get('name', '')}
        Description: {company2.get('description', '')}
        Website: {company2.get('website', '')}
        Features: {', '.join(company2.get('features', []))}
        
        Please provide a detailed comparison in JSON format with the following structure:
        {{
            "marketShare": {{
                "company1": estimated market share percentage,
                "company2": estimated market share percentage
            }},
            "revenue": {{
                "company1": estimated revenue range,
                "company2": estimated revenue range
            }},
            "strengths": {{
                "company1": ["Strength 1", "Strength 2", "Strength 3"],
                "company2": ["Strength 1", "Strength 2", "Strength 3"]
            }},
            "weaknesses": {{
                "company1": ["Weakness 1", "Weakness 2", "Weakness 3"],
                "company2": ["Weakness 1", "Weakness 2", "Weakness 3"]
            }},
            "featureComparison": [
                {{
                    "feature": "Feature name",
                    "company1Has": true/false,
                    "company2Has": true/false,
                    "notes": "Any notes about this feature comparison"
                }}
            ],
            "overallAnalysis": "Detailed analysis comparing the two companies"
        }}
        
        Only return the JSON object, no additional text.
        """

        try:
            # Get AI response
            response = model.generate_content(prompt)
            
            # Extract JSON from response
            try:
                # Try to parse the response as JSON directly
                comparison = json.loads(response.text)
            except json.JSONDecodeError:
                # If direct parsing fails, try to extract JSON from the text
                text = response.text
                start_idx = text.find('{')
                end_idx = text.rfind('}') + 1
                
                if start_idx >= 0 and end_idx > start_idx:
                    json_str = text[start_idx:end_idx]
                    comparison = json.loads(json_str)
                else:
                    return Response(
                        {'error': 'Failed to parse AI response as JSON'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            
            return Response(comparison, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def fetch_from_ai(self, request):
        """
        Fetch competitor information from Gemini AI and create a new competitor.
        """
        company_name = request.data.get('company_name')
        if not company_name:
            return Response(
                {'error': 'Company name is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Prepare prompt for Gemini AI
        prompt = f"""
        Provide detailed information about the company "{company_name}" in JSON format with the following structure:
        {{
            "name": "Full company name",
            "description": "Detailed description of the company",
            "website": "Official website URL",
            "features": ["Feature 1", "Feature 2", "Feature 3", ...],
            "market_position": "Description of market position"
        }}
        
        Only return the JSON object, no additional text.
        """

        try:
            # Get AI response
            response = model.generate_content(prompt)
            
            # Extract JSON from response
            try:
                # Try to parse the response as JSON directly
                company_data = json.loads(response.text)
            except json.JSONDecodeError:
                # If direct parsing fails, try to extract JSON from the text
                text = response.text
                start_idx = text.find('{')
                end_idx = text.rfind('}') + 1
                
                if start_idx >= 0 and end_idx > start_idx:
                    json_str = text[start_idx:end_idx]
                    company_data = json.loads(json_str)
                else:
                    return Response(
                        {'error': 'Failed to parse AI response as JSON'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            
            # Create new competitor
            serializer = self.get_serializer(data=company_data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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