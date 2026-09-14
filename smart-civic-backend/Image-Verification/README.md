# CivicFlow Vision Verification

This module provides image verification for CivicFlow using the
PotholeNet-YOLO11 model hosted on Hugging Face.

## Why the model is not in GitHub

The model file is approximately 25 MB. Instead of committing the `.pt`
file to the Git repository, this integration downloads it automatically
from Hugging Face when the backend starts.

Hugging Face repository:

`Vansh180/PotholeNet-V1`

Model filename:

`Vision%20Classification.pt`

## Supported classes

- Pothole
- Road Damage
- Garbage

**Note:** this model does not detect waterlogging.

## Folder structure

```text
smart-civic-backend/
└── ai/
    └── vision/
        ├── model/
        │   └── (downloaded automatically)
        ├── vision_service.py
        ├── requirements.txt
        ├── test_vision.py
        └── README.md
```

## Installation

From `smart-civic-backend`:

```powershell
py -3.11 -m pip install -r ai/vision/requirements.txt
```

If your deployment already installs the project's main
`requirements.txt`, add these dependencies there instead.

## Usage

```python
from ai.vision.vision_service import verify_image

result = verify_image("path/to/uploaded/image.jpg")
print(result)
```

Example:

```json
{
  "verified": true,
  "detections": [
    {
      "class": "Pothole",
      "confidence": 0.9132,
      "bbox": [120.5, 230.2, 450.7, 510.4]
    }
  ]
}
```

## Parameters

```python
verify_image(
    image_path,
    confidence=0.25,
    image_size=768
)
```

- `image_path`: path to the uploaded image.
- `confidence`: minimum detection confidence.
- `image_size`: YOLO inference resolution.

## Backend integration

Recommended flow:

```text
Citizen uploads image
        |
        v
FastAPI receives image
        |
        v
Save temporary/uploaded image
        |
        v
verify_image(image_path)
        |
        v
AI verification result
        |
        +--> verified = true
        |       |
        |       +--> use class + confidence + bounding box
        |
        +--> verified = false
                |
                +--> no supported issue detected
```

The returned detection information can be used to validate or assist
the complaint category.

## Model loading

`vision_service.py` downloads the model from Hugging Face the first time
it is imported. The downloaded file is cached locally by
`huggingface_hub`.

The backend therefore does not need the `.pt` file in GitHub.

## Deployment note

The deployment environment needs internet access the first time the
model is downloaded. After download, Hugging Face's local cache can be
reused.

If the Hugging Face repository is made private in the future, configure
the appropriate Hugging Face authentication token in the deployment
environment.

## Test

Put a test image in the backend directory as `test.jpg`, then run:

```powershell
py -3.11 ai/vision/test_vision.py
```
