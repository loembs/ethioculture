# =============================================
# MIGRATION DES IMPORTS VERS SERVICES SUPABASE
# =============================================

Write-Host "🔄 Migration des imports vers Supabase..." -ForegroundColor Cyan
Write-Host ""

$files = @(
    "src\pages\PaymentPage.tsx",
    "src\components\ProductCard.tsx",
    "src\pages\UserProfile.tsx",
    "src\hooks\usePreloadData.ts",
    "src\components\PaymentTestButton.tsx",
    "src\components\EnhancedProductCard.tsx",
    "src\pages\admin\AdminDashboard.tsx",
    "src\components\Footer.tsx",
    "src\components\CartDebug.tsx",
    "src\hooks\useCartSync.ts",
    "src\components\AuthStatus.tsx",
    "src\data\staticData.ts",
    "src\components\ProductFilters.tsx",
    "src\components\ProductGrid.tsx"
)

$count = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "📝 Mise à jour: $file" -ForegroundColor Yellow
        
        $content = Get-Content $file -Raw
        
        # Remplacer les imports
        $content = $content -replace "from '@/services/authService'", "from '@/services'"
        $content = $content -replace "from '@/services/productService'", "from '@/services'"
        $content = $content -replace "from '@/services/cartService'", "from '@/services'"
        $content = $content -replace "from '@/services/orderService'", "from '@/services'"
        $content = $content -replace "from '@/services/paymentService'", "from '@/services'"
        
        Set-Content $file -Value $content -NoNewline
        $count++
    }
}

Write-Host ""
Write-Host "✅ Migration terminée!" -ForegroundColor Green
Write-Host "📊 $count fichiers modifiés" -ForegroundColor Cyan
Write-Host ""
Write-Host "🧪 Tester avec: npm run dev" -ForegroundColor Yellow





















