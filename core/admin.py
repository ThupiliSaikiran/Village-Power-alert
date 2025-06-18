from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Village, PowerOutage

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('name', 'mobile', 'role', 'village', 'is_staff')
    list_filter = ('role', 'is_staff')
    search_fields = ('name', 'mobile')
    ordering = ('name',)
    
    fieldsets = (
        (None, {'fields': ('mobile', 'password')}),
        ('Personal info', {'fields': ('name', 'role', 'village')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('mobile', 'name', 'role', 'password1', 'password2'),
        }),
    )

@admin.register(Village)
class VillageAdmin(admin.ModelAdmin):
    list_display = ('name', 'district', 'state')
    search_fields = ('name', 'district', 'state')
    list_filter = ('state', 'district')

@admin.register(PowerOutage)
class PowerOutageAdmin(admin.ModelAdmin):
    list_display = ('village', 'reason', 'start_time', 'expected_return', 'is_resolved', 'reported_by', 'resolved_time')
    list_filter = ('is_resolved', 'start_time', 'village')
    search_fields = ('village__name', 'reason', 'reported_by__name')
    readonly_fields = ('start_time', 'resolved_time')
