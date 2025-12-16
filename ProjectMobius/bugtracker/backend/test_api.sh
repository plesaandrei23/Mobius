#!/bin/bash

BASE_URL="http://localhost:8080/api"

echo "1. Registering User 1 (Admin/MP)..."
curl -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "password123"}'
echo -e "\n"

echo "2. Logging in User 1..."
TOKEN1=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token 1: $TOKEN1"
echo -e "\n"

echo "3. Creating a Project (as User 1)..."
PROJECT_ID=$(curl -s -X POST $BASE_URL/projects \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Project", "repoUrl": "http://github.com/test", "description": "A test project"}' | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
echo "Project ID: $PROJECT_ID"
echo -e "\n"

echo "4. Registering User 2 (Tester)..."
curl -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "tester@test.com", "password": "password123"}'
echo -e "\n"

echo "5. Logging in User 2..."
TOKEN2=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "tester@test.com", "password": "password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token 2: $TOKEN2"
echo -e "\n"

echo "6. Adding User 2 as Tester (Self-Add)..."
curl -X POST $BASE_URL/projects/$PROJECT_ID/testers \
  -H "Authorization: Bearer $TOKEN2" \
  -H "Content-Type: application/json" \
  -d '{}'
echo -e "\n"

echo "7. Reporting a Bug (as User 2)..."
BUG_ID=$(curl -s -X POST $BASE_URL/projects/$PROJECT_ID/bugs \
  -H "Authorization: Bearer $TOKEN2" \
  -H "Content-Type: application/json" \
  -d '{"title": "Login fails", "description": "Cannot login", "severity": "HIGH", "priority": "HIGH"}' | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
echo "Bug ID: $BUG_ID"
echo -e "\n"

echo "8. Listing Bugs (as User 1)..."
curl -X GET $BASE_URL/projects/$PROJECT_ID/bugs \
  -H "Authorization: Bearer $TOKEN1"
echo -e "\n"

echo "9. Updating Bug (Assign to Self as User 1)..."
curl -X PATCH $BASE_URL/projects/$PROJECT_ID/bugs/$BUG_ID \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json" \
  -d '{"allocate": true, "status": "IN_PROGRESS"}'
echo -e "\n"

echo "Done!"
