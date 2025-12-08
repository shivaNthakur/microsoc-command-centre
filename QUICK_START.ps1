#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Quick Start Guide for Attack Analytics Dashboard

.DESCRIPTION
    This script helps test the real-time attack analytics implementation
#>

Write-Host "🚀 Attack Analytics Dashboard - Quick Start Guide" -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
Write-Host "1️⃣  Starting Backend Server..." -ForegroundColor Yellow
Write-Host "Run in a terminal:"
Write-Host "  cd MICROSOC-COMMAND-CENTRE" -ForegroundColor Green
Write-Host "  uvicorn main:app --reload" -ForegroundColor Green
Write-Host ""

# Check if frontend is running
Write-Host "2️⃣  Starting Frontend Dev Server..." -ForegroundColor Yellow
Write-Host "Run in another terminal:"
Write-Host "  npm run dev" -ForegroundColor Green
Write-Host ""

# Test endpoints
Write-Host "3️⃣  Testing Endpoints..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Get all attack types:" -ForegroundColor Cyan
Write-Host "  curl http://127.0.0.1:8000/attack-types" -ForegroundColor Green
Write-Host ""

Write-Host "Get specific attack details:" -ForegroundColor Cyan
Write-Host "  curl 'http://127.0.0.1:8000/attack-details?type=SQL%20Injection'" -ForegroundColor Green
Write-Host ""

Write-Host "Send test broadcast:" -ForegroundColor Cyan
Write-Host "  curl http://127.0.0.1:8000/test-broadcast" -ForegroundColor Green
Write-Host ""

# WebSocket testing
Write-Host "4️⃣  Testing WebSocket Connections..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Install wscat (if not already installed):" -ForegroundColor Cyan
Write-Host "  npm install -g wscat" -ForegroundColor Green
Write-Host ""

Write-Host "Connect to attack stats WebSocket:" -ForegroundColor Cyan
Write-Host "  wscat -c ws://127.0.0.1:8000/ws/attack-stats" -ForegroundColor Green
Write-Host ""

Write-Host "Connect to attack details WebSocket:" -ForegroundColor Cyan
Write-Host "  wscat -c ws://127.0.0.1:8000/ws/attack-details?type=SQL%20Injection" -ForegroundColor Green
Write-Host ""

# Access frontend
Write-Host "5️⃣  Access the Dashboard..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Open in browser:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000/analyst/dashboard" -ForegroundColor Green
Write-Host ""
Write-Host "You should see:" -ForegroundColor Cyan
Write-Host "  ✓ Attack type cards with live counts" -ForegroundColor White
Write-Host "  ✓ Bar chart of attacks by type" -ForegroundColor White
Write-Host "  ✓ Pie chart of severity distribution" -ForegroundColor White
Write-Host "  ✓ Clickable attack type cards" -ForegroundColor White
Write-Host ""

# Navigate to details
Write-Host "6️⃣  View Attack Details..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Click on any attack type card to navigate to:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000/analyst/attacks/details?type=<ATTACK_TYPE>" -ForegroundColor Green
Write-Host ""
Write-Host "You should see:" -ForegroundColor Cyan
Write-Host "  ✓ Time series chart of attacks" -ForegroundColor White
Write-Host "  ✓ Severity distribution pie chart" -ForegroundColor White
Write-Host "  ✓ Statistics cards" -ForegroundColor White
Write-Host "  ✓ Real-time incident table" -ForegroundColor White
Write-Host ""

# Send test data
Write-Host "7️⃣  Send Test Attack Data..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Example: Send a test SQL Injection attack" -ForegroundColor Cyan
Write-Host ""
Write-Host "Using Python:" -ForegroundColor Cyan
@"
curl -X POST http://127.0.0.1:8000/logs/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "'$(Get-Date -AsUTC -Format 'yyyy-MM-ddTHH:mm:ssZ')'",
    "source_ip": "192.168.1.100",
    "attack_type": "SQL Injection",
    "severity": "high",
    "payload": "SELECT * FROM users"
  }'
"@ | Write-Host -ForegroundColor Green

Write-Host ""
Write-Host "8️⃣  Redis Integration (Optional)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Install Redis for production caching:" -ForegroundColor Cyan
Write-Host "  pip install redis" -ForegroundColor Green
Write-Host ""
Write-Host "Start Redis server:" -ForegroundColor Cyan
Write-Host "  redis-server" -ForegroundColor Green
Write-Host ""
Write-Host "Backend will auto-detect and use Redis if available" -ForegroundColor White
Write-Host ""

Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "For detailed documentation, see: ATTACK_ANALYTICS_README.md" -ForegroundColor Cyan
