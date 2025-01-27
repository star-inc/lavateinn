#!/bin/bash
# Lavateinn - Tiny and flexible microservice framework.
# SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

# Shell options
set -e

# Grant sudo permission
SUDO=""
if [ "$EUID" != 0 ]; then
    SUDO="sudo"
fi

# Update package list
$SUDO apt-get update

# Install required servers
$SUDO apt-get install -y redis-server rabbitmq-server

# Start required servers
$SUDO service redis-server start
$SUDO service rabbitmq-server start

# Install nodejs packages
npm install

# Echo success message
echo "Setup completed successfully!"
