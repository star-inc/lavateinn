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

# Prepare prerequisite
echo 'node ALL=(rabbitmq) NOPASSWD:ALL' | \
    $SUDO tee /etc/sudoers.d/node-rabbitmq

$SUDO mkdir -p /var/run/rabbitmq
$SUDO chown rabbitmq:rabbitmq /var/run/rabbitmq

# Start required servers
$SUDO -u root \
    service redis-server start
$SUDO -u rabbitmq \
    service rabbitmq-server start

# Install nodejs packages
npm install

# Echo success message
echo "Setup completed successfully!"
