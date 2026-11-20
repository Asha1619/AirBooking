from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class CustomUserAdmin(UserAdmin):

    fieldsets = UserAdmin.fieldsets + (
        ('Approval Information', {
            'fields': ('approval_status',)
        }),
    )

    list_display = [
        'username',
        'email',
        'approval_status',
        'is_staff'
    ]

    list_filter = ['approval_status']


admin.site.register(User, CustomUserAdmin)