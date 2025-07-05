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
        updatePassword, 
        EmailAuthProvider, 
        reauthenticateWithCredential 
        } from "firebase/auth";

import { 
        updateEmail, 
       
        
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
    console.log('Error de autenticación', error.message, error.code);
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
  const categorias = {
    categoria: producto.categoria,
    urlImg: producto.urlImg
  }
  try {
    const docRef = await addDoc(collection(db, 'categorias'), {
      ...categorias
    
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
 
export const guardarPrecioEnvio = async (costo) => {
  const envio = {
    envio: costo,
  };

  try {
    // Documento con ID fijo "precio"
    const envioRef = doc(db, 'envio', 'precio');

    // Crea o actualiza ese documento
    await setDoc(envioRef, envio);

    console.log("✅ Precio de envío guardado correctamente");
  } catch (error) {
    console.error("⛔ Error al guardar el precio de envío:", error);
  }
};


// cambiar contraseña
export const cambiarContrasena = async (user, contraseñaActual, nuevaContrasena) => {

  try {
    // Reautenticar al usuario con la contraseña actual
    const credencial = EmailAuthProvider.credential(user.email, contraseñaActual);
    await reauthenticateWithCredential(user, credencial);

    // Actualizar la contraseña
    await updatePassword(user, nuevaContrasena);
    console.log("Contraseña actualizada correctamente");
  } catch (error) {
    console.error("Error cambiando la contraseña:", error);
    throw error;
  }
};

// cambiar correo
export const cambiarCorreo = async (user, contraseñaActual, nuevoCorreo) => {
  console.log("Proveedor de autenticación:", user.providerData);

  try {
    // Reautenticar al usuario con la contraseña actual
    const credencial = EmailAuthProvider.credential(user.email, contraseñaActual);
    await reauthenticateWithCredential(user, credencial);

    // Actualizar el correo electrónico
    await updateEmail(user, nuevoCorreo);
    console.log("Correo electrónico actualizado correctamente");
  } catch (error) {
    console.error("Error cambiando el correo electrónico:", error);
    throw error;
  }
};

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