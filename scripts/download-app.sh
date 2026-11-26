#!/usr/bin/env bash
# Downloads the Sauce Labs "My Demo App" Android APK (system under test) into ./apps/mda.apk.
# Pin the version so test results are reproducible.
set -euo pipefail
VERSION="${MDA_VERSION:-2.3.0}"
mkdir -p apps
gh release download "$VERSION" --repo saucelabs/my-demo-app-android --pattern '*.apk' --dir apps --clobber
mv "$(ls apps/*.apk | head -n 1)" apps/mda.apk
echo "Downloaded My Demo App $VERSION → apps/mda.apk"
