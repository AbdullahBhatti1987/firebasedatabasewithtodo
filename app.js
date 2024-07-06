import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, 
          collection,
          addDoc,
          getDocs,
          doc,
          deleteDoc,
           } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSRPfPEoA2Xkqb1KioExZ-FlGAut4-gJQ",
  authDomain: "todo-application-be5f3.firebaseapp.com",
  projectId: "todo-application-be5f3",
  storageBucket: "todo-application-be5f3.appspot.com",
  messagingSenderId: "97748112941",
  appId: "1:97748112941:web:bcce2ee673b6ef430c4aa4",
  measurementId: "G-L87TYRC00Q",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const appStore = initializeApp(firebaseConfig);
const db = getFirestore(appStore);
const toDos_Box = document.getElementById('toDos_Box');


onAuthStateChanged(auth, (user) => {
  if (user) {
    const user = auth.currentUser;
    const uid = user.uid;
    console.log("User is signed in");
    console.log(user.email)
    if(user !== null){
      userForm.style.display = "none";
      welcome.style.display = "block";
      toDos_Box.style.display = 'block';
      const currentUser = document.getElementById("currentUser");
        currentUser.innerText = user.email;
    }
  } else {
    console.log("User is signed out");
  }
});

// ================Signup Data===================
var signupEmail = document.getElementById("signupEmail");
var signupPassword = document.getElementById("signupPassword");
var signupUser = document.getElementById("signupUser");
var signupDiv = document.getElementById("signupDiv");
var signinDiv = document.getElementById("signinDiv");

signupUser.addEventListener("click", signupForm);
function signupForm() {
  createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value)
    .then((userCredential) => {
      signupDiv.style.display = "none";
      signinDiv.style.display = "block";
      const user = userCredential.user;
      console.log(signupEmail.value);
      logoutUser()
      reset()
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error.message);
      console.log(error.code);
      // ..
    });
}

// ===================Signin Data=====================
var signinEmail = document.getElementById("signinEmail");
var signinPassword = document.getElementById("signinPassword");
var signinUser = document.getElementById("signinUser");
var userForm = document.getElementById("userForm");

signinUser.addEventListener("click", signinForm);
function signinForm() {
  signInWithEmailAndPassword(auth, signinEmail.value, signinPassword.value)
    .then((userCredential) => {
      
      const user = userCredential.user;

      if (user !== null) {
        const email = user.email;
        userForm.style.display = "none";
        welcome.style.display = "block";
        toDos_Box.style.display = 'block';
        const currentUser = document.getElementById("currentUser");
        currentUser.innerText = email;
        reset()
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error.code);
      console.log(error.message);
    });
}

var logout = document.getElementById("logout");
var welcome = document.getElementById("welcome");

logout.addEventListener("click", logoutUser);

function logoutUser() {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      userForm.style.display = "block";
      signinDiv.style.display = 'none';
      signupDiv.style.display = 'block';
      welcome.style.display = "none";
      toDos_Box.style.display = 'none';
    })
    .catch((error) => {
      // An error happened.
    });
}

// =================Login Screen ==================
var loginForm = document.getElementById("login");
loginForm.addEventListener("click", loginScreen);

function loginScreen() {
  signupDiv.style.display = "none";
  signinDiv.style.display = "block";
}


      // ===================User Delete========================
      
      var deleteDb = document.getElementById("deleteDb");
      deleteDb.addEventListener("click", userDeletefromDB);
      
      function userDeletefromDB() {
        console.log('delete ka button chal raha hai');
        
        const user = auth.currentUser;
      
        if (user) {
          const credential = EmailAuthProvider.credential(user.email, prompt("Please enter your password again to confirm deletion:"));
          
          reauthenticateWithCredential(user, credential).then(() => {
            deleteUser(user).then(() => {
              console.log('user deleted');
              welcome.style.display = "none";
              userForm.style.display = "block";
            }).catch((error) => {
              console.log('user not deleted', error);
            });
          }).catch((error) => {
            console.log('reauthentication failed', error);
          });
        } else {
          console.log('No user is signed in');
        }
      }
      

function reset(){
  signupEmail.value = '';
  signinEmail.value = '';
  signupPassword.value = '';
  signinPassword.value = '';
}

// ===============================Firebase Store===========================================

let numbersCollection = collection(db, 'numbers')
let toDosCollection = collection(db, 'toDos')


// addNumberToDB();
async function addNumberToDB(){
  
  try {
    const docRef = await addDoc(numbersCollection,{
      number: Math.round(Math.random()*6),
    }) 
    // console.log("docRef=>", docRef)
    // console.log("Document written with ID: ", docRef.id)
    
  }
catch (e) {
  console.error("Error adding document: ", e);
} 
}
const input_toDo = document.getElementById('toDos')
const add_toDos = document.getElementById('addtoDos')
add_toDos.addEventListener('click', addtoDosToDB)

async function addtoDosToDB(){
  try {
    const obj = {
      todo: input_toDo.value,
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(toDosCollection, obj)
      // console.log('toDos=>', docRef);
      gettoDosFromDb();
      input_toDo.value = '';

}
catch (e) {
  console.error("Error adding document: ", e);
  } 
}
const listtoDos = document.getElementById('listtoDos')

gettoDosFromDb()
async function gettoDosFromDb(){
  try {
    const querySnapshot = await getDocs(toDosCollection);
    listtoDos.innerHTML = '';
    querySnapshot.forEach((doc) => {
      // console.log(doc.id)
      // console.log(doc.data())
      const {todo, createdAt} = doc.data();
      const element = `<li id='${doc.id}'><span class="todo-content">${todo}</span><div class="date-button-container"><span>${new Date(createdAt).toLocaleDateString()}</span><button>X</button</div></li>`;
      listtoDos.innerHTML += element;  
      listtoDos.childNodes.forEach((li)=>{
        // console.log(li.lastChild)
        li.lastChild.addEventListener('click', deletetoDoFromDb)
      })
    });
  } catch (e) {
      console.log(e)
  }
}

async function deletetoDoFromDb(){
    try {
      const docId = this.parentElement.id;
      console.log(docId)
      const docCollection = doc(db, "toDos", docId);
      console.log(docCollection)
      const docRef = await deleteDoc(docCollection);
      console.log('Document deleted', docRef)
      gettoDosFromDb();
    } catch (e) {
      console.log(e)
    }
}
