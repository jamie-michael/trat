import {
  getDocs,
  collection,addDoc,setDoc,doc,updateDoc,writeBatch,
  getFirestore,FieldValue,deleteDoc,arrayUnion,getDoc,query,where,WriteBatch,
} from 'firebase/firestore'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { firebaseConfig } from './firebase.config'
  
export const app = firebase.initializeApp(firebaseConfig)
export const db = getFirestore()
  
export const auth = app.auth()
export const provider = new firebase.auth.GoogleAuthProvider()
  
export const getFBColRef = async collectionName => collection(db,collectionName)
export const setFBDoc = async(collectionName,id,data) => await setDoc(doc(db,collectionName,id ? id : null),data)
export const addFBDoc = async(collectionName,data) => await addDoc(collection(db,collectionName),data)
export const updateFBDoc = async(collectionName,id,data) => await updateDoc(doc(db,collectionName,id),data)

export const getFBDoc = async(collectionName,id) => {
  const snapshot = await getDoc(doc(db,collectionName,id))
  return snapshot.data()
}
export const deleteFBDoc = async(collectionName,id) => await deleteDoc(doc(db,collectionName,id)) 
export const getFBDocs = async collectionName => await getDocs(collection(db,collectionName))
export const getFBDocByField = async(collectionName,field,value) => {
  const querySnapshot = await getDocs(query(collection(db,collectionName),where(field,`==`,value)))
  const docs = querySnapshot.docs.map(doc => ({ id: doc.id,...doc.data() }))
  return docs[0]
}
export const getFBDocsByFieldArray = async(collectionName,field,value) => await getDocs(query(collection(db,collectionName),where(field,`array-contains`,value)))
export const getFBDocsByFieldArrayUnion = async(collectionName,field,value) => await getDocs(query(collection(db,collectionName),where(field,`array-contains-any`,value)))

export const batchUpdateFBDoc = async(collectionName,data) => {
  const batch = writeBatch(db)
  data.forEach(item => {
    const docRef = doc(db,collectionName,item.id)
    batch.update(docRef,item)
  })
  await batch.commit()
}
// const generateFBToken = async() => await auth.currentUser.getIdToken(/* forceRefresh */ true)
  
export const getFirebaseCollection = async collectionName => {
  const col = collection(db,collectionName)
  const snapshot = await getDocs(col)
  return snapshot.docs.map(doc => ({ ...doc.data(),id: doc.id,path: doc.ref.path }))
}
  
export const parseCollectionSnaphot = snapshot => { 
  return snapshot.docs.map(doc => ({ ...doc.data(),id: doc.id,path: doc.ref.path }))
}

export const parseDocSnapshot = snapshot => {
  const output = { ...snapshot.data() }

  const recursivelyConvertTimestamps = thing => {
    if(!thing) return thing
    if(thing.seconds) return thing.seconds * 1000
    if(Array.isArray(thing)) return thing.map(t => recursivelyConvertTimestamps(t))
    if(isObject(thing)) Object.keys(thing).forEach(key => thing[key] = recursivelyConvertTimestamps(thing[key]))
    return thing
  }

  return {
    ...recursivelyConvertTimestamps(output),
    id: snapshot.id,
    path: snapshot.ref.path,
  }
}

export const isObject = thing => 
  !(thing instanceof Array) 
  && thing instanceof Object 
  && typeof thing !== `function`
  && thing