for /R %%f in (*.js) do call jslint "%%f" || pause
pause