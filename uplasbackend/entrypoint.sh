#!/bin/bash
# Uplas Backend Entrypoint Script
# Handles database migrations and starts the application

set -e

echo "=== Uplas Backend Startup ==="

# Wait for database to be ready (if using MySQL)
if [ -n "$MYSQL_HOST" ]; then
    echo "Waiting for MySQL database at $MYSQL_HOST:${MYSQL_PORT:-3306}..."
    while ! nc -z "$MYSQL_HOST" "${MYSQL_PORT:-3306}" 2>/dev/null; do
        sleep 1
    done
    echo "MySQL database is ready!"
fi

# Run database migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Create superuser if environment variables are set
if [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    echo "Creating superuser if not exists..."
    python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='$DJANGO_SUPERUSER_EMAIL').exists():
    User.objects.create_superuser(
        email='$DJANGO_SUPERUSER_EMAIL',
        password='$DJANGO_SUPERUSER_PASSWORD',
        full_name='${DJANGO_SUPERUSER_NAME:-Admin}'
    )
    print('Superuser created successfully')
else:
    print('Superuser already exists')
" 2>/dev/null || echo "Superuser creation skipped"
fi

echo "Starting Gunicorn server..."
exec gunicorn uplas_project.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers ${GUNICORN_WORKERS:-3} \
    --threads ${GUNICORN_THREADS:-2} \
    --timeout ${GUNICORN_TIMEOUT:-120} \
    --access-logfile - \
    --error-logfile - \
    --capture-output \
    --enable-stdio-inheritance
