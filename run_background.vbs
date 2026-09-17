' Runs Django server silently in background and opens default web browser
Set WshShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")
currentDir = FSO.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = currentDir

' Start Django server silently (window style 0 = hidden)
WshShell.Run """.venv\Scripts\python.exe"" manage.py runserver 127.0.0.1:8000", 0, False

' Give server 1.5 seconds to bind then open browser
WScript.Sleep 1500
WshShell.Run "http://127.0.0.1:8000/"
