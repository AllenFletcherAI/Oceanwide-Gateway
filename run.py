import os
import uvicorn
from app.config import settings

def main():
    port = int(os.getenv("PORT", getattr(settings, "PORT", 7860)))
    host = os.getenv("HOST", "0.0.0.0")
    env = os.getenv("ENVIRONMENT", "production")
    
    print("=" * 60)
    print("  Oceanwide Gateway - Autonomous Logistics & Customs Pre-Clearance")
    print(f"  Mode: {env.upper()} | Listening on: http://{host}:{port}")
    print("=" * 60)
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        proxy_headers=True,
        forwarded_allow_ips="*"
    )

if __name__ == "__main__":
    main()
