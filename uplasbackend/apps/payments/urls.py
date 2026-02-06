# apps/payments/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SubscriptionPlanViewSet,
    UserSubscriptionViewSet,
    PaymentTransactionViewSet,
    PaystackWebhookAPIView
)

app_name = 'payments'

router = DefaultRouter()
router.register(r'plans', SubscriptionPlanViewSet, basename='subscription-plan')
router.register(r'subscriptions', UserSubscriptionViewSet, basename='user-subscription')
router.register(r'transactions', PaymentTransactionViewSet, basename='payment-transaction')

urlpatterns = [
    path('', include(router.urls)),
    path('paystack/webhook/', PaystackWebhookAPIView.as_view(), name='paystack-webhook'),
]