# apps/payments/views.py
import hashlib
import hmac
import json
import logging
import requests
from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action

from .models import SubscriptionPlan, UserSubscription, PaymentTransaction
from .serializers import (
    SubscriptionPlanSerializer, 
    UserSubscriptionSerializer, 
    PaymentTransactionSerializer, 
    CreateSubscriptionSerializer, 
    CancelSubscriptionSerializer
)

logger = logging.getLogger(__name__)

PAYSTACK_SECRET_KEY = getattr(settings, 'PAYSTACK_SECRET_KEY', '')
PAYSTACK_BASE_URL = 'https://api.paystack.co'


class PaystackService:
    """Service class for Paystack API interactions."""
    
    @staticmethod
    def get_headers():
        return {
            'Authorization': f'Bearer {PAYSTACK_SECRET_KEY}',
            'Content-Type': 'application/json'
        }
    
    @staticmethod
    def initialize_transaction(email, amount, reference, callback_url=None, metadata=None):
        """Initialize a Paystack transaction."""
        url = f'{PAYSTACK_BASE_URL}/transaction/initialize'
        data = {
            'email': email,
            'amount': int(amount * 100),  # Paystack expects amount in kobo/cents
            'reference': reference,
            'callback_url': callback_url or settings.FRONTEND_URL + '/payment/callback',
            'metadata': metadata or {}
        }
        response = requests.post(url, json=data, headers=PaystackService.get_headers())
        return response.json()
    
    @staticmethod
    def verify_transaction(reference):
        """Verify a Paystack transaction."""
        url = f'{PAYSTACK_BASE_URL}/transaction/verify/{reference}'
        response = requests.get(url, headers=PaystackService.get_headers())
        return response.json()
    
    @staticmethod
    def create_subscription(customer_code, plan_code):
        """Create a Paystack subscription."""
        url = f'{PAYSTACK_BASE_URL}/subscription'
        data = {
            'customer': customer_code,
            'plan': plan_code
        }
        response = requests.post(url, json=data, headers=PaystackService.get_headers())
        return response.json()
    
    @staticmethod
    def disable_subscription(subscription_code, email_token):
        """Disable/cancel a Paystack subscription."""
        url = f'{PAYSTACK_BASE_URL}/subscription/disable'
        data = {
            'code': subscription_code,
            'token': email_token
        }
        response = requests.post(url, json=data, headers=PaystackService.get_headers())
        return response.json()


class SubscriptionPlanViewSet(viewsets.ReadOnlyModelViewSet):
    """Lists available subscription plans."""
    queryset = SubscriptionPlan.objects.filter(is_active=True)
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [AllowAny]


class UserSubscriptionViewSet(viewsets.ModelViewSet):
    """Manages user subscriptions with Paystack integration."""
    serializer_class = UserSubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserSubscription.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='my-subscription')
    def my_subscription(self, request):
        try:
            subscription = UserSubscription.objects.get(user=request.user)
            serializer = self.get_serializer(subscription)
            return Response(serializer.data)
        except UserSubscription.DoesNotExist:
            return Response({'detail': 'No active subscription found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], url_path='initialize-payment')
    def initialize_payment(self, request):
        """Initialize Paystack payment for subscription."""
        plan_id = request.data.get('plan_id')
        if not plan_id:
            return Response({'error': 'plan_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            plan = SubscriptionPlan.objects.get(id=plan_id, is_active=True)
        except SubscriptionPlan.DoesNotExist:
            return Response({'error': 'Plan not found'}, status=status.HTTP_404_NOT_FOUND)
        
        import uuid
        reference = f'uplas_{request.user.id}_{uuid.uuid4().hex[:8]}'
        
        result = PaystackService.initialize_transaction(
            email=request.user.email,
            amount=float(plan.price),
            reference=reference,
            metadata={
                'user_id': str(request.user.id),
                'plan_id': str(plan.id),
                'plan_name': plan.name
            }
        )
        
        if result.get('status'):
            PaymentTransaction.objects.create(
                user=request.user,
                amount=plan.price,
                currency=plan.currency,
                payment_method='paystack',
                transaction_id=reference,
                status='pending',
                metadata={'plan_id': str(plan.id)}
            )
            return Response({
                'authorization_url': result['data']['authorization_url'],
                'access_code': result['data']['access_code'],
                'reference': reference
            })
        
        return Response({'error': result.get('message', 'Payment initialization failed')}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='verify-payment')
    def verify_payment(self, request):
        """Verify Paystack payment and activate subscription."""
        reference = request.data.get('reference')
        if not reference:
            return Response({'error': 'reference is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        result = PaystackService.verify_transaction(reference)
        
        if result.get('status') and result['data']['status'] == 'success':
            try:
                transaction = PaymentTransaction.objects.get(transaction_id=reference)
                transaction.status = 'completed'
                transaction.save()
                
                metadata = result['data'].get('metadata', {})
                plan_id = metadata.get('plan_id') or transaction.metadata.get('plan_id')
                plan = SubscriptionPlan.objects.get(id=plan_id)
                
                # Create or update subscription
                subscription, created = UserSubscription.objects.update_or_create(
                    user=request.user,
                    defaults={
                        'plan': plan,
                        'status': 'active',
                        'start_date': timezone.now(),
                        'end_date': timezone.now() + timedelta(days=30 if 'monthly' in plan.name.lower() else 365),
                        'paystack_subscription_code': result['data'].get('authorization', {}).get('authorization_code')
                    }
                )
                
                return Response({
                    'message': 'Payment verified and subscription activated',
                    'subscription': UserSubscriptionSerializer(subscription).data
                })
            except Exception as e:
                logger.error(f'Payment verification error: {e}')
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({'error': 'Payment verification failed'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='cancel-subscription')
    def cancel_subscription(self, request):
        """Cancel user subscription."""
        try:
            subscription = UserSubscription.objects.get(user=request.user)
            subscription.status = 'cancelled'
            subscription.save()
            return Response({'message': 'Subscription cancelled successfully'})
        except UserSubscription.DoesNotExist:
            return Response({'error': 'No active subscription found'}, status=status.HTTP_404_NOT_FOUND)


class PaymentTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    """Lists payment transactions for the authenticated user."""
    serializer_class = PaymentTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PaymentTransaction.objects.filter(user=self.request.user)


class PaystackWebhookAPIView(APIView):
    """Handles webhooks from Paystack."""
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        payload = request.body
        signature = request.META.get('HTTP_X_PAYSTACK_SIGNATURE', '')
        
        # Verify webhook signature
        expected_signature = hmac.new(
            PAYSTACK_SECRET_KEY.encode('utf-8'),
            payload,
            hashlib.sha512
        ).hexdigest()
        
        if signature != expected_signature:
            logger.warning('Invalid Paystack webhook signature')
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        try:
            data = json.loads(payload)
            event = data.get('event')
            event_data = data.get('data', {})
            
            if event == 'charge.success':
                reference = event_data.get('reference')
                if reference:
                    try:
                        transaction = PaymentTransaction.objects.get(transaction_id=reference)
                        transaction.status = 'completed'
                        transaction.save()
                        logger.info(f'Payment {reference} marked as completed via webhook')
                    except PaymentTransaction.DoesNotExist:
                        logger.warning(f'Transaction {reference} not found')
            
            elif event == 'subscription.disable':
                subscription_code = event_data.get('subscription_code')
                if subscription_code:
                    UserSubscription.objects.filter(
                        paystack_subscription_code=subscription_code
                    ).update(status='cancelled')
            
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f'Webhook processing error: {e}')
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)