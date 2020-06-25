@ECHO OFF
ECHO 功能列表
ECHO 1、压缩最新版本代码
ECHO 2、BASE64 资源文件到 Javascript 代码
ECHO.
:SELECT
SET /p OPT=
IF %OPT% == 1 GOTO NO1
IF %OPT% == 2 GOTO NO2
IF %OPT% == 3 GOTO NO3
GOTO SELECT

:NO1
"%ProgramFiles%\php-5.6.30-nts-Win32-VC11-x86\php.exe" "merge.php"
PAUSE
EXIT

:NO2
"%ProgramFiles%\php-5.6.30-nts-Win32-VC11-x86\php.exe" "merge.resources.php"
PAUSE
EXIT