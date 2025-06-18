from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from knox.models import AuthToken
from django.utils import timezone
from datetime import timedelta
from .models import Village, PowerOutage
from .utils import send_outage_sms  # Update the import
from .serializers import (
    VillageSerializer, UserSerializer,
    PowerOutageSerializer, UserRegistrationSerializer
)
User = get_user_model()

class VillageViewSet(viewsets.ModelViewSet):
    queryset = Village.objects.all()
    serializer_class = VillageSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['register', 'login']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    @action(detail=False, methods=['get'])
    def me(self, request):
      serializer = self.get_serializer(request.user)
      return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = AuthToken.objects.create(user)[1]
            return Response({
                'user': UserSerializer(user).data,
                'token': token,
                'message': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        mobile = request.data.get('mobile')
        password = request.data.get('password')
        
        try:
            user = User.objects.get(mobile=mobile)
            if user.check_password(password):
                token = AuthToken.objects.create(user)[1]
                return Response({
                    'user': UserSerializer(user).data,
                    'token': token
                })
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class PowerOutageViewSet(viewsets.ModelViewSet):
    queryset = PowerOutage.objects.all()
    serializer_class = PowerOutageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'user':
            return PowerOutage.objects.filter(village=user.village)
        return PowerOutage.objects.all()

    def perform_create(self, serializer):
        # Only employees can create outages
        if self.request.user.role != 'employee':
            raise permissions.PermissionDenied("Only employees can report outages")
        
        # Get duration from request data
        duration_hours = self.request.data.get('duration_hours', 2)
        
        # Calculate expected return time
        start_time = timezone.now()
        expected_return = start_time + timedelta(hours=int(duration_hours))
        
        # Save the outage
        outage = serializer.save(
            reported_by=self.request.user,
            start_time=start_time,
            expected_return=expected_return
        )

        # Send SMS to all users in the affected village
        users = User.objects.filter(village=outage.village, role='user')
        message = f"Power outage in {outage.village.name}. Reason: {outage.reason}. Expected duration: {duration_hours} hours. Expected return: {expected_return.strftime('%I:%M %p')}"
        
        for user in users:
            send_outage_sms(user.mobile, message)
        
        return outage

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        # Only employees can resolve outages
        if request.user.role != 'employee':
            raise permissions.PermissionDenied("Only employees can resolve outages")
            
        outage = self.get_object()
        outage.is_resolved = True
        outage.resolved_time = timezone.now()
        outage.save()

        # Send SMS to all users in the affected village
        users = User.objects.filter(village=outage.village, role='user')
        message = f"Power has been restored in {outage.village.name}. Thank you for your patience."
        
        for user in users:
            send_outage_sms(user.mobile, message)

        return Response(PowerOutageSerializer(outage).data)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active (unresolved) outages"""
        queryset = self.get_queryset().filter(is_resolved=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
