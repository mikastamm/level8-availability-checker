schtasks /create /sc MINUTE /mo 5 /tn Level8AvailabilityChecker /tr "%cd%\nstl.vbs %cd%\check.bat"
pause