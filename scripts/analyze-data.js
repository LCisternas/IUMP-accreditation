async function analyzeCSVData() {
  try {
    console.log("Descargando y analizando archivo CSV...")

    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5.%20CARGA%20MASIVA_PLANILLA_CENTRO%20SUR.xlsx%20-%20USO%20INTERNO-zBc27kvjD4Xs8mZlZbYtoJg7ReSOJc.csv",
    )
    const csvText = await response.text()

    console.log("Archivo descargado exitosamente")
    console.log("Tamaño del archivo:", csvText.length, "caracteres")

    // Dividir en líneas
    const lines = csvText.split("\n").filter((line) => line.trim())
    console.log("Número total de líneas:", lines.length)

    if (lines.length === 0) {
      console.log("El archivo está vacío")
      return
    }

    // Analizar encabezados
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
    console.log("\n=== ENCABEZADOS ENCONTRADOS ===")
    headers.forEach((header, index) => {
      console.log(`${index + 1}. "${header}"`)
    })

    // Analizar algunas filas de datos
    console.log("\n=== MUESTRA DE DATOS (primeras 5 filas) ===")
    for (let i = 1; i <= Math.min(6, lines.length - 1); i++) {
      const row = lines[i].split(",").map((cell) => cell.trim().replace(/"/g, ""))
      console.log(`\nFila ${i}:`)
      headers.forEach((header, index) => {
        if (row[index] && row[index] !== "") {
          console.log(`  ${header}: "${row[index]}"`)
        }
      })
    }

    // Analizar campos únicos para algunos campos importantes
    console.log("\n=== ANÁLISIS DE CAMPOS ÚNICOS ===")

    const dataRows = lines.slice(1).map((line) => line.split(",").map((cell) => cell.trim().replace(/"/g, "")))

    // Analizar géneros
    const genders = new Set()
    const regions = new Set()
    const zones = new Set()
    const churches = new Set()

    dataRows.forEach((row) => {
      // Buscar género en diferentes columnas
      if (row[2]) genders.add(row[2]) // GÉNERO
      if (row[10]) genders.add(row[10]) // GENERO

      // Buscar regiones
      if (row[6]) regions.add(row[6]) // REGIÓN
      if (row[11]) regions.add(row[11]) // REGION

      // Buscar zonas
      if (row[7]) zones.add(row[7]) // ZONA
      if (row[12]) zones.add(row[12]) // ZONAS CENTRO SUR

      // Buscar iglesias
      if (row[8]) churches.add(row[8]) // IGLESIA
    })

    console.log("\nGéneros encontrados:")
    ;[...genders].filter((g) => g).forEach((g) => console.log(`  - ${g}`))

    console.log("\nRegiones encontradas:")
    ;[...regions].filter((r) => r).forEach((r) => console.log(`  - ${r}`))

    console.log("\nZonas encontradas:")
    ;[...zones].filter((z) => z).forEach((z) => console.log(`  - ${z}`))

    console.log("\nIglesias encontradas (primeras 10):")
    ;[...churches]
      .filter((c) => c)
      .slice(0, 10)
      .forEach((c) => console.log(`  - ${c}`))

    console.log(`\nTotal de iglesias únicas: ${[...churches].filter((c) => c).length}`)

    // Analizar estructura de datos
    console.log("\n=== RECOMENDACIONES PARA BASE DE DATOS ===")

    console.log("\n1. TABLA: regions")
    console.log("   - id (UUID, PRIMARY KEY)")
    console.log("   - name (VARCHAR(100), NOT NULL)")
    console.log("   - created_at (TIMESTAMP)")

    console.log("\n2. TABLA: zones")
    console.log("   - id (UUID, PRIMARY KEY)")
    console.log("   - name (VARCHAR(100), NOT NULL)")
    console.log("   - code (VARCHAR(20)) -- Para códigos como Z30")
    console.log("   - region_id (UUID, FOREIGN KEY)")
    console.log("   - description (TEXT)")
    console.log("   - created_at (TIMESTAMP)")

    console.log("\n3. TABLA: churches (ACTUALIZADA)")
    console.log("   - id (UUID, PRIMARY KEY)")
    console.log("   - name (VARCHAR(255), NOT NULL)")
    console.log("   - region_id (UUID, FOREIGN KEY)")
    console.log("   - zone_id (UUID, FOREIGN KEY)")
    console.log("   - contact_person (VARCHAR(255))")
    console.log("   - contact_email (VARCHAR(255))")
    console.log("   - contact_phone (VARCHAR(20))")
    console.log("   - member_limit (INTEGER DEFAULT 50)")
    console.log("   - created_at (TIMESTAMP)")
    console.log("   - updated_at (TIMESTAMP)")

    console.log("\n4. TABLA: users (ACTUALIZADA)")
    console.log("   - id (UUID, PRIMARY KEY)")
    console.log("   - rut (VARCHAR(12), UNIQUE)")
    console.log("   - full_name (VARCHAR(255), NOT NULL)")
    console.log("   - email (VARCHAR(255), UNIQUE)")
    console.log("   - phone (VARCHAR(20))")
    console.log("   - gender (VARCHAR(20)) -- MASCULINO/FEMENINO")
    console.log("   - age (INTEGER)")
    console.log("   - role (VARCHAR(20) DEFAULT 'attendee')")
    console.log("   - church_id (UUID, FOREIGN KEY)")
    console.log("   - region_id (UUID, FOREIGN KEY)")
    console.log("   - zone_id (UUID, FOREIGN KEY)")
    console.log("   - is_accredited (BOOLEAN DEFAULT FALSE)")
    console.log("   - created_at (TIMESTAMP)")
    console.log("   - updated_at (TIMESTAMP)")

    console.log("\n5. TABLA: tickets (SIN CAMBIOS)")
    console.log("   - id (UUID, PRIMARY KEY)")
    console.log("   - user_id (UUID, FOREIGN KEY)")
    console.log("   - ticket_type (VARCHAR(50))")
    console.log("   - qr_code (VARCHAR(255), UNIQUE)")
    console.log("   - is_used (BOOLEAN DEFAULT FALSE)")
    console.log("   - used_at (TIMESTAMP)")
    console.log("   - used_by (UUID, FOREIGN KEY)")
    console.log("   - created_at (TIMESTAMP)")
  } catch (error) {
    console.error("Error al analizar el archivo:", error)
  }
}

// Ejecutar análisis
analyzeCSVData()
