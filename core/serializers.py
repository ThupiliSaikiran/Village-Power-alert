from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Village, PowerOutage
from django.utils import timezone
from datetime import timedelta


User = get_user_model()

class VillageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Village
        fields = ['id', 'name', 'district', 'state']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'mobile', 'role', 'village']
        read_only_fields = ['id']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    village_id = serializers.PrimaryKeyRelatedField(
        queryset=Village.objects.all(),
        source='village',
        write_only=True,
        required=False
    )

    class Meta:
        model = User
        fields = ['name', 'mobile', 'role', 'password', 'village_id']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

class PowerOutageSerializer(serializers.ModelSerializer):
    duration_hours = serializers.IntegerField(write_only=True, required=True)
    
    class Meta:
        model = PowerOutage
        fields = ['id', 'village', 'reason', 'start_time', 'expected_return', 'is_resolved', 'reported_by', 'resolved_time', 'duration_hours']
        read_only_fields = ['expected_return', 'start_time']

    def create(self, validated_data):
        duration_hours = validated_data.pop('duration_hours')
        start_time = timezone.now()
        expected_return = start_time + timedelta(hours=int(duration_hours))
        
        validated_data['start_time'] = start_time
        validated_data['expected_return'] = expected_return
        
        return super().create(validated_data)