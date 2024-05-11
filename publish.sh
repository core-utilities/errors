pnpm run build
if [ $? -eq 0 ]; then
    pushd dist
    npm publish
    popd
fi
