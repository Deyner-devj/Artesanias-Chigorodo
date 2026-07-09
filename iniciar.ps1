# iniciar.ps1

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   ARTESANIAS CHIGORODO - INICIAR APP    " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "1. Iniciar Frontend (Live Server)"
Write-Host "2. Iniciar Backend (Maven)"
Write-Host "3. Iniciar Ambos (Frontend + Backend)"
Write-Host "=========================================" -ForegroundColor Cyan

$choice = Read-Host "Elige una opcion (1, 2 o 3)"

if ($choice -eq "1" -or $choice -eq "3") {
    Write-Host "`nIniciando Servidor Frontend..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -Path 'proyecto-html'; npx -y live-server --port=5500"
    Write-Host "Frontend iniciado en http://127.0.0.1:5500" -ForegroundColor Cyan
}

if ($choice -eq "2" -or $choice -eq "3") {
    Write-Host "`nIniciando Spring Boot Backend..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -Path 'artesanias-chigorodo'; ./mvnw spring-boot:run"
    Write-Host "Backend iniciado en http://localhost:8080" -ForegroundColor Cyan
}

Write-Host "`nProceso completado." -ForegroundColor Green
