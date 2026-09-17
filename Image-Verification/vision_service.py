"""
Compatibility wrapper for the backend-local vision service.

The authoritative image verification implementation lives at:
smart-civic-backend/Image-Verification/vision_service.py
"""

import importlib.util
from pathlib import Path


BACKEND_VISION_SERVICE = (
    Path(__file__).resolve().parents[1]
    / "smart-civic-backend"
    / "Image-Verification"
    / "vision_service.py"
)

spec = importlib.util.spec_from_file_location(
    "civicflow_backend_vision_service",
    BACKEND_VISION_SERVICE,
)
if spec is None or spec.loader is None:
    raise RuntimeError(f"Could not load backend vision service from {BACKEND_VISION_SERVICE}")

_backend_service = importlib.util.module_from_spec(spec)
spec.loader.exec_module(_backend_service)

verify_image = _backend_service.verify_image
