#!/bin/bash

# ==============================================================================
# Nexspace AWS UPDATE Script (Full Stack: Frontend + Node Backend)
# Handles: Build, Sync, PM2 Backend, and Nginx API Proxy
# ==============================================================================

# Configuration
SERVER="ubuntu@ec2-3-111-219-122.ap-south-1.compute.amazonaws.com"
KEY="Ledgerly.pem"
PROJECT_NAME="nexspace"
DOMAIN="nexspace.app"
REMOTE_PATH="/var/www/$PROJECT_NAME"
EC2_HOSTNAME="ec2-3-111-219-122.ap-south-1.compute.amazonaws.com"
SERVER_IP="3.111.219.122"
RESEND_API_KEY="${RESEND_API_KEY}"

echo "----------------------------------------------------"
echo "🚀 Starting Full-Stack AWS Update for $DOMAIN"
echo "----------------------------------------------------"

# 1. Build the project locally
echo "📦 Phase 1/5: Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Aborting."
    exit 1
fi

# 2. Sync all source files to AWS
echo "📤 Phase 2/5: Syncing all files to AWS (including backend)..."
rsync -avz --delete \
    -e "ssh -i $KEY -o StrictHostKeyChecking=no" \
    --exclude "node_modules" \
    --exclude ".git" \
    --exclude "dist" \
    ./ "$SERVER:$REMOTE_PATH/"

# 3. Transfer the build folder separately
echo "🏗️ Phase 3/5: Uploading build artifacts..."
tar --exclude='._*' -czf dist.tar.gz -C dist .
scp -i "$KEY" dist.tar.gz "$SERVER":/home/ubuntu/
ssh -i "$KEY" "$SERVER" "sudo mkdir -p $REMOTE_PATH/dist && sudo rm -rf $REMOTE_PATH/dist/* && sudo tar -xzf /home/ubuntu/dist.tar.gz -C $REMOTE_PATH/dist/ && rm /home/ubuntu/dist.tar.gz"
rm dist.tar.gz

# 4. Configure Remote Server (Nginx Proxy + PM2)
echo "🔧 Phase 4/5: Configuring Nginx API Proxy & Node Environment..."
ssh -i "$KEY" "$SERVER" "
    # Update and install essentials
    sudo apt update
    sudo apt install -y nginx curl
    
    # 🧹 Deep Clean: Remove old conflicting Node packages
    sudo apt remove -y nodejs libnode-dev npm || true
    sudo apt autoremove -y
    
    # Upgrade to Node.js v20
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    
    sudo npm install -g pm2

    # Create .env on server
    echo 'RESEND_API_KEY=$RESEND_KEY' > $REMOTE_PATH/.env
    echo 'PORT=3001' >> $REMOTE_PATH/.env
    echo 'NODE_ENV=production' >> $REMOTE_PATH/.env

    # Fix: Increase server_names_hash_bucket_size
    sudo sed -i 's/# server_names_hash_bucket_size 64;/server_names_hash_bucket_size 128;/g' /etc/nginx/nginx.conf

    # Create Nginx configuration with API Reverse Proxy
    cat <<EOF | sudo tee /etc/nginx/sites-available/$PROJECT_NAME > /dev/null
server {
    listen 80;
    listen 443 ssl http2;
    server_name $DOMAIN;

    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;

    # Redirect HTTP to HTTPS
    if (\\\$scheme = \"http\") {
        return 301 https://\\\$host\\\$request_uri;
    }

    root $REMOTE_PATH/dist;
    index index.html;

    # Handle React routing
    location / {
        try_files \\\$uri \\\$uri/ /index.html;
    }

    # 🔥 REVERSE PROXY FOR API (The missing piece!)
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\\$host;
        proxy_cache_bypass \\\$http_upgrade;
    }
}

# Redirect IP and Hostname to Domain
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

# 5. Start/Restart Backend Processor on AWS
echo "⚙️ Phase 5/5: Starting Node.js Backend Processor..."
ssh -i "$KEY" "$SERVER" "
    cd $REMOTE_PATH
    npm install --omit=dev
    pm2 delete nexspace || true
    pm2 start server.js --name nexspace --log-date-format 'YYYY-MM-DD HH:mm:ss'
    pm2 save
"

echo "----------------------------------------------------"
echo "✨ Full Stack Deployment Success!"
echo "🔗 Site is now live and FULLY FUNCTIONAL at: https://$DOMAIN"
echo "----------------------------------------------------"
