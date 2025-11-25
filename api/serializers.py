from rest_framework import serializers
from .models import Member


class MemberSerializer(serializers.ModelSerializer):
    """Serializer for Member model."""
    
    class Meta:
        model = Member
        fields = ["id", "username", "email", "first_name", "last_name", "created_at"]
        read_only_fields = ["id", "created_at"]


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        min_length=8
    )
    
    class Meta:
        model = Member
        fields = ["username", "password"]
    
    def validate_username(self, value):
        """Validate username uniqueness and length."""
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        if Member.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value
    
    def validate_password(self, value):
        """Validate password length."""
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value
    
    def create(self, validated_data):
        """Create a new member with hashed password."""
        member = Member(
            username=validated_data["username"]
        )
        member.set_password(validated_data["password"])
        member.save()
        return member


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    username = serializers.CharField(required=True)
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={"input_type": "password"}
    )


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for getting user profile."""
    
    class Meta:
        model = Member
        fields = ["id", "username"]
        read_only_fields = ["id", "username"]


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""
    
    class Meta:
        model = Member
        fields = ["username"]
    
    def validate_username(self, value):
        """Validate username uniqueness."""
        if Member.objects.filter(username=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value
