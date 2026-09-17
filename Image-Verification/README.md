# CivicFlow Vision Verification Compatibility Folder

The active image verification implementation is inside the backend:

```text
smart-civic-backend/Image-Verification/
```

This root-level folder is kept only for compatibility. Its `vision_service.py`
loads and re-exports `verify_image` from the backend-local implementation, so
accidental use of this folder still routes to the backend service.

Use this folder for nothing new. For backend changes, edit:

```text
smart-civic-backend/Image-Verification/vision_service.py
```

To test the active implementation, run:

```powershell
cd smart-civic-backend/Image-Verification
py -3.11 test_vision.py
```
