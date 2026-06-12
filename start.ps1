$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = Join-Path $ProjectRoot "backend"
$EnvFile = Join-Path $ProjectRoot ".env"

if (-not (Test-Path $EnvFile)) {
    Write-Error ".env file not found at $EnvFile"
    exit 1
}

Write-Host "Starting Complaint System..." -ForegroundColor Green

Write-Host "Running database migrations..." -ForegroundColor Yellow
Set-Location -LiteralPath $BackendDir
python manage.py migrate
if ($LASTEXITCODE -ne 0) {
    Write-Error "Migrations failed!"
    exit 1
}

Write-Host "Collecting static files..." -ForegroundColor Yellow
python manage.py collectstatic --noinput
if ($LASTEXITCODE -ne 0) {
    Write-Error "Collectstatic failed!"
    exit 1
}

Write-Host "Starting Gunicorn server..." -ForegroundColor Green
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120
