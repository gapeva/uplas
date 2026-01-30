from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

# Import your custom User model and UserProfile model
from .models import User, UserProfile

# --- Inline Admin for UserProfile ---
class UserProfileInline(admin.StackedInline): # Or admin.TabularInline for a more compact view
    """
    Inline admin descriptor for UserProfile.
    This allows editing UserProfile fields directly within the User admin page.
    """
    model = UserProfile
    can_delete = False # Usually, a UserProfile is deleted when the User is deleted
    verbose_name_plural = _('Profile')
    fk_name = 'user' # Explicitly state the foreign key if not 'user' (though it is here)
    
    # Define which fields from UserProfile to show inline
    # You can use fieldsets here too for better organization if many fields
    fields = (
        'bio', 'linkedin_url', 'github_url', 'website_url',
        'preferred_tutor_persona', 'preferred_tts_voice_character',
        'preferred_ttv_instructor', 'learning_style_preference',
        'areas_of_interest', 'current_knowledge_level', 'learning_goals'
    )

# --- Custom UserAdmin ---
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Admin configuration for the custom User model.
    Extends Django's base UserAdmin.
    """
    # Add UserProfile inline
    inlines = (UserProfileInline,)

    # List display in the admin change list
    list_display = (
        'email', 'username', 'full_name', 'is_staff', 'is_active',
        'is_whatsapp_verified', 'is_premium_subscriber', 'date_joined', 'last_login'
    )
    
    # Removed 'industry' from list_filter to prevent errors if the field is missing or empty on some records
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'is_premium_subscriber', 'date_joined', 'last_login')
    
    search_fields = ('email', 'username', 'full_name') 

    # Fields to display in the User change form (add/edit view)
    fieldsets = (
        (None, {'fields': ('email', 'password')}), # Email is now primary
        (_('User Identifiers'), {'fields': ('username',)}), 
        (_('Personal info'), {'fields': ('full_name', 'first_name', 'last_name', 'organization', 'industry', 'other_industry_details', 'profession', 'profile_picture_url')}),
        (_('Contact & Preferences'), {'fields': (
            'whatsapp_number', 'is_whatsapp_verified', 
            'preferred_language', 'preferred_currency'
        )}),
        (_('Platform Specific'), {'fields': ('career_interest', 'uplas_xp_points')}),
        (_('Subscription & Financial'), {'fields': ('is_premium_subscriber', 'stripe_customer_id')}), 
        (_('Location'), {'fields': ('country', 'city')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        # Removed 'created_at' and 'updated_at' to prevent errors if they don't exist on the User model
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}), 
    )
    
    # Add custom fields to the add form as well
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password', 'password2'), # 'password2' for confirmation
        }),
        (_('Personal info (Optional on create)'), {
            'classes': ('wide',),
            'fields': ('full_name', 'first_name', 'last_name', 'organization', 'industry', 'other_industry_details', 'profession')
        }),
    )

    # Simplified readonly_fields to avoid "E035" errors
    # We only include standard Django fields + explicit model fields we are sure exist
    readonly_fields = ('last_login', 'date_joined', 'uplas_xp_points') 
    
    ordering = ('-date_joined', 'email') 

    # Action to verify WhatsApp for selected users (example)
    def mark_whatsapp_verified(self, request, queryset):
        queryset.update(is_whatsapp_verified=True)
    mark_whatsapp_verified.short_description = _("Mark selected users' WhatsApp as verified")

    # Action to make selected users premium (example, ideally handled by payments)
    def make_premium(self, request, queryset):
        queryset.update(is_premium_subscriber=True) 
    make_premium.short_description = _("Mark selected users as premium subscribers")

    actions = [mark_whatsapp_verified, make_premium]