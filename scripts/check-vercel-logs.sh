#!/bin/bash

echo "🔍 Checking Vercel logs for webhook activity..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it:"
    echo "   npm i -g vercel"
    exit 1
fi

# Function to search logs
search_logs() {
    local search_term=$1
    local time_range=$2
    
    echo "📋 Searching for: $search_term (last $time_range)"
    echo "----------------------------------------"
    
    # Get logs from Vercel
    vercel logs --since=$time_range | grep -i "$search_term" | tail -20
    
    echo ""
}

# Search for webhook-related logs
search_logs "plugandpay/webhook" "1h"
search_logs "PlugAndPay webhook received" "1h"
search_logs "Processing successful payment" "1h"
search_logs "recent-purchase" "1h"
search_logs "Login token:" "1h"

echo ""
echo "💡 To see all recent logs, run:"
echo "   vercel logs --since=1h"
echo ""
echo "💡 To follow logs in real-time, run:"
echo "   vercel logs --follow"