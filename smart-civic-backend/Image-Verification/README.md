# CivicFlow Vision Verification

This is the authoritative image verification module used by the FastAPI backend.

Backend code loads:

```text
smart-civic-backend/Image-Verification/vision_service.py
```

The root-level `Image-Verification/` folder is only a compatibility wrapper and should not be used as the primary implementation.

## Model

The YOLO model is downloaded automatically from Hugging Face on first use.

```text
Repository: Vansh180/PotholeNet-V1
Filename: Vision Classification.pt
```

Supported classes:

- Pothole
- Road Damage
- Garbage

## Installation

From `smart-civic-backend`:

```powershell
py -3.11 -m pip install -r Image-Verification/requirements.txt
```

The main backend `requirements.txt` also includes the image verification dependencies.

## Backend Integration

The `/api/complaints/verify-image` endpoint loads this service from `routes/complaints.py` using an absolute path relative to `smart-civic-backend`.

## Test

Put a test image at:

```text
smart-civic-backend/Image-Verification/test.jpg
```

Then run from that folder:

```powershell
py -3.11 test_vision.py
```
