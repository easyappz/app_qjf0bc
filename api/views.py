from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from drf_spectacular.utils import extend_schema

from .models import Member, AuthToken
from .serializers import (
    MemberSerializer,
    RegisterSerializer,
    LoginSerializer,
    ProfileSerializer,
    ProfileUpdateSerializer,
)
from .authentication import MemberTokenAuthentication


class RegisterView(APIView):
    """
    API endpoint for user registration.
    """
    permission_classes = [AllowAny]

    @extend_schema(
        request=RegisterSerializer,
        responses={201: MemberSerializer},
        description="Register a new user"
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            member = serializer.save()
            
            # Create token for the new user
            auth_token = AuthToken.create_token(member)
            
            return Response(
                {
                    "id": member.id,
                    "username": member.username,
                    "token": auth_token.token,
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    API endpoint for user login.
    """
    permission_classes = [AllowAny]

    @extend_schema(
        request=LoginSerializer,
        responses={200: dict},
        description="Login user and get authentication token"
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]
        
        try:
            member = Member.objects.get(username=username)
        except Member.DoesNotExist:
            return Response(
                {"error": "Invalid username or password"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not member.check_password(password):
            return Response(
                {"error": "Invalid username or password"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create token
        auth_token = member.auth_tokens.first()
        if not auth_token:
            auth_token = AuthToken.create_token(member)
        
        return Response(
            {
                "token": auth_token.token,
                "user": {
                    "id": member.id,
                    "username": member.username,
                }
            },
            status=status.HTTP_200_OK
        )


class ProfileView(APIView):
    """
    API endpoint to get and update current user profile.
    Combined GET and PUT methods for /profile/ endpoint.
    """
    authentication_classes = [MemberTokenAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: ProfileSerializer},
        description="Get current user profile"
    )
    def get(self, request):
        """Get current user profile."""
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=ProfileUpdateSerializer,
        responses={200: ProfileSerializer},
        description="Update user profile"
    )
    def put(self, request):
        """Update current user profile."""
        serializer = ProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=False
        )
        if serializer.is_valid():
            serializer.save()
            response_serializer = ProfileSerializer(request.user)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileUpdateView(APIView):
    """
    API endpoint to update current user profile.
    Deprecated - use ProfileView instead.
    """
    authentication_classes = [MemberTokenAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=ProfileUpdateSerializer,
        responses={200: ProfileSerializer},
        description="Update user profile (full update)"
    )
    def put(self, request):
        serializer = ProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=False
        )
        if serializer.is_valid():
            serializer.save()
            response_serializer = ProfileSerializer(request.user)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=ProfileUpdateSerializer,
        responses={200: ProfileSerializer},
        description="Update user profile (partial update)"
    )
    def patch(self, request):
        serializer = ProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            response_serializer = ProfileSerializer(request.user)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
