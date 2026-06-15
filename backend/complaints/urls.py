from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('complaints/', views.ComplaintListCreateView.as_view(), name='complaint-list'),
    path('complaints/<int:pk>/', views.ComplaintDetailView.as_view(), name='complaint-detail'),
    path('complaints/<int:pk>/status/', views.ComplaintStatusUpdateView.as_view(), name='complaint-status'),





]
