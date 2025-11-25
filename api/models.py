import secrets
from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class Member(models.Model):
    """
    Custom user model for application authentication.
    """
    username = models.CharField(max_length=150, unique=True, db_index=True)
    password = models.CharField(max_length=128)
    email = models.EmailField(max_length=254, blank=True, null=True)
    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "members"
        ordering = ["-created_at"]

    def __str__(self):
        return self.username

    def set_password(self, raw_password):
        """Hash and set the password."""
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        """Check if the provided password matches the stored hash."""
        return check_password(raw_password, self.password)

    @property
    def is_authenticated(self):
        """Always return True for authenticated users."""
        return True

    @property
    def is_anonymous(self):
        """Always return False for authenticated users."""
        return False

    def has_perm(self, perm, obj=None):
        """Check if user has a specific permission (for DRF compatibility)."""
        return True

    def has_module_perms(self, app_label):
        """Check if user has permissions to view app (for DRF compatibility)."""
        return True


class AuthToken(models.Model):
    """
    Authentication token model for Member authentication.
    """
    token = models.CharField(max_length=64, unique=True, db_index=True)
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="auth_tokens")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "auth_tokens"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Token for {self.member.username}"

    @staticmethod
    def generate_token():
        """Generate a unique token."""
        return secrets.token_hex(32)

    @classmethod
    def create_token(cls, member):
        """Create a new token for a member."""
        token = cls.generate_token()
        return cls.objects.create(token=token, member=member)
