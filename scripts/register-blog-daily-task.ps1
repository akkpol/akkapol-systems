$ErrorActionPreference = 'Stop'
$repo = 'D:\Projects\akkapol-systems'
$runner = Join-Path $repo 'scripts\run-blog-daily.ps1'
$taskName = 'DSH Blog Daily'
$shell = (Get-Command powershell.exe).Source
$user = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name

if (-not (Test-Path $runner)) { throw ('Runner not found: ' + $runner) }

$action = New-ScheduledTaskAction -Execute $shell -Argument ('-NoProfile -ExecutionPolicy Bypass -File "' + $runner + '"') -WorkingDirectory $repo
$trigger = New-ScheduledTaskTrigger -Daily -At '08:30'
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Hours 1) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
$principal = New-ScheduledTaskPrincipal -UserId $user -LogonType Interactive -RunLevel Limited

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description 'Run the DSH headless daily AI/dev blog draft automation.' -Force | Out-Null
Write-Output ('REGISTERED ' + $taskName + ' for ' + $user + ' daily at 08:30')
Get-ScheduledTask -TaskName $taskName | Select-Object TaskName,State | Format-Table -AutoSize | Out-String -Width 120
