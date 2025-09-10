#!/bin/sh

# Start the backend API server in the background
cd /app
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &

# Start nginx in the foreground
nginx -g 'daemon off;'