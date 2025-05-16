#!/bin/bash

mkdir ./server/secrets
echo "$BACKBLAZE_APP_KEY" > ./server/secrets/backblaze_app_key
echo "$BACKBLAZE_KEY_ID" > ./server/secrets/backblaze_key_id
echo "$MONGODB_BASIC_USERNAME" > ./server/secrets/mongodb_basic_username
echo "$MONGODB_BASIC_PASSWORD" > ./server/secrets/mongodb_basic_password