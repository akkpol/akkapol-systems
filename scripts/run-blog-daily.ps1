param(
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$repo = 'D:\Projects\akkapol-systems'
$dsh = 'C:\Users\akkap\AppData\Local\Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd'
$logDir = Join-Path $repo 'logs\blog-daily'
$stamp = Get-Date -Format 'yyyy-MM-dd-HHmmss'
$logPath = Join-Path $logDir ($stamp + '.log')

New-Item -ItemType Directory -Path $logDir -Force | Out-Null
Set-Location $repo

$env:Path = 'C:\Users\akkap\.local\node;C:\Users\akkap\.local\git\cmd;C:\Users\akkap\.local\git\ucrt64\bin;C:\Users\akkap\.local\npm-global;C:\Users\akkap\.local\bin;' + $env:Path
$env:DSH_PERMISSION_MODE = 'danger-full-access'
$env:GCM_INTERACTIVE = 'never'
$env:GIT_TERMINAL_PROMPT = '0'

function Write-Log([string]$message) {
  $line = '[' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + '] ' + $message
  Add-Content -LiteralPath $logPath -Value $line
}

try {
  Write-Log 'Starting DSH daily blog automation.'
  Write-Log ('Repo: ' + $repo)
  Write-Log ('DryRun: ' + $DryRun)

  if (-not $DryRun) {
    $dirty = @(git status --porcelain)
    if ($dirty.Count -gt 0) {
      Write-Log 'Working tree is not clean; refusing to run.'
      $dirty | ForEach-Object { Write-Log ('DIRTY ' + $_) }
      exit 2
    }
    Write-Log 'Fetching origin/main.'
    git fetch origin 2>&1 | ForEach-Object { Write-Log ('GIT ' + $_) }
    if ($LASTEXITCODE -ne 0) { Write-Log 'git fetch failed.'; exit 3 }
    git pull --ff-only origin main 2>&1 | ForEach-Object { Write-Log ('GIT ' + $_) }
    if ($LASTEXITCODE -ne 0) { Write-Log 'git pull failed.'; exit 4 }
  }

  if ($DryRun) {
    $prompt = 'Reply with exactly AUTOMATION_READY and do not use tools.'
  } else {
    $prompt = 'Read D:\Projects\akkapol-systems\automation\blog-daily.md and execute it fully for today. Use fresh web research to pick one interesting AI/dev/automation story, write one original English post with a locally generated branded cover, run the required checks, and open a review PR against main. Do not merge the PR. If no story is worth publishing or checks fail, stop and report the reason. Work autonomously without asking questions.'
  }

  Write-Log 'Invoking DSH headless.'
  $previousErrorAction = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  & $dsh headless $prompt 2>&1 | ForEach-Object { Add-Content -LiteralPath $logPath -Value ([string]$_) }
  $code = $LASTEXITCODE
  $ErrorActionPreference = $previousErrorAction
  Write-Log ('DSH headless exit code: ' + $code)
  exit $code
} catch {
  Write-Log ('ERROR: ' + $_.Exception.Message)
  exit 1
}
