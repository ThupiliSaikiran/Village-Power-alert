from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

class Village(models.Model):
    name = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    state = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}, {self.district}, {self.state}"

class UserManager(BaseUserManager):
    def create_user(self, mobile, name, role, password=None, village=None, **extra_fields):
        if not mobile:
            raise ValueError('Users must have a mobile number')
        user = self.model(
            mobile=mobile,
            name=name,
            role=role,
            village=village,
            **extra_fields
        )
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, mobile, name, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if 'role' not in extra_fields:
            extra_fields['role'] = 'employee'
        
        return self.create_user(
            mobile=mobile,
            name=name,
            password=password,
            **extra_fields
        )

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('employee', 'Employee'),
    )
    name = models.CharField(max_length=100)
    mobile = models.CharField(max_length=15, unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    password = models.CharField(max_length=128)
    village = models.ForeignKey(Village, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'mobile'
    REQUIRED_FIELDS = ['name']

    objects = UserManager()

    def __str__(self):
        return f"{self.name} ({self.mobile})"

class PowerOutage(models.Model):
    village = models.ForeignKey(Village, on_delete=models.CASCADE)
    reason = models.CharField(max_length=255)
    start_time = models.DateTimeField(default=timezone.now)
    expected_return = models.DateTimeField()
    is_resolved = models.BooleanField(default=False)
    reported_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='reported_outages')
    resolved_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Outage in {self.village.name} - Resolved: {self.is_resolved}"
