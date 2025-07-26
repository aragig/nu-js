#!/bin/bash

echo "Access for LAN at http://macbook.local:5200"

live-server . --port=5200 --host=0.0.0.0 --no-browser --ignore=".git,.idea,run.sh"


