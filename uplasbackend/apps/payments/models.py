# uplasbackend/apps/payments/models.py
import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from decimal import Decimal

# Import the shared BaseModel for UUIDs and timestamps
from apps.core.models import BaseModel

# --- Choices ---
BILLING_CYCLE_CHOICES = [
    ('monthly', _('Monthly')),
    ('annually', _('Annually')),
    ('quarterly', _('Quarterly')),
]

SUBSCRIPTION_STATUS_CHOICES = [
    ('active', _('Active')),
    ('trialing', _('Trialing')),
    ('past_due', _('Past Due')),
    ('cancelled', _('Cancelled')),
    ('incomplete', _('Incomplete')),
    ('pending', _('Pending')),
]

PAYMENT_STATUS_CHOICES = [
    ('pending', _('Pending')),
    ('completed', _('Completed')),
    ('failed', _('Failed')),
    ('refunded', _('Refunded')),
]

PAYMENT_METHOD_CHOICES = [
    ('paystack', _('Paystack')),
    ('bank_transfer', _('Bank Transfer')),
    ('card', _('Card')),
]


# --- Models ---
class SubscriptionPlan(BaseModel):
    """
    Defines a subscription plan available for users (e.g., Free, Pro Monthly, Pro Yearly).
    """
    name = models.CharField(max_length=150, unique=True, verbose_name=_('Plan Name'))
    description = models.TextField(blank=True, null=True, verbose_name=_('Description'))
    paystack_plan_code = models.CharField(max_length=255, blank=True, null=True, verbose_name=_('Paystack Plan Code'), help_text=_("The plan code from Paystack"))
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_('Price'))
    currency = models.CharField(max_length=3, choices=settings.CURRENCY_CHOICES, default='NGN', verbose_name=_('Currency'))
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CYCLE_CHOICES, default='monthly', verbose_name=_('Billing Cycle'))
    features = models.JSONField(default=list, blank=True, help_text=_("List of features for this plan."))
    is_active = models.BooleanField(default=True, verbose_name=_('Is Active'))
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = _('Subscription Plan')
        verbose_name_plural = _('Subscription Plans')
        ordering = ['display_order', 'price']

    def __str__(self):
        return f"{self.name} ({self.price} {self.currency}/{self.billing_cycle})"


class UserSubscription(BaseModel):
    """
    Represents a user's subscription to a specific plan.
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscription', verbose_name=_('User'))
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True, related_name='subscriptions', verbose_name=_('Plan'))
    paystack_subscription_code = models.CharField(max_length=255, blank=True, null=True, verbose_name=_('Paystack Subscription Code'))
    paystack_customer_code = models.CharField(max_length=255, blank=True, null=True, verbose_name=_('Paystack Customer Code'))
    status = models.CharField(max_length=30, choices=SUBSCRIPTION_STATUS_CHOICES, default='pending', verbose_name=_('Status'))
    start_date = models.DateTimeField(null=True, blank=True, verbose_name=_('Start Date'))
    end_date = models.DateTimeField(null=True, blank=True, verbose_name=_('End Date'))
    cancel_at_period_end = models.BooleanField(default=False, verbose_name=_('Cancel at Period End'))

    class Meta:
        verbose_name = _('User Subscription')
        verbose_name_plural = _('User Subscriptions')

    def __str__(self):
        return f"{self.user.email}'s subscription to {self.plan.name if self.plan else 'N/A'}"


class PaymentTransaction(BaseModel):
    """
    Logs every payment transaction, successful or failed.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='payment_transactions', verbose_name=_('User'))
    user_subscription = models.ForeignKey(UserSubscription, on_delete=models.SET_NULL, null=True, blank=True, related_name='payment_transactions', verbose_name=_('Associated Subscription'))
    transaction_id = models.CharField(max_length=255, unique=True, verbose_name=_('Transaction Reference'))
    paystack_reference = models.CharField(max_length=255, blank=True, null=True, verbose_name=_('Paystack Reference'))
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_('Amount'))
    currency = models.CharField(max_length=3, choices=settings.CURRENCY_CHOICES, default='NGN', verbose_name=_('Currency'))
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='paystack', verbose_name=_('Payment Method'))
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending', verbose_name=_('Status'))
    metadata = models.JSONField(default=dict, blank=True, verbose_name=_('Metadata'))
    paid_at = models.DateTimeField(null=True, blank=True, verbose_name=_('Paid At'))

    class Meta:
        verbose_name = _('Payment Transaction')
        verbose_name_plural = _('Payment Transactions')
        ordering = ['-created_at']

    def __str__(self):
        return f"Payment {self.transaction_id} - {self.amount} {self.currency} ({self.status})"