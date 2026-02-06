# users/serializers.py
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'whatsapp_number', 'organization', 'industry', 'profession')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm password")
    phone_number = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('email', 'full_name', 'password', 'password2', 'phone_number', 'organization', 'industry', 'profession')
        extra_kwargs = {
            'full_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        # Remove password2 and phone_number from validated_data
        validated_data.pop('password2', None)
        phone = validated_data.pop('phone_number', None)
        
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password'],
            whatsapp_number=phone if phone else None,
            organization=validated_data.get('organization'),
            industry=validated_data.get('industry'),
            profession=validated_data.get('profession')
        )
        return user
