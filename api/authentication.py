from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import AuthToken, Member


class MemberTokenAuthentication(BaseAuthentication):
    """
    Custom token authentication for Member model.
    Expects header: Authorization: Token <token>
    """
    
    keyword = 'Token'
    
    def authenticate(self, request):
        """
        Authenticate the request and return a two-tuple of (user, token).
        """
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header:
            return None
        
        auth_parts = auth_header.split()
        
        if len(auth_parts) != 2:
            return None
        
        if auth_parts[0] != self.keyword:
            return None
        
        token_key = auth_parts[1]
        
        return self.authenticate_credentials(token_key)
    
    def authenticate_credentials(self, key):
        """
        Authenticate the token and return the member.
        """
        try:
            token = AuthToken.objects.select_related('member').get(token=key)
        except AuthToken.DoesNotExist:
            raise AuthenticationFailed('Invalid token.')
        
        member = token.member
        
        return (member, token)
    
    def authenticate_header(self, request):
        """
        Return a string to be used as the value of the WWW-Authenticate
        header in a 401 Unauthenticated response.
        """
        return self.keyword
