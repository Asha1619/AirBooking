from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
from .serializers import UserApprovalSerializer, CurrentUserSerializer

User = get_user_model()
from .serializers import (
    RegisterSerializer,
    CustomTokenObtainPairSerializer
)


class RegisterView(generics.CreateAPIView):

    serializer_class = RegisterSerializer

    permission_classes = [AllowAny]


class LoginView(TokenObtainPairView):

    serializer_class = CustomTokenObtainPairSerializer





class CurrentUserView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(CurrentUserSerializer(request.user).data)


class PendingUsersView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        users = User.objects.filter(
            approval_status='Pending'
        )

        serializer = UserApprovalSerializer(users, many=True)

        return Response(serializer.data)



class ApproveUserView(APIView):

    permission_classes = [IsAdminUser]

    def post(self, request, id):

        user = User.objects.filter(id=id).first()

        if user is None:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        approval_status = request.data.get('approval_status')

        if approval_status not in ['Approved', 'Rejected']:
            return Response(
                {'error': 'Invalid approval status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.approval_status = approval_status
        user.save()

        return Response({
            'message': 'User status updated successfully',
            'approval_status': user.approval_status
        })