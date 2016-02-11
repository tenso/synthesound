@echo off
set /a done=0
set /a errors=0
cd /d src
for /R %%f in (*.js) do call :checkfile "%%f"
goto :printstats

:checkfile
set /a done+=1
call jslint "%*"
if errorlevel 1 goto :fileerror
goto :eof

:fileerror
set /a errors+=1
pause
goto :eof

:printstats
echo "done %done%, errors %errors%"
pause

:eof
