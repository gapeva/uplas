# Dockerfile for Uplas Backend
# Optimized for VPS/PaaS deployment (Sevalla, Digital Ocean, etc.)

# --- Base Stage ---
FROM python:3.11-slim-bookworm AS base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV APP_HOME=/app

WORKDIR $APP_HOME

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       default-libmysqlclient-dev \
       gcc \
       curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# --- Builder Stage ---
FROM base AS builder

RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /app/wheels -r requirements.txt

# --- Final Stage ---
FROM base AS final

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash appuser

COPY --from=builder /app/wheels /app/wheels
RUN pip install --no-cache-dir /app/wheels/*

# Copy application code
COPY --chown=appuser:appuser . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Make entrypoint executable
COPY --chown=appuser:appuser entrypoint.sh .
RUN chmod +x ./entrypoint.sh

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health/ || exit 1

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]