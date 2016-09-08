@echo off
echo.
echo Note: This also needs scotchbox to be running, as it proxies to the .dev domain
echo Also: It uses the ../../ folder's name for the assumed project.dev url
echo       I know it's a bit much, but feel free to change it if not useful to you.
echo.

cd ../..

REM Get current folder name
for %%* in (.) do set folderName=%%~nx*

browser-sync start --proxy "%folderName%.dev" --files "build/*.css" --reload-delay 0 --tunnel --open tunnel
