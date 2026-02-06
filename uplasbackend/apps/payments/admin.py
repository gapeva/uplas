# uplasbackend/apps/payments/admin.py
from django.contrib import admin
from .models import SubscriptionPlan, UserSubscription, PaymentTransaction

@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'currency', 'billing_cycle', 'is_active', 'display_order')
    list_filter = ('is_active', 'billing_cycle', 'currency')
    search_fields = ('name', 'paystack_plan_code')
    ordering = ('display_order', 'price')
    list_editable = ('is_active', 'display_order')

@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'status', 'end_date', 'cancel_at_period_end')
    list_filter = ('status', 'plan', 'cancel_at_period_end')
    search_fields = ('user__email', 'plan__name', 'paystack_subscription_code', 'paystack_customer_code')
    autocomplete_fields = ('user', 'plan')
    readonly_fields = ('paystack_subscription_code', 'paystack_customer_code', 'created_at', 'updated_at')
    date_hierarchy = 'created_at'

@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'currency', 'status', 'paid_at', 'payment_method')
    list_filter = ('status', 'currency', 'payment_method')
    search_fields = ('user__email', 'transaction_id', 'paystack_reference')
    autocomplete_fields = ('user', 'user_subscription')
    readonly_fields = ('transaction_id', 'paystack_reference', 'created_at', 'updated_at')
    date_hierarchy = 'paid_at'