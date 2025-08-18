#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Create a temporary directory for deployment
echo "Preparing deployment..."
rm -rf deploy
mkdir deploy

# Copy built files to deployment directory
cp -r dist/* deploy/

# Create a simple index.html that works with GitHub Pages
cat > deploy/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CFB Imperialism</title>
    <link rel="icon" type="image/svg+xml" href="./vite.svg" />
</head>
<body>
    <div id="root"></div>
    <script type="module" src="./assets/index-B5MUniFx.js"></script>
</body>
</html>
EOF

echo "Deployment files prepared in ./deploy directory"
echo "You can now copy these files to your gh-pages branch or configure GitHub Pages to serve from this directory"
