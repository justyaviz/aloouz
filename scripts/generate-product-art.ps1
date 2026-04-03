Add-Type -AssemblyName System.Drawing

$outputDir = Join-Path $PSScriptRoot "..\public\catalog-art"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

function New-Color([byte]$a, [int]$hex) {
  $r = ($hex -shr 16) -band 0xFF
  $g = ($hex -shr 8) -band 0xFF
  $b = $hex -band 0xFF
  return [System.Drawing.Color]::FromArgb($a, $r, $g, $b)
}

function New-RoundedPath([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $r * 2
  $path.AddArc($x, $y, $diameter, $diameter, 180, 90)
  $path.AddArc($x + $w - $diameter, $y, $diameter, $diameter, 270, 90)
  $path.AddArc($x + $w - $diameter, $y + $h - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($x, $y + $h - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Fill-RoundedRect($g, $brush, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $path = New-RoundedPath $x $y $w $h $r
  $g.FillPath($brush, $path)
  $path.Dispose()
}

function Draw-RoundedRect($g, $pen, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $path = New-RoundedPath $x $y $w $h $r
  $g.DrawPath($pen, $path)
  $path.Dispose()
}

function Add-SoftShadow($g, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r, [byte]$alpha) {
  for ($i = 22; $i -ge 1; $i--) {
    $shadowAlpha = [byte]([Math]::Max(3, $alpha / ($i + 2)))
    $brush = New-Object System.Drawing.SolidBrush (New-Color $shadowAlpha 0x0C1729)
    Fill-RoundedRect $g $brush ($x - $i) ($y - $i) ($w + ($i * 2)) ($h + ($i * 2)) ($r + $i)
    $brush.Dispose()
  }
}

function New-Canvas([scriptblock]$paint) {
  $bitmap = [System.Drawing.Bitmap]::new(1200, 1200, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.Clear([System.Drawing.Color]::Transparent)

  & $paint $graphics

  $graphics.Dispose()
  return $bitmap
}

function Save-Art($name, $bitmap) {
  $path = Join-Path $outputDir $name
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}

function Draw-BackPhone($g, [float]$x, [float]$y, [float]$w, [float]$h, [float]$radius, [int]$startHex, [int]$endHex) {
  Add-SoftShadow $g $x $y $w $h $radius 100
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    ([System.Drawing.PointF]::new($x, $y)),
    ([System.Drawing.PointF]::new($x + $w, $y + $h)),
    (New-Color 255 $startHex),
    (New-Color 255 $endHex)
  )
  Fill-RoundedRect $g $brush $x $y $w $h $radius
  $brush.Dispose()

  $outline = New-Object System.Drawing.Pen (New-Color 70 0xFFFFFF), 4
  Draw-RoundedRect $g $outline $x $y $w $h $radius
  $outline.Dispose()

  $logo = New-Object System.Drawing.SolidBrush (New-Color 50 0xFFFFFF)
  $font = New-Object System.Drawing.Font("Arial", 30, [System.Drawing.FontStyle]::Bold)
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $g.DrawString("aloo", $font, $logo, ([System.Drawing.RectangleF]::new($x, $y + ($h * 0.68), $w, 48)), $format)
  $format.Dispose()
  $font.Dispose()
  $logo.Dispose()
}

function Draw-FrontPhone($g, [float]$x, [float]$y, [float]$w, [float]$h, [float]$radius, [int]$startHex, [int]$endHex) {
  Add-SoftShadow $g $x $y $w $h $radius 120
  $shellBrush = New-Object System.Drawing.SolidBrush (New-Color 255 0x111827)
  Fill-RoundedRect $g $shellBrush $x $y $w $h $radius
  $shellBrush.Dispose()

  $screenBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    ([System.Drawing.PointF]::new($x + 10, $y + 26)),
    ([System.Drawing.PointF]::new($x + $w - 10, $y + $h - 26)),
    (New-Color 255 $startHex),
    (New-Color 255 $endHex)
  )
  Fill-RoundedRect $g $screenBrush ($x + 12) ($y + 22) ($w - 24) ($h - 34) ($radius - 18)
  $screenBrush.Dispose()

  $glow = New-Object System.Drawing.SolidBrush (New-Color 42 0xFFFFFF)
  Fill-RoundedRect $g $glow ($x + 34) ($y + 56) ($w - 68) ($h * 0.42) ($radius - 38)
  $glow.Dispose()

  $notchBrush = New-Object System.Drawing.SolidBrush (New-Color 180 0x1F2937)
  Fill-RoundedRect $g $notchBrush ($x + ($w * 0.28)) ($y + 20) ($w * 0.44) 18 9
  $notchBrush.Dispose()
}

function Draw-CameraLenses($g, [float]$x, [float]$y, [float[]]$sizes) {
  foreach ($size in $sizes) {
    $outer = New-Object System.Drawing.SolidBrush (New-Color 220 0x121826)
    $inner = New-Object System.Drawing.SolidBrush (New-Color 200 0x0F172A)
    $highlight = New-Object System.Drawing.SolidBrush (New-Color 120 0xFFFFFF)
    $g.FillEllipse($outer, $x, $y, $size, $size)
    $g.FillEllipse($inner, $x + 10, $y + 10, $size - 20, $size - 20)
    $g.FillEllipse($highlight, $x + 20, $y + 18, ($size * 0.2), ($size * 0.2))
    $outer.Dispose()
    $inner.Dispose()
    $highlight.Dispose()
    $y += $size + 16
  }
}

function New-iPhoneArt {
  New-Canvas {
    param($g)
    Draw-BackPhone $g 180 170 300 730 58 0xF4C6D1 0xFBE9EE
    $cameraIsland = New-Object System.Drawing.SolidBrush (New-Color 235 0xE7AFC1)
    Fill-RoundedRect $g $cameraIsland 220 210 150 132 42
    $cameraIsland.Dispose()
    Draw-CameraLenses $g 245 235 @(60, 60)

    Draw-FrontPhone $g 420 120 360 820 64 0xF7D6DF 0xFFF8FA
  }
}

function New-SamsungArt {
  New-Canvas {
    param($g)
    Draw-BackPhone $g 180 170 300 730 58 0x162C4F 0x3D7BD9
    Draw-CameraLenses $g 250 235 @(54, 54, 54)
    Draw-FrontPhone $g 430 120 350 820 62 0x78A9FF 0xE9F4FF
  }
}

function New-HonorArt {
  New-Canvas {
    param($g)
    Draw-BackPhone $g 200 170 292 730 56 0x8E2A2A 0xD16D5A
    $ringBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      ([System.Drawing.PointF]::new(235, 210)),
      ([System.Drawing.PointF]::new(405, 380)),
      (New-Color 255 0xF4D17A),
      (New-Color 255 0xB7852B)
    )
    $g.FillEllipse($ringBrush, 238, 215, 160, 160)
    $ringBrush.Dispose()
    $inner = New-Object System.Drawing.SolidBrush (New-Color 255 0x20191C)
    $g.FillEllipse($inner, 273, 250, 90, 90)
    $inner.Dispose()
    $mini = New-Object System.Drawing.SolidBrush (New-Color 230 0xD8B35C)
    $g.FillEllipse($mini, 287, 264, 62, 62)
    $mini.Dispose()

    Draw-FrontPhone $g 448 140 342 800 60 0xF5DCD0 0xF36655
  }
}

function New-XiaomiArt {
  New-Canvas {
    param($g)
    Draw-BackPhone $g 180 170 300 730 58 0xDCE4EF 0x8B97A7
    $cameraIsland = New-Object System.Drawing.SolidBrush (New-Color 230 0x374151)
    Fill-RoundedRect $g $cameraIsland 220 220 138 138 34
    $cameraIsland.Dispose()
    Draw-CameraLenses $g 246 246 @(46, 46)
    $flash = New-Object System.Drawing.SolidBrush (New-Color 160 0xFDF5C8)
    $g.FillEllipse($flash, 309, 308, 18, 18)
    $flash.Dispose()

    Draw-FrontPhone $g 425 120 352 820 62 0xEEEDEB 0xD3B08F
  }
}

function New-OppoArt {
  New-Canvas {
    param($g)
    Draw-BackPhone $g 188 170 300 730 58 0x6D5BD0 0xA28FFF
    $island = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      ([System.Drawing.PointF]::new(225, 210)),
      ([System.Drawing.PointF]::new(375, 320)),
      (New-Color 255 0x312B5A),
      (New-Color 255 0x5E528D)
    )
    Fill-RoundedRect $g $island 225 212 148 122 44
    $island.Dispose()
    Draw-CameraLenses $g 246 238 @(52, 52)
    $flash = New-Object System.Drawing.SolidBrush (New-Color 170 0xFFF3CC)
    $g.FillEllipse($flash, 320, 280, 18, 18)
    $flash.Dispose()

    Draw-FrontPhone $g 430 120 350 820 62 0xC7B4FF 0xEDF0FF
  }
}

function New-WatchArt {
  New-Canvas {
    param($g)
    $band = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      ([System.Drawing.PointF]::new(470, 80)),
      ([System.Drawing.PointF]::new(730, 1120)),
      (New-Color 255 0x0F172A),
      (New-Color 255 0x394357)
    )
    Fill-RoundedRect $g $band 485 70 220 1060 90
    $band.Dispose()

    Add-SoftShadow $g 320 285 560 560 90 115
    $body = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      ([System.Drawing.PointF]::new(330, 290)),
      ([System.Drawing.PointF]::new(840, 840)),
      (New-Color 255 0x0F172A),
      (New-Color 255 0x28364F)
    )
    Fill-RoundedRect $g $body 320 285 560 560 96
    $body.Dispose()

    $screen = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      ([System.Drawing.PointF]::new(360, 330)),
      ([System.Drawing.PointF]::new(820, 800)),
      (New-Color 255 0x1D9BF0),
      (New-Color 255 0xF7FBFF)
    )
    Fill-RoundedRect $g $screen 360 330 480 480 78
    $screen.Dispose()

    $ring = New-Object System.Drawing.Pen (New-Color 100 0xFFFFFF), 10
    $g.DrawEllipse($ring, 445, 415, 310, 310)
    $ring.Dispose()
  }
}

function New-EarbudsArt {
  New-Canvas {
    param($g)
    Add-SoftShadow $g 290 460 620 330 130 90
    $case = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      ([System.Drawing.PointF]::new(290, 460)),
      ([System.Drawing.PointF]::new(910, 790)),
      (New-Color 255 0xFFFFFF),
      (New-Color 255 0xE7EEF8)
    )
    Fill-RoundedRect $g $case 290 460 620 330 130
    $case.Dispose()
    $linePen = New-Object System.Drawing.Pen (New-Color 60 0x90A4C6), 6
    $g.DrawLine($linePen, 335, 615, 865, 615)
    $linePen.Dispose()

    $stemBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      ([System.Drawing.PointF]::new(0, 0)),
      ([System.Drawing.PointF]::new(0, 200)),
      (New-Color 255 0xFFFFFF),
      (New-Color 255 0xDCE7F5)
    )
    Fill-RoundedRect $g $stemBrush 360 170 82 320 42
    Fill-RoundedRect $g $stemBrush 760 170 82 320 42
    $g.FillEllipse($stemBrush, 305, 150, 190, 190)
    $g.FillEllipse($stemBrush, 705, 150, 190, 190)
    $stemBrush.Dispose()
  }
}

function New-TabletArt {
  New-Canvas {
    param($g)
    Add-SoftShadow $g 150 170 900 760 76 100
    $body = New-Object System.Drawing.SolidBrush (New-Color 255 0x0F172A)
    Fill-RoundedRect $g $body 150 170 900 760 82
    $body.Dispose()
    $screen = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      ([System.Drawing.PointF]::new(220, 240)),
      ([System.Drawing.PointF]::new(970, 860)),
      (New-Color 255 0xD8F0FF),
      (New-Color 255 0x6AB6FF)
    )
    Fill-RoundedRect $g $screen 195 210 810 680 66
    $screen.Dispose()
    $glow = New-Object System.Drawing.SolidBrush (New-Color 52 0xFFFFFF)
    Fill-RoundedRect $g $glow 250 280 700 240 50
    $glow.Dispose()
  }
}

function New-KeyboardArt {
  New-Canvas {
    param($g)
    Add-SoftShadow $g 140 360 920 420 60 95
    $body = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      ([System.Drawing.PointF]::new(140, 360)),
      ([System.Drawing.PointF]::new(1060, 780)),
      (New-Color 255 0xF8FBFF),
      (New-Color 255 0xDCE7F6)
    )
    Fill-RoundedRect $g $body 140 360 920 420 64
    $body.Dispose()
    for ($row = 0; $row -lt 4; $row++) {
      for ($col = 0; $col -lt 10; $col++) {
        $x = 195 + ($col * 78)
        $y = 420 + ($row * 80)
        $key = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
          ([System.Drawing.PointF]::new($x, $y)),
          ([System.Drawing.PointF]::new($x + 54, $y + 42)),
          (New-Color 255 0xFFFFFF),
          (New-Color 255 0xEEF4FC)
        )
        Fill-RoundedRect $g $key $x $y 56 46 14
        $key.Dispose()
      }
    }
  }
}

function New-SpeakerArt {
  New-Canvas {
    param($g)
    Add-SoftShadow $g 390 170 420 840 84 110
    $body = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      ([System.Drawing.PointF]::new(390, 170)),
      ([System.Drawing.PointF]::new(810, 1010)),
      (New-Color 255 0x131B2A),
      (New-Color 255 0x3A465A)
    )
    Fill-RoundedRect $g $body 390 170 420 840 90
    $body.Dispose()
    foreach ($y in @(305, 525, 745)) {
      $ringOuter = New-Object System.Drawing.SolidBrush (New-Color 255 0x1C2536)
      $ringInner = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        ([System.Drawing.PointF]::new(465, $y)),
        ([System.Drawing.PointF]::new(735, $y + 240)),
        (New-Color 255 0x5FD1FF),
        (New-Color 255 0x0C1830)
      )
      $g.FillEllipse($ringOuter, 465, $y, 270, 270)
      $g.FillEllipse($ringInner, 500, $y + 35, 200, 200)
      $ringOuter.Dispose()
      $ringInner.Dispose()
    }
  }
}

Save-Art "iphone-soft-pink.png" (New-iPhoneArt)
Save-Art "samsung-ocean.png" (New-SamsungArt)
Save-Art "honor-red.png" (New-HonorArt)
Save-Art "xiaomi-silver.png" (New-XiaomiArt)
Save-Art "oppo-violet.png" (New-OppoArt)
Save-Art "smartwatch-midnight.png" (New-WatchArt)
Save-Art "earbuds-white.png" (New-EarbudsArt)
Save-Art "tablet-sky.png" (New-TabletArt)
Save-Art "keyboard-cloud.png" (New-KeyboardArt)
Save-Art "speaker-midnight.png" (New-SpeakerArt)
