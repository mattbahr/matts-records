#!/bin/bash

jq -n --arg host "$EXPRESS_HOST" --arg port "$EXPRESS_PORT" '{"EXPRESS_HOST": "$host", "EXPRESS_PORT": "$port"}' > ./client/env.json