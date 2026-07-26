# Script para corregir editar-productos.html
$filePath = "C:/Users/Deyner Chaverra/Desktop/Artesanias-Chigorodo/frontend/artesano/editar-productos.html"

$content = Get-Content -Path $filePath -Raw

# Reemplazar textarea
$content = $content -replace '<textarea class="aa-textarea" required>.*?</textarea>', '<textarea class="aa-textarea aa-textarea-0" name="aa-textarea-0" required></textarea>'

# Reemplazar inputs con valores hardcodeados
$content = $content -replace 'class="aa-input" value="240000"', 'class="aa-input aa-input-2" name="aa-input-2"'
$content = $content -replace 'class="aa-input" value="Hilo de algodón mercerizado"', 'class="aa-input aa-input-3" name="aa-input-3"'
$content = $content -replace 'class="aa-input" value="Tejido en crochet Wayuu"', 'class="aa-input aa-input-4" name="aa-input-4"'
$content = $content -replace 'class="aa-input" value="15"', 'class="aa-input aa-input-5" name="aa-input-5"'
$content = $content -replace 'class="aa-input" value="40 x 35 x 15"', 'class="aa-input aa-input-6" name="aa-input-6"'
$content = $content -replace 'class="aa-input" value="0.6"', 'class="aa-input aa-input-8" name="aa-input-8"'
$content = $content -replace 'class="aa-input" value="MWY-URB-004"', 'class="aa-input aa-input-9" name="aa-input-9"'
$content = $content -replace 'class="aa-input" value="12"', 'class="aa-input aa-input-7" name="aa-input-7"'
$content = $content -replace 'class="aa-input" value="mochila, wayuu, tejido, guajira, colores"', 'class="aa-input aa-input-10" name="aa-input-10"'

# Reemplazar select de categoría
$content = $content -replace '<select class="aa-select">', '<select class="aa-select aa-select-0" name="aa-select-0">'
$content = $content -replace '<option selected>Tejidos</option>', '<option value="TEJIDOS" selected>Tejidos</option>'
$content = $content -replace '<option>Alfarería y Barro</option>', '<option value="ALFARERIA_Y_BARRO">Alfarería y Barro</option>'
$content = $content -replace '<option>Ebanistería y Madera</option>', '<option value="EBANISTERIA_Y_MADERA">Ebanistería y Madera</option>'
$content = $content -replace '<option>Joyería Artesanal</option>', '<option value="JOYERIA_ARTESANAL">Joyería Artesanal</option>'
$content = $content -replace '<option>Accesorios</option>', '<option value="ACCESORIOS">Accesorios</option>'
$content = $content -replace '<option>Hogar y Decoración</option>', '<option value="HOGAR_Y_DECORACION">Hogar y Decoración</option>'

# Reemplazar select de visibilidad
$content = $content -replace '<select class="aa-select">.*?<option selected>Visible en Catálogo</option>', '<select class="aa-select aa-select-1" name="aa-select-1">
          <option value="true" selected>Visible en Catálogo</option>'
$content = $content -replace '<option>Oculto / Borrador</option>', '<option value="false">Oculto / Borrador</option>'
$content = $content -replace '<option>Agotado temporalmente</option>', '<option value="false">Agotado temporalmente</option>'

# Reemplazar imagen
$content = $content -replace 'value="../img/producto-mochila-wayuu-1.png"', ''
$content = $content -replace 'src="../img/producto-mochila-wayuu-1.png"', 'src="" style="display: none;"'
$content = $content -replace 'class="aa-input" id="edit-product-image-url"', 'class="aa-input" id="edit-product-image-url" name="edit-product-image-url" placeholder="URL de la imagen o deja vacío para subir desde archivo"'
$content = $content -replace 'onerror="this.style.opacity = 0.3"', 'onerror="this.style.display = \'none\'" style="display: none;"'

Set-Content -Path $filePath -Value $content
