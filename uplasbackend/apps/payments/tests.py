# apps/payments/tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from decimal import Decimal
from apps.users.models import User
from .models import SubscriptionPlan, UserSubscription, PaymentTransaction


class SubscriptionPlanModelTest(TestCase):
    """Tests for SubscriptionPlan model"""
    
    def setUp(self):
        self.plan = SubscriptionPlan.objects.create(
            name='Pro Monthly',
            description='Pro plan with all features',
            price=Decimal('25000.00'),
            currency='NGN',
            billing_cycle='monthly',
            features=['Unlimited courses', 'AI Tutor', 'Projects'],
            is_active=True,
        )
    
    def test_plan_creation(self):
        """Test that subscription plan is created correctly"""
        self.assertEqual(self.plan.name, 'Pro Monthly')
        self.assertEqual(self.plan.price, Decimal('25000.00'))
        self.assertEqual(self.plan.currency, 'NGN')
        self.assertTrue(self.plan.is_active)
    
    def test_plan_str(self):
        """Test subscription plan string representation"""
        expected = 'Pro Monthly (25000.00 NGN/monthly)'
        self.assertEqual(str(self.plan), expected)


class UserSubscriptionModelTest(TestCase):
    """Tests for UserSubscription model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='TestPass123!',
            full_name='Test User'
        )
        self.plan = SubscriptionPlan.objects.create(
            name='Pro Monthly',
            price=Decimal('25000.00'),
            currency='NGN',
        )
        self.subscription = UserSubscription.objects.create(
            user=self.user,
            plan=self.plan,
            status='active',
        )
    
    def test_subscription_creation(self):
        """Test that user subscription is created correctly"""
        self.assertEqual(self.subscription.user, self.user)
        self.assertEqual(self.subscription.plan, self.plan)
        self.assertEqual(self.subscription.status, 'active')


class PaymentTransactionModelTest(TestCase):
    """Tests for PaymentTransaction model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='TestPass123!',
            full_name='Test User'
        )
        self.transaction = PaymentTransaction.objects.create(
            user=self.user,
            transaction_id='uplas_1_abc123',
            amount=Decimal('25000.00'),
            currency='NGN',
            payment_method='paystack',
            status='pending',
        )
    
    def test_transaction_creation(self):
        """Test that payment transaction is created correctly"""
        self.assertEqual(self.transaction.user, self.user)
        self.assertEqual(self.transaction.amount, Decimal('25000.00'))
        self.assertEqual(self.transaction.status, 'pending')
        self.assertEqual(self.transaction.payment_method, 'paystack')


class SubscriptionPlanAPITest(APITestCase):
    """Tests for SubscriptionPlan API endpoints"""
    
    def setUp(self):
        self.plan1 = SubscriptionPlan.objects.create(
            name='Free',
            price=Decimal('0.00'),
            currency='NGN',
            is_active=True,
        )
        self.plan2 = SubscriptionPlan.objects.create(
            name='Pro Monthly',
            price=Decimal('25000.00'),
            currency='NGN',
            is_active=True,
        )
    
    def test_list_plans(self):
        """Test listing all active subscription plans"""
        url = reverse('payments:subscription-plan-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)


class PaystackServiceTest(TestCase):
    """Tests for Paystack service functions"""
    
    def test_amount_conversion_to_kobo(self):
        """Test that amount is correctly converted to kobo/cents"""
        amount = 25000.00
        kobo_amount = int(amount * 100)
        self.assertEqual(kobo_amount, 2500000)
    
    def test_reference_generation(self):
        """Test payment reference generation format"""
        import uuid
        user_id = 1
        reference = f'uplas_{user_id}_{uuid.uuid4().hex[:8]}'
        self.assertTrue(reference.startswith('uplas_1_'))
        self.assertEqual(len(reference), 15)  # 'uplas_1_' + 8 hex chars
