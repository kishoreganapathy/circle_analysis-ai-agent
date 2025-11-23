# Fixing TensorFlow Protobuf Compatibility Issue

If you're getting this error:
```
TypeError: Descriptors cannot be created directly.
```

This is a compatibility issue between TensorFlow 2.15 and newer protobuf versions.

## Quick Fix

Run this command to downgrade protobuf:

```bash
pip install protobuf==3.20.3
```

## Alternative: Run Without TensorFlow

The app will work without TensorFlow - you just won't have image classification. OCR and code detection will still work.

To disable TensorFlow, the app will automatically detect the error and continue without it.

## Why This Happens

TensorFlow 2.15 was built with protobuf 3.20.x, but newer protobuf versions (4.x) have breaking changes. Downgrading protobuf fixes the issue.

