#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Background Removal API Testing Tools ===${NC}\n"
echo -e "${GREEN}Choose a test to run:${NC}"
echo -e "  ${YELLOW}1${NC}) Run API tests on Express server"
echo -e "  ${YELLOW}2${NC}) Test background removal feature"
echo -e "  ${YELLOW}3${NC}) Run Vercel serverless functions locally"
echo -e "  ${YELLOW}q${NC}) Quit"
echo ""

read -p "Enter your choice: " choice

case $choice in
  1)
    echo -e "\n${GREEN}Running API tests...${NC}\n"
    chmod +x test-api.sh
    ./test-api.sh
    ;;
  2)
    echo -e "\n${GREEN}Testing background removal feature...${NC}\n"
    node test-background-removal.js
    ;;
  3)
    echo -e "\n${GREEN}Starting Vercel dev server...${NC}\n"
    echo -e "${YELLOW}This will prompt you to log in to Vercel if you haven't already.${NC}\n"
    echo -e "After the server starts, you can test the API with these example commands:"
    echo -e "  ${BLUE}curl -X POST http://localhost:3000/api/register -H \"Content-Type: application/json\" -d '{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}'${NC}"
    echo -e "  ${BLUE}curl -X POST http://localhost:3000/api/login -H \"Content-Type: application/json\" -d '{\"username\":\"testuser\",\"password\":\"password123\"}' -c cookies.txt${NC}"
    echo -e "  ${BLUE}curl http://localhost:3000/api/user -b cookies.txt${NC}"
    echo -e "\nPress Ctrl+C to stop the server when done.\n"
    npx vercel dev --listen 3000
    ;;
  q)
    echo -e "\n${GREEN}Exiting...${NC}"
    exit 0
    ;;
  *)
    echo -e "\n${RED}Invalid choice. Exiting.${NC}"
    exit 1
    ;;
esac