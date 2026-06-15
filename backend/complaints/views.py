from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import Complaint
from .serializers import (
    UserSerializer, RegisterSerializer,
    ComplaintSerializer, ComplaintCreateSerializer, ComplaintStatusSerializer
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ComplaintListCreateView(generics.ListCreateAPIView):
    serializer_class = ComplaintSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Complaint.objects.all().order_by('-created_at')
        return Complaint.objects.filter(user=user).order_by('-created_at')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ComplaintCreateSerializer
        return ComplaintSerializer

    def perform_create(self, serializer):
        serializer.save()


class ComplaintDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ComplaintSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Complaint.objects.all()
        return Complaint.objects.filter(user=user)


class ComplaintStatusUpdateView(generics.UpdateAPIView):
    serializer_class = ComplaintStatusSerializer

    def get_queryset(self):
        return Complaint.objects.all()

    def update(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({'error': 'Only superusers can update status'},
                            status=status.HTTP_403_FORBIDDEN)
        complaint = self.get_object()
        new_status = request.data.get('status')

        if new_status not in ['opened', 'progress', 'done']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        complaint.status = new_status
        complaint.save()
        return Response(ComplaintSerializer(complaint).data)


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer














class CreateAdminView(APIView):
    permission_classes = []

    def get(self, request):
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(
                username="admin",
                email="admin@example.com",
                password="Admin@12345"
            )
        return Response({"message": "done"})