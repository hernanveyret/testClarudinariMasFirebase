import { GoogleAuthProvider,
         onAuthStateChanged,
         signInWithPopup,
         signOut,
         signInWithEmailAndPassword,
         createUserWithEmailAndPassword } from "firebase/auth";

import { collection,
         onSnapshot, 
         addDoc,
         deleteDoc,
         doc, 
         setDoc,
         updateDoc, 
         getDocs,
         arrayUnion, 
         arrayRemove,
        } from "firebase/firestore";

import { 
        updateEmail, 
        EmailAuthProvider, 
        reauthenticateWithCredential 
      } from "firebase/auth";

import { auth, db } from "./config.js";

const provider = new GoogleAuthProvider();

// Login con google
export const loginWhihtGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('Logeado usuario: ', user);
    return user;
  } catch (error) {
    console.log('Error al iniciar sesion: ', error);
  }
}

// Login con mail y contraseña
export const loginConMail = async(dataUser) => {
  try {
    const userLogin = await signInWithEmailAndPassword(auth,dataUser.correo, dataUser.contraseña);
    return userLogin.user
  } catch (error) {
  if (error.code === 'auth/wrong-password') {
    console.log('Contraseña incorrecta');
  } else if (error.code === 'auth/user-not-found') {
    console.log('Usuario no encontrado');
  } else {
    console.log('Error de autenticación', error.message);
  }
  throw error;
}
}
// Cerrar sesion
export const cerrarSesion = async () => {
  signOut(auth).then(() => {
    console.log('Sesion finalizada')
  })
}

// Crear cuenta de correo
export const crearCuentaEmail = async (datosUser) => {
  try {
    const result = await createUserWithEmailAndPassword(auth,datosUser.correo,datosUser.contraseña);
    const user = result.user;
    return user;
  } catch (error) {
    console.log('No se pudo cargar el nuevo usuario: ', error);
  }
}

//Escuchar en tiempo real y ver las categorias
export const getDataCategorias = (callback) => {
  try {
    const unsubscribe = onSnapshot(collection(db,'categorias'), snapshot => {
      const usuarios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
    callback(usuarios);
    //console.log(usuarios)
  })
  return unsubscribe;
  } catch (error) {
    callback([]);
  }
};

// Escuchar cambios en tiempo real y descargarlos
export const getData = (callback) => {
  try {
    const unsubscribe = onSnapshot(collection(db,'productos'), snapshot => {
      const usuarios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
    callback(usuarios);
  })
  return unsubscribe;
  } catch (error) {
    callback([]);
  }
};

export const crearCategorias = async (producto) => {
  try {
    const docRef = await addDoc(collection(db, 'categorias'), {
      ...producto
    
    });
    console.log("✅ Producto agregado con ID:", docRef.id);
  } catch (error) {
    console.error("⛔ Error al guardar producto:", error);
  }
};

export const guardarProducto = async (producto) => {
  try {
    const docRef = await addDoc(collection(db, 'productos'), {
      ...producto      
    });
    console.log("✅ Producto agregado con ID:", docRef.id);
  } catch (error) {
    console.error("⛔ Error al guardar producto:", error);
  }
};
// Borra la categoria o el prodructo seleccionada/o por ID
export const borrarCategoria = async (nombreColeccion,id) => {
  try {
    const docRef = doc(db,nombreColeccion, id);
    await deleteDoc(docRef);
    console.log('categoria eliminada con exito')
  } catch (error) {
    console.log('No se pudo eliminar la categoria')
  }
}

export const editarProducto = async (idProducto, update) => {
  try {
    const docRef = doc(db,"productos", idProducto);
    await setDoc(docRef, update);
  } catch (error) {
    
  }
}

export const editarCategoria = async (idCategoria, update) => {
  try {
    const docRef = doc(db,'categorias', idCategoria);
    await updateDoc(docRef, { categoria: update})
  } catch (error) {
    
  }
}
// Escucha si hay un usuario autenticado
/*
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ UID del admin:", user.uid);
  } else {
    console.log("⛔ No hay usuario logueado");
  }
});
*/