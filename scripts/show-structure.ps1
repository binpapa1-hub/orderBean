# OrderBean 프로젝트 구조 출력 스크립트
# PowerShell에서 실행: .\scripts\show-structure.ps1

Write-Host "OrderBean 프로젝트 구조" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan

function Show-Tree {
    param(
        [string]$Path,
        [string]$Prefix = "",
        [bool]$IsLast = $true
    )
    
    $items = Get-ChildItem -Path $Path -Directory -ErrorAction SilentlyContinue | 
             Sort-Object Name
    
    $files = Get-ChildItem -Path $Path -File -ErrorAction SilentlyContinue | 
             Where-Object { $_.Name -notlike ".*" -and $_.Name -ne "node_modules" } | 
             Sort-Object Name
    
    $allItems = @($items) + @($files)
    $count = $allItems.Count
    
    for ($i = 0; $i -lt $count; $i++) {
        $item = $allItems[$i]
        $isLastItem = ($i -eq $count - 1)
        
        if ($item.PSIsContainer) {
            $symbol = if ($isLastItem) { "└── " } else { "├── " }
            Write-Host "$Prefix$symbol$($item.Name)/" -ForegroundColor Yellow
            $newPrefix = if ($isLastItem) { "$Prefix    " } else { "$Prefix│   " }
            Show-Tree -Path $item.FullName -Prefix $newPrefix -IsLast $isLastItem
        } else {
            $symbol = if ($isLastItem) { "└── " } else { "├── " }
            Write-Host "$Prefix$symbol$($item.Name)" -ForegroundColor White
        }
    }
}

$rootPath = $PSScriptRoot + "\.."
Set-Location $rootPath

Write-Host "OrderBean/" -ForegroundColor Green
Show-Tree -Path $rootPath -Prefix ""

Write-Host "`n주요 디렉토리 설명:" -ForegroundColor Cyan
Write-Host "  frontend/     - React 프론트엔드 애플리케이션" -ForegroundColor White
Write-Host "  backend/      - Node.js/Express 백엔드 API" -ForegroundColor White
Write-Host "  scripts/      - 유틸리티 스크립트" -ForegroundColor White

