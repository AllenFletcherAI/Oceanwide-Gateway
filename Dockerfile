# -----------------------------------------------------------------------------
# Oceanwide Gateway - Freight Ingestion & Customs Compliance Gateway
# OLE Oceanwide Logistics Europe GmbH & OLGN
# -----------------------------------------------------------------------------
FROM python:3.11-slim

# Prevent Python from writing bytecode and enable immediate output flushing
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=7860 \
    HOST=0.0.0.0 \
    ENVIRONMENT=production

# Install curl for health probes and basic system utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Run as non-root user complying with CIS container benchmarks
RUN useradd -m -u 1000 gateway && \
    mkdir -p /app/app/static/uploads && \
    chown -R gateway:gateway /app

WORKDIR /app

# Install Python dependencies with caching layer
COPY --chown=gateway:gateway requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

# Copy application codebase and data assets
COPY --chown=gateway:gateway . /app

# Ensure uploads folder is writable by non-root process
RUN mkdir -p /app/app/static/uploads && \
    chmod 777 /app/app/static/uploads

# Switch to non-root execution user
USER gateway

# Expose cloud container service port (7860 for Hugging Face Spaces / default cloud)
EXPOSE 7860

# Container health monitoring probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:7860/health || exit 1

# Production ASGI entrypoint
CMD ["python", "run.py"]
