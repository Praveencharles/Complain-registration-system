from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Complaint, UserProfile


class UserSerializer(serializers.ModelSerializer):
    user_type = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'user_type']

    def get_user_type(self, obj):
        if obj.is_superuser:
            return "admin"

        try:
            return obj.profile.user_type
        except UserProfile.DoesNotExist:
            return None


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    user_type = serializers.ChoiceField(choices=['student', 'teacher', 'staff'])

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'user_type']

    def create(self, validated_data):
        user_type = validated_data.pop('user_type')
        user = User.objects.create_user(**validated_data)
        user.profile.user_type = user_type
        user.profile.save()
        return user


class ComplaintSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_type = serializers.SerializerMethodField()

    class Meta:
        model = Complaint
        fields = ['id', 'user', 'user_name', 'about', 'priority', 'status', 'user_type', 'created_at', 'updated_at']
        read_only_fields = ['user', 'user_type', 'status', 'created_at', 'updated_at']

    def get_user_name(self, obj):
        return obj.user.username

    def get_user_type(self, obj):
        return obj.user_type


class ComplaintCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ['about', 'priority']

    def create(self, validated_data):
        user = self.context['request'].user
        complaint = Complaint.objects.create(
            user=user,
            user_type=user.profile.user_type,
            **validated_data
        )
        return complaint


class ComplaintStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ['status']
