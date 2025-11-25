from django.contrib import admin
from .models import Member, AuthToken


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ["id", "username", "email", "created_at"]
    search_fields = ["username", "email"]
    list_filter = ["created_at"]
    readonly_fields = ["created_at"]
    ordering = ["-created_at"]


@admin.register(AuthToken)
class AuthTokenAdmin(admin.ModelAdmin):
    list_display = ["id", "member", "token", "created_at"]
    search_fields = ["token", "member__username"]
    list_filter = ["created_at"]
    readonly_fields = ["created_at"]
    ordering = ["-created_at"]
