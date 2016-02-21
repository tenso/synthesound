rmdir /S SyntheSound-win32-x64\

call electron-packager . SyntheSound --platform=win32 --arch=x64 --version=0.36.5 --asar --version-string.CompanyName="Anton Olofsson" --version-string.ProductName="Synthe Sound" --version-string.LegalCopyright="GPL v3" --version-string.OriginalFilename="SyntheSound.exe" --version-string.FileDescription="SyntheSound.exe" --version-string.InernalName="Synthe Sound" --app-version=1.0.0 --icon=src\favicon.ico

