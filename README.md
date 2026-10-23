# ROM Corrupter (NES + SNES)

Builds a Windows .exe, Linux .deb, Android .apk and iOS .ipa from one web codebase (www/index.html).

1. Create a new GitHub repo and push this folder to it.
2. Open the Actions tab, run "Build all" (it also runs on every push). Takes about 10 minutes.
3. Download the artifacts from the finished run:
   - desktop-Windows: installer .exe + portable .exe
   - desktop-Linux: .deb + .AppImage
   - android-apk: app-debug.apk (enable "install unknown apps")
   - ios-ipa-unsigned: ROMCorrupter-unsigned.ipa (must be signed, see below)

iOS: Apple only runs signed apps. Install the .ipa with Sideloadly or AltStore using your Apple ID
(free accounts re-sign every 7 days), or TrollStore if your device supports it.
App Store distribution needs a paid Apple developer account and a signed archive.

Local dev: npm install && npm start
