
const express = require('express');
const { db_realtime } = require('../../utils/firebase_realtime');
const { db } = require('../../utils/firebase');
const { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } = require("firebase/firestore");
const router = express.Router();

router.get('/', async (req, res) => {
   try {
      console.log('Esto es de calis');
      res.send('Hola esto es de Calis');
   } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
   }
});

/******************** Esto es con la base de Firebase Realtime Database ********************/

// Crear un nuevo usuario
router.post('/testeo', async (req, res) => {
   console.log(req.body);
   const newTest = {
      email: req.body.email,
      name: req.body.name
   }
   db_realtime.ref('test').push(newTest)
   res.send('received');
});

// Consultar todos los usuarios
router.get('/consulta2', async (req, res) => {
   db_realtime.ref('test').once('value', (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      res.send(data);
   })
});

/******************** Esto es con la base de Firebase Cloud Firestore ********************/

// Consultar todos los usuarios
router.get('/consulta', async (req, res) => {
   try {
      const testCollectionRef = collection(db, 'test');
      const querySnapshot = await getDocs(testCollectionRef);

      // Iterar sobre los documentos y recopilar los datos
      const data = querySnapshot.docs.map((doc) => {
         return {
            id: doc.id,
            ...doc.data()
         };
      });

      // Enviar todos los datos como respuesta
      console.log('Usuarios Consultados');
      res.json(data);
   } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching data');
   }
});

// Crear un nuevo usuario
router.post('/users', async (req, res) => {
   const newUser = {
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
   };

   const testCollectionRef = collection(db, 'test');
   const docRef = await addDoc(testCollectionRef, newUser);
   console.log('Documento insertado con ID:', docRef.id);

   res.send(`Test: ${docRef.id}`)
});

// Editar un usuario
router.put('/editar/:id', async (req, res) => {
   try {
      const usersCollectionRef = collection(db, 'test');
      const docRef = doc(usersCollectionRef, req.params.id);

      // Datos a editar
      const updatedData = {
         name: req.body.name,
         age: req.body.age,
         email: req.body.email,
      };

      await updateDoc(docRef, updatedData);

      res.send('Usuario actualizado correctamente');
   } catch (error) {
      console.error(error);
      res.status(500).send('Error actualizando el usuario');
   }
});

// Eliminar un usuario
router.delete('/eliminar/:id', async (req, res) => {
   try {
      const usersCollectionRef = collection(db, 'test');
      const docRef = doc(usersCollectionRef, req.params.id);

      await deleteDoc(docRef);

      res.send('Usuario eliminado correctamente');
   } catch (error) {
      console.error(error);
      res.status(500).send('Error eliminando el usuario');
   }
});

module.exports = router;
