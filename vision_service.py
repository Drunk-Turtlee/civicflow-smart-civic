"""
CivicFlow Vision Verification Service

The YOLO model is downloaded automatically from Hugging Face on first use.
The model is not stored in the GitHub repository.

Supported classes:
- Pothole
- Road Damage
- Garbage
"""

from pathlib import Path
from typing import Any

from huggingface_hub import hf_hub_download
from ultralytics import YOLO


MODEL_REPO = "Vansh180/PotholeNet-V1"
MODEL_FILENAME = "Vision%20Classification.pt"
MODEL_DIR = Path(__file__).parent / "model"


def _load_model() -> YOLO:
    """Download the model if needed, then load it once."""
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    model_path = hf_hub_download(
        repo_id=MODEL_REPO,
        filename=MODEL_FILENAME,
        local_dir=str(MODEL_DIR),
    )

    return YOLO(model_path)


model = _load_model()


def verify_image(
    image_path: str | Path,
    confidence: float = 0.25,
    image_size: int = 768,
) -> dict[str, Any]:
    """
    Verify a civic-issue image.

    Returns:
        {
            "verified": bool,
            "detections": [
                {
                    "class": "Pothole",
                    "confidence": 0.91,
                    "bbox": [x1, y1, x2, y2]
                }
            ]
        }
    """
    if not 0.0 <= confidence <= 1.0:
        raise ValueError("confidence must be between 0.0 and 1.0")

    image_path = Path(image_path)

    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    results = model(
        str(image_path),
        imgsz=image_size,
        conf=confidence,
        verbose=False,
    )

    result = results[0]
    detections = []

    if result.boxes is not None:
        for box in result.boxes:
            class_id = int(box.cls[0])
            score = float(box.conf[0])
            x1, y1, x2, y2 = box.xyxy[0].tolist()

            detections.append(
                {
                    "class": result.names[class_id],
                    "confidence": round(score, 4),
                    "bbox": [
                        round(x1, 2),
                        round(y1, 2),
                        round(x2, 2),
                        round(y2, 2),
                    ],
                }
            )

    return {
        "verified": len(detections) > 0,
        "detections": detections,
    }
