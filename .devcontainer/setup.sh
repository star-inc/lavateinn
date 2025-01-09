#!/bin/bash
# Lavateinn Devcontainer Setup Script
# SPDX-License-Identifier: MIT
# (c) 2024 Star Inc.

# Shell options
set -e

# Grant sudo permission
SUDO=""
if [ "$EUID" != 0 ]; then
    SUDO="sudo"
fi

# Update package list
$SUDO apt-get update

# Install redis-server
$SUDO apt-get install -y redis-server

# Start redis-server
$SUDO service redis-server start

# Install nodejs packages
npm install

# Echo success message
echo "Setup completed successfully!"
