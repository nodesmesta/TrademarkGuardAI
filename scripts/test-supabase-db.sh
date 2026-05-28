#!/bin/bash

# Supabase Configuration
SUPABASE_URL="https://vvwdttdczrpwiddddiek.supabase.co"
SUPABASE_ANON_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | sed 's/NEXT_PUBLIC_SUPABASE_ANON_KEY=//')
SUPABASE_SERVICE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | sed 's/SUPABASE_SERVICE_ROLE_KEY=//')

echo "=== Supabase auth_pins Table Test ==="
echo ""

# 1. Check if table exists
echo "1. Check table exists:"
curl -s -H "apikey: $SUPABASE_ANON_KEY" \
  "$SUPABASE_URL/rest/v1/auth_pins?select=*&limit=1" | jq '.'
echo ""

# 2. Insert a new PIN
echo "2. Insert new PIN:"
curl -s -X POST \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "pin": "123456",
    "expires_at": "2026-05-28T12:00:00Z",
    "used": false,
    "attempts": 0,
    "max_attempts": 3
  }' "$SUPABASE_URL/rest/v1/auth_pins"
echo ""

# 3. Query the PIN
echo "3. Query PIN:"
curl -s -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  "$SUPABASE_URL/rest/v1/auth_pins?select=*&email=eq.test@example.com" | jq '.'
echo ""

# 4. Update PIN (mark as used)
echo "4. Update PIN (mark used):"
curl -s -X PATCH \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"used":true,"used_at":"2026-05-28T11:08:00Z"}' \
  "$SUPABASE_URL/rest/v1/auth_pins?email=eq.test@example.com"
echo ""

# 5. Delete test data
echo "5. Delete test data:"
curl -s -X DELETE \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  "$SUPABASE_URL/rest/v1/auth_pins?email=eq.test@example.com"
echo ""

echo "=== Test Complete ==="
