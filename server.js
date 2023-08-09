const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs").promises;
const xml2js = require("xml2js");
const { createCanvas, loadImage } = require("canvas");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const imageDirs = ["../Pruebas", "./Dataset/train/agaves/", "./imagestotest/"];
const imageExtensions = [".png", ".jpg", ".jpeg"];

async function procesarImagen(imageName) {
  for (const imageDir of imageDirs) {
    for (const ext of imageExtensions) {
      const imagePath = path.join(imageDir, `${imageName}${ext}`);
      const annotationPath = path.join(imageDir, `${imageName}.xml`);

      try {
        await fs.access(imagePath, fs.constants.F_OK);
        await fs.access(annotationPath, fs.constants.F_OK);

        return imagePath; // Encontramos la imagen, retornamos la ruta
      } catch (error) {
        // Si hay un error, seguimos buscando la imagen
      }
    }
  }

  return null; // No se encontró la imagen o el archivo XML
}
app.post("/respuesta-servidor", async (req, res) => {
  try {
    const nombreImagen = req.body.nombreImagen;
    const imageExists = await verificarImagen(nombreImagen);

    if (imageExists) {
      res.json({ resultado: 1 });
    } else {
      res.json({ resultado: 0 });
    }
  } catch (error) {
    console.error("Error al verificar la imagen:", error.message);
    res.status(500).json({ mensaje: "Error al verificar la imagen" });
  }
});

async function verificarImagen(imageName) {
  for (const imageDir of imageDirs) {
    for (const ext of imageExtensions) {
      const imagePath = path.join(imageDir, `${imageName}${ext}`);
      if (
        await fs
          .access(imagePath)
          .then(() => true)
          .catch(() => false)
      ) {
        return true;
      }
    }
  }
  return false;
}

app.post("/procesar-imagen", async (req, res) => {
  try {
    const nombreImagen = req.body.nombreImagen;
    const imagenPath = await procesarImagen(nombreImagen);

    if (!imagenPath) {
      res.json({ resultado: 0 }); // Aquí se devuelve 0 si la imagen no se encuentra
      return;
    }

    const image = await loadImage(imagenPath);
    const xmlString = await fs.readFile(
      `${imagenPath.slice(0, -4)}.xml`,
      "utf-8"
    );
    const result = await xml2js.parseStringPromise(xmlString);

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    const objects = result.annotation.object;
    objects.forEach((obj) => {
      const xmin = parseInt(obj.bndbox[0].xmin[0]);
      const ymin = parseInt(obj.bndbox[0].ymin[0]);
      const xmax = parseInt(obj.bndbox[0].xmax[0]);
      const ymax = parseInt(obj.bndbox[0].ymax[0]);

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.rect(xmin, ymin, xmax - xmin, ymax - ymin);
      ctx.stroke();

      ctx.font = "18px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(obj.name[0], xmin, ymin - 5);
    });

    const imageWithLabelsPath = path.resolve(
      `${imagenPath.slice(0, -4)}_etiquetas.png`
    );
    const imageWithLabelsBase64 = canvas.toDataURL();

    const out = require("fs").createWriteStream(imageWithLabelsPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    out.on("finish", () => {
      res.json({ imageWithLabelsBase64 });
      fs.unlink(imageWithLabelsPath, (err) => {
        if (err) console.error("Error al eliminar imagen temporal:", err);
      });
    });
  } catch (error) {
    console.error("Error al procesar la imagen:", error.message);
    res.status(500).json({ mensaje: error.message });
  }
});

const puerto = 3000;
app.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`);
});