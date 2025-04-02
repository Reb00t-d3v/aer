#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:5000"

# Store cookies for session
COOKIE_JAR="cookies.txt"

# Clean up old cookie file
rm -f $COOKIE_JAR

# Function to print colored section headers
print_header() {
  echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

# Function to make API requests
call_api() {
  local method=$1
  local endpoint=$2
  local data=$3
  local content_type="application/json"
  
  echo -e "${YELLOW}> $method $endpoint${NC}"
  
  if [ -n "$data" ]; then
    echo -e "${YELLOW}> Request Body: $data${NC}"
    
    # Call API with data
    response=$(curl -s -X $method \
      -H "Content-Type: $content_type" \
      -d "$data" \
      -c $COOKIE_JAR -b $COOKIE_JAR \
      $BASE_URL$endpoint)
  else
    # Call API without data
    response=$(curl -s -X $method \
      -c $COOKIE_JAR -b $COOKIE_JAR \
      $BASE_URL$endpoint)
  fi
  
  # Display response
  echo -e "${GREEN}> Response:${NC}"
  if [ -z "$response" ]; then
    echo -e "${RED}(Empty response)${NC}"
  else
    echo $response | jq . 2>/dev/null || echo $response
  fi
  
  echo ""
}

# Main test sequence
main() {
  print_header "Testing Background Removal API"
  
  # Test server status
  print_header "1. Server Status"
  call_api "GET" "/"
  
  # Test registration
  print_header "2. User Registration"
  call_api "POST" "/api/register" '{"username":"testuser","email":"test@example.com","password":"password123"}'
  
  # Test login
  print_header "3. User Login"
  call_api "POST" "/api/login" '{"username":"testuser","password":"password123"}'
  
  # Test getting user data
  print_header "4. Get User Data"
  call_api "GET" "/api/user"
  
  # Test getting user images
  print_header "5. Get User Images"
  call_api "GET" "/api/images"
  
  # Test logout
  print_header "6. User Logout"
  call_api "POST" "/api/logout"
  
  # Test accessing protected resource after logout
  print_header "7. Access Protected Resource After Logout"
  call_api "GET" "/api/user"
  
  print_header "API Testing Complete"
}

# Execute tests
main