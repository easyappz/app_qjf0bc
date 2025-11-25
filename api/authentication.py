from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
from .models import Member


class MemberTokenAuthentication(TokenAuthentication):
    """
    Custom token authentication for Member model.
    """
    
    def authenticate_credentials(self, key):
        """
        Authenticate the token and return the member.
        """
        try:
            token = Token.objects.select_related('user').get(key=key)
        except Token.DoesNotExist:
            raise AuthenticationFailed('Invalid token.')
        
        # Get the member using the user_id from token
        try:
            member = Member.objects.get(id=token.user_id)
        except Member.DoesNotExist:
            raise AuthenticationFailed('User not found.')
        
        return (member, token)
