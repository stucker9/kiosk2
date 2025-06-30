function Show-Tree($Path, $Prefix = "", $Exclude = @("node_modules", ".nuxt", ".output", "dist", "coverage", ".git")) {
  $items = Get-ChildItem $Path | Where-Object { $_.Name -notin $Exclude }
  for ($i = 0; $i -lt $items.Count; $i++) {
      $isLast = $i -eq ($items.Count - 1)
      $current = if ($isLast) { "|-- " } else { "|-- " }
      Write-Output "$Prefix$current$($items[$i].Name)"
      if ($items[$i].PSIsContainer) {
          $newPrefix = "$Prefix    "
          Show-Tree $items[$i].FullName $newPrefix $Exclude
      }
  }
}

Show-Tree . | Out-File "project_tree.txt"
Write-Host "Directory tree saved to project_tree.txt"