const express = require("express");
const moment = require("moment");
const { db } = require("../../utils/firebase");
const {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  setDoc,
  getDoc,
} = require("firebase/firestore");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("Hola bien venido a la ruta de puntuacion");
    res.send("Hola bien venido a la ruta de puntuacion");
  } catch (error) {
    console.error("Error en la ruta de puntuacion: ", error);
    res.status(500).send("Error en la ruta de puntuacion");
  }
});

// Consultar todos las puntuaciones
router.get("/consultarPuntuacion", async (req, res) => {
  try {
    const puntuacionCollectionRef = collection(db, "puntuacion");
    const q = query(
      puntuacionCollectionRef,
      orderBy("score", "desc"),
      orderBy("fecha", "asc")
    );
    const querySnapshot = await getDocs(q);

    // Iterar sobre los documentos y recopilar los datos
    const data = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    // Enviar todos los datos como respuesta
    console.log("Puntuacion Consultada");
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

// Crear una nueva puntacion
router.post("/agregarPuntuacion", async (req, res) => {
  try {
    let fecha = new Date();
    let fechaFormateada = moment(fecha).format("DD/MM/YYYY HH:mm:ss");

    console.log(fechaFormateada);

    const newPuntuacion = {
      uid: req.body.uid,
      score: req.body.score,
      nombre: req.body.nombre,
      fecha: req.body.fecha,
    };

    const puntuacionCollectionRef = collection(db, "puntuacion");
    const docRef = doc(puntuacionCollectionRef, String(newPuntuacion.uid));

    // Verificar si el documento ya existe
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // Si el documento ya existe, enviar un mensaje de error
      const docRefUpdate = doc(puntuacionCollectionRef, newPuntuacion.uid);

      const updatedData = {
        score: newPuntuacion.score,
      };

      await updateDoc(docRefUpdate, updatedData);

      res
        .status(400)
        .send(
          "Un documento con este uid ya existe y la puntuacion se actualizo correctamente"
        );
    } else {
      // Si el documento no existe, insertarlo
      await setDoc(docRef, newPuntuacion);
      console.log("Documento insertado con ID:", docRef.id);
      res.send(`Puntuacion agregada: ${docRef.id}`);
    }
  } catch (error) {
    console.log("Error en la ruta de puntuacion: ", error);
  }
});

// Editar un usuario
router.put("/puntuacion/:id", async (req, res) => {
  try {
    const puntuacionesCollectionRef = collection(db, "puntuacion");
    const docRef = doc(puntuacionesCollectionRef, req.params.id);

    // Datos a editar
    const updatedData = {
      score: req.body.score,
    };

    await updateDoc(docRef, updatedData);

    res.send("Puntuacion actualizada correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error actualizando el usuario");
  }
});

// Eliminar un usuario
// router.delete("/eliminar/:id", async (req, res) => {
//   try {
//     const usersCollectionRef = collection(db, "test");
//     const docRef = doc(usersCollectionRef, req.params.id);

//     await deleteDoc(docRef);

//     res.send("Usuario eliminado correctamente");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error eliminando el usuario");
//   }
// });

module.exports = router;
