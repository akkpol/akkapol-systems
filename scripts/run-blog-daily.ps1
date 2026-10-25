param(
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$repo = 'D:\Projects\akkapol-systems'
$dsh = 'C:\Users\akkap\AppData\Local\Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd'
$logDir = Join-Path $repo 'logs\blog-daily'
$stamp = Get-Date -Format 'yyyy-MM-dd-HHmmss'
$logPath = Join-Path $logDir ($stamp + '.log')

# Local kill switch. Create logs/blog-daily/DISABLED to stop the scheduled runner.
if (Test-Path (Join-Path $logDir 'DISABLED')) { exit 0 }

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

function Invoke-Capture([string]$label, [scriptblock]$action) {
  Write-Log ('Starting ' + $label)
  $previous = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  & $action 2>&1 | ForEach-Object { Add-Content -LiteralPath $logPath -Value ([string]$_) }
  $exitCode = $LASTEXITCODE
  $ErrorActionPreference = $previous
  Write-Log ($label + ' exit code: ' + $exitCode)
  return $exitCode
}

try {
  Write-Log 'Starting DSH daily blog automation.'
  Write-Log ('Repo: ' + $repo)
  Write-Log ('DryRun: ' + $DryRun)

  if (-not $DryRun) {
    $branch = (git rev-parse --abbrev-ref HEAD).Trim()
    if ($branch -ne 'main') {
      Write-Log ('Switching from ' + $branch + ' to main.')
      $previousGitErrorAction = $ErrorActionPreference
      $ErrorActionPreference = 'Continue'
      git switch main 2>&1 | ForEach-Object { Write-Log ('GIT ' + $_) }
      $switchExit = $LASTEXITCODE
      $ErrorActionPreference = $previousGitErrorAction
      if ($switchExit -ne 0) { Write-Log 'Could not switch to main.'; exit 2 }
    }

    $dirty = @(git status --porcelain)
    if ($dirty.Count -gt 0) {
      Write-Log 'Working tree is not clean; refusing to run.'
      $dirty | ForEach-Object { Write-Log ('DIRTY ' + $_) }
      exit 2
    }

    Write-Log 'Fetching origin/main.'
    $previousGitErrorAction = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    git fetch origin 2>&1 | ForEach-Object { Write-Log ('GIT ' + $_) }
    $fetchExit = $LASTEXITCODE
    if ($fetchExit -ne 0) { $ErrorActionPreference = $previousGitErrorAction; Write-Log 'git fetch failed.'; exit 3 }
    git pull --ff-only origin main 2>&1 | ForEach-Object { Write-Log ('GIT ' + $_) }
    $pullExit = $LASTEXITCODE
    $ErrorActionPreference = $previousGitErrorAction
    if ($pullExit -ne 0) { Write-Log 'git pull failed.'; exit 4 }
  }

  if ($DryRun) {
    $prompt = 'Reply with exactly AUTOMATION_READY and do not use tools.'
  } else {
    $prompt = 'Read D:\Projects\akkapol-systems\automation\blog-daily.md and execute ONLY sections 1 through 4 for today: research, choose one story, write the post, and generate the cover. Do NOT run tests, lint, build, git, commit, push, or open a PR; the runner handles those after you stop. Stop immediately after the post and cover exist. If no story is worth publishing, say SKIP and stop. Work autonomously without asking questions.'
  }

  Write-Log 'Invoking DSH headless.'
  $previousErrorAction = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  & $dsh headless $prompt 2>&1 | ForEach-Object { Add-Content -LiteralPath $logPath -Value ([string]$_) }
  $code = $LASTEXITCODE
  $ErrorActionPreference = $previousErrorAction
  Write-Log ('DSH headless exit code: ' + $code)

  if ($DryRun) { exit $code }

  $status = @(git status --porcelain)
  $postLine = $status | Where-Object { $_ -match 'content/blog/[a-z0-9-]+\.md$' } | Select-Object -First 1
  if (-not $postLine) {
    Write-Log 'No new blog post was produced; stopping.'
    $status | ForEach-Object { Write-Log ('STATUS ' + $_) }
    exit 5
  }

  $relativePost = ($postLine -replace '^\s*\S+\s+', '').Trim()
  $slug = [System.IO.Path]::GetFileNameWithoutExtension($relativePost)
  Write-Log ('Detected post: ' + $slug)

  $checks = @(
    @('run', 'test:security'),
    @('run', 'lint'),
    @('run', 'build'),
    @('run', 'test:metadata')
  )
  foreach ($checkArgs in $checks) {
    $label = 'npm ' + ($checkArgs -join ' ')
    $checkExit = Invoke-Capture $label { & npm @checkArgs }
    if ($checkExit -ne 0) {
      Write-Log ('Check failed: ' + $label)
      exit 6
    }
  }

  $publishExit = Invoke-Capture 'blog publish' { & node scripts/blog-publish.mjs --slug $slug }
  if ($publishExit -ne 0) { exit 7 }
  Write-Log 'Daily blog automation completed.'
  exit 0
} catch {
  Write-Log ('ERROR: ' + $_.Exception.Message)
  exit 1
}
