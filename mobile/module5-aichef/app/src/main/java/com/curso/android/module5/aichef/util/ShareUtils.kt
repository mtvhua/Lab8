package com.curso.android.module5.aichef.util

import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.widget.Toast
import androidx.core.content.FileProvider
import java.io.File
import java.io.FileOutputStream

object ShareUtils {
    /**
     * Lanza el "Share Sheet" de Android con una imagen
     */
    fun shareRecipe(context: Context, bitmap: Bitmap, title: String) {
        try {
            // 1. Guardar el bitmap en un archivo temporal en el cache
            val cachePath = File(context.cacheDir, "shared_images")
            cachePath.mkdirs()
            val stream = FileOutputStream("$cachePath/recipe_share.png")
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)
            stream.close()

            // 2. Obtener la URI segura usando el FileProvider
            val imagePath = File(context.cacheDir, "shared_images")
            val newFile = File(imagePath, "recipe_share.png")
            val contentUri = FileProvider.getUriForFile(
                context,
                "${context.packageName}.fileprovider",
                newFile
            )

            // 3. Crear el Intent de compartir
            val shareIntent = Intent().apply {
                action = Intent.ACTION_SEND
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                setDataAndType(contentUri, context.contentResolver.getType(contentUri))
                putExtra(Intent.EXTRA_STREAM, contentUri)
                putExtra(Intent.EXTRA_SUBJECT, "¡Mira esta receta de AI Chef: $title!")
                putExtra(Intent.EXTRA_TEXT, "He cocinado esto con la ayuda de mi IA: $title")
                type = "image/png"
            }

            context.startActivity(Intent.createChooser(shareIntent, "Compartir receta vía"))
        } catch (e: Exception) {
            Toast.makeText(context, "Error al compartir: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }
}