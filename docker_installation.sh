#!/bin/bash
# install-docker.sh
# This script installs Docker on Ubuntu (complete setup)

set -e

echo "---- Updating system packages ----"
sudo apt-get update -y
sudo apt-get upgrade -y

echo "---- Installing prerequisite packages ----"
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common \
    gnupg \
    lsb-release

echo "---- Adding Docker's official GPG key ----"
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "---- Setting up the stable Docker repository ----"
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

echo "---- Updating package index again ----"
sudo apt-get update -y

echo "---- Installing Docker Engine, CLI, and Containerd ----"
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

echo "---- Enabling Docker service ----"
sudo systemctl enable docker
sudo systemctl start docker

echo "---- Adding current user to docker group ----"
sudo usermod -aG docker $USER

echo "---- Verifying Docker installation ----"
docker --version

echo "---- Docker installed successfully! ----"
echo "Please log out and back in for group changes to take effect."

