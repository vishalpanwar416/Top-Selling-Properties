#!/bin/bash
# Helper script to build Android app with correct Java version

export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64

# Stop any existing Gradle daemons using wrong Java version
cd android && ./gradlew --stop && cd ..

# Build the app
npx expo run:android "$@"

