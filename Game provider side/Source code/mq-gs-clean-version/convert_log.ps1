$path = "startup_trace.txt"
$dest = "startup_trace_utf8.txt"
if (Test-Path $path) {
    try {
        # Read as Unicode (UTF-16 LE)
        $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::Unicode)
        # Write as UTF-8
        [System.IO.File]::WriteAllText($dest, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Converted successfully."
    }
    catch {
        Write-Host "Error reading as Unicode: $_"
        try {
            # Retry as Default/ANSI if Unicode failed (maybe it was mixed?)
            $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::Default)
            [System.IO.File]::WriteAllText($dest, $content, [System.Text.Encoding]::UTF8)
            Write-Host "Converted from Default."
        }
        catch {
            Write-Host "Failed conversion: $_"
        }
    }
}
else {
    Write-Host "File not found: $path"
}
