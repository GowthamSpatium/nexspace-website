#!/bin/bash

# ==============================================================================
# Nexspace AWS Deployment Script (SSL + Cloudflare Optimized)
# Handles: Build, Configuration, Self-Signed SSL, and Redirects
# ==============================================================================

# Configuration
SERVER="ubuntu@ec2-13-233-10-53.ap-south-1.compute.amazonaws.com"
KEY="Ledgerly.pem"
PROJECT_NAME="nexspace"
DOMAIN="nexspace.app"
REMOTE_PATH="/var/www/$PROJECT_NAME"
EC2_HOSTNAME="ec2-13-233-10-53.ap-south-1.compute.amazonaws.com"
SERVER_IP="13.233.10.53"

echo "----------------------------------------------------"
echo "🚀 Starting AWS Deployment for $DOMAIN"
echo "----------------------------------------------------"

# 1. Build the project
echo "📦 Phase 1/4: Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Aborting."
    exit 1
fi

# 2. Configure Remote Server (Nginx + SSL + Redirects)
echo "🔧 Phase 2/4: Configuring the server and SSL..."
ssh -i "$KEY" -o StrictHostKeyChecking=no "$SERVER" "
    # Update and install Nginx
    sudo apt update
    sudo apt install -y nginx openssl

    # Fix: Increase server_names_hash_bucket_size
    sudo sed -i 's/# server_names_hash_bucket_size 64;/server_names_hash_bucket_size 128;/g' /etc/nginx/nginx.conf

    # Create web root
    sudo mkdir -p $REMOTE_PATH
    sudo chown -R \$USER:\$USER $REMOTE_PATH

    # Generate Self-Signed Cert (so port 443 can listen)
    sudo mkdir -p /etc/nginx/ssl
    if [ ! -f /etc/nginx/ssl/nginx.crt ]; then
        echo \"🔑 Generating self-signed SSL certificate...\"
        sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt \
            -subj \"/C=US/ST=State/L=City/O=Organization/CN=$DOMAIN\"
    fi

    # Create Nginx configuration
    cat <<EOF | sudo tee /etc/nginx/sites-available/$PROJECT_NAME > /dev/null
# 1. HTTPS Server Block (Main App)
server {
    listen 80;
    listen 443 ssl http2;
    server_name $DOMAIN;

    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;

    # Redirect HTTP to HTTPS for the domain
    if (\\\$scheme = \"http\") {
        return 301 https://\\\$host\\\$request_uri;
    }

    root $REMOTE_PATH;
    index index.html;

    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;

    location ~* \.(?:css|js|ico|woff2?|eot|ttf|otf|svg|png|jpg|jpeg|gif)$ {
        expires 1y;
        add_header Cache-Control \"public, max-age=31536000\";
    }

    location / {
        try_files \\\$uri \\\$uri/ /index.html;
    }
}

# 2. Redirect Block (IP and EC2 Hostname to Domain)
server {
    listen 80;
    listen 443 ssl http2;
    server_name $SERVER_IP $EC2_HOSTNAME;

    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;

    return 301 https://$DOMAIN\\\$request_uri;
}
EOF

    # Enable site and remove default
    sudo ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default

    # Reload Nginx
    sudo nginx -t && sudo systemctl reload nginx
"

if [ $? -ne 0 ]; then
    echo "❌ Server configuration failed! Aborting."
    exit 1
fi

# 3. Transfer the build files
echo "📤 Phase 3/4: Uploading build files..."
tar --exclude='._*' -czf dist.tar.gz -C dist .
scp -i "$KEY" dist.tar.gz "$SERVER":/home/ubuntu/
ssh -i "$KEY" "$SERVER" "sudo rm -rf $REMOTE_PATH/* && sudo tar -xzf /home/ubuntu/dist.tar.gz -C $REMOTE_PATH/ && sudo chown -R ubuntu:ubuntu $REMOTE_PATH && rm /home/ubuntu/dist.tar.gz"

# 4. Cleanup
echo "🧹 Phase 4/4: Cleaning up local files..."
rm dist.tar.gz

echo "----------------------------------------------------"
echo "✨ Deployment Success!"
echo "🔗 Site is live at: https://$DOMAIN"
echo "🚨 REMINDER: Ensure Port 443 is OPEN in AWS Security Groups!"
echo "----------------------------------------------------"
