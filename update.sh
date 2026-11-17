#!/usr/bin/expect -f

# 🚀 Nexspace Website Fast Update Script (Client-Side)
# Updated with automatic password entry and Backend support

set timeout -1

# Configuration
set server "zigbee@172.168.10.251"
set pass "spatium123@abc"
set target_dir "/home/zigbee/Nexspace-Website"

puts "----------------------------------------------------"
puts "🚀 Pushing Nexspace Updates to $server"
puts "----------------------------------------------------"

# 1. Sync Files
puts "📦 Phase 1/2: Syncing latest files to remote server..."
spawn rsync -avz --delete \
    --exclude "node_modules" \
    --exclude ".git" \
    --exclude "dist" \
    --exclude ".cloudflared" \
    ./ "$server:$target_dir/"

expect {
    "password:" {
        send "$pass\n"
        exp_continue
    }
    eof
}
puts "✅ File sync complete!"

# 2. Execute Fast Update Server-Side
puts "\n🐳 Phase 2/2: Rebuilding & Restarting Frontend Container..."

# Write the remote execution script to a temporary file locally
set fd [open "update_tmp.sh" w]
puts $fd "#!/bin/bash"
puts $fd "set -e"
puts $fd "PASS=\"$pass\""
puts $fd "TARGET_DIR=\"$target_dir\""
puts $fd "cd \"\$TARGET_DIR\" || exit 1"
puts $fd "echo \"----------------------------------------------------\""
puts $fd "echo \"🔧 Remote Server Update Started\""
puts $fd "echo \"----------------------------------------------------\""
puts $fd "export TMPDIR=\"\$TARGET_DIR\""
puts $fd "export BUILDX_NO_DEFAULT_ATTESTATIONS=1"
puts $fd "export BUILDX_NO_DEFAULT_PROVENANCE=1"
puts $fd "export DOCKER_BUILDKIT=1"
puts $fd "echo \"📦 Rebuilding Frontend Image...\""
puts $fd "echo \"\$PASS\" | sudo -S -E docker build -t nexspace-frontend . --provenance=false"
puts $fd "echo \"🔄 Restarting Container...\""
puts $fd "echo \"\$PASS\" | sudo -S -E docker compose stop nexspace-frontend || true"
puts $fd "echo \"\$PASS\" | sudo -S -E docker compose rm -f nexspace-frontend || true"
puts $fd "echo \"\$PASS\" | sudo -S -E docker compose up -d nexspace-frontend"
puts $fd "echo \"🧹 Cleaning up old Docker images...\""
puts $fd "echo \"\$PASS\" | sudo -S docker image prune -f"
puts $fd "echo \"✨ Update Success! Changes are now live.\""
close $fd

# Sync the script
spawn rsync -avz ./update_tmp.sh "$server:$target_dir/"
expect {
    "password:" {
        send "$pass\n"
        exp_continue
    }
    eof
}

# Execute the script
spawn ssh -o StrictHostKeyChecking=no "$server" "bash $target_dir/update_tmp.sh"
expect {
    "password:" {
        send "$pass\n"
        exp_continue
    }
    eof
}

# Cleanup local temp file
exec rm update_tmp.sh

puts "----------------------------------------------------"
puts "✅ Update Complete."
puts "----------------------------------------------------"
