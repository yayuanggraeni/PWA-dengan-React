
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/sw.js'); /* slash to make sure we goto the root folder*/
//                                                 /*register is asynchronous, it returns a promise, dosent finish immediately*/                                            
//     console.log("Service Worker Registered");
//   }else{
//     console.log("Service Worker could not be Registered");
//   }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(function()
            {
                console.log("Service Worker Registered");
            }
            ).catch((reason) =>
                {
                    console.log("some problem" + reason);
                }
                )
        }

        function myFunction(){
       
           //alert('comming inside myfunction');
           if (!('indexedDB' in window)) {
              //indexDB is not supported and this functionality cannot be used!
              console.log('This browser does not support INDEXDB database');
            
          }else{
              //perform the necessary operations that I want my function to do
              console.log('This browser fully support INDEXDB database!');
              //idb.open
              //one database per application and it can have many object stores. 
              //idb.open(name, version, upgradecallback-optional)
              //a promise is returned from idb.open
              //name: name of the datavase
              //version numbers usually change when you make structural modifications to your database
            var dbPromise = idb.open('letter-to-the-editor', 2, function(upgradeDb) {
                switch (upgradeDb.oldVersion) {
                  case 0:
                      //THIS IS THE FIRST TIME I HAVE CREATED THE DB
                      console.log('creating the letter to the editor Obkect store');
                  case 1:
                    
                    console.log('Creating the LetterEditor object store');
                    upgradeDb.createObjectStore('LetterForm', {keyPath: 'id'});
              
                }
              });
                //START POPULATING THIS OBJECT STORE / TABLE WITH SOME SAMPLE DATA THAT WE HAVE FILLED IN THE LETTER TO THE EDITOR FORM
              dbPromise.then(function(db) {
                 //transaction
                //read / write or read/write
                //where this read and write transaction is going to be perdormed? Can you guess where?
                //will the transaction be on a database or should the transaction be on an object store?? can you guess?
                //Answer: Object Store
                var tx = db.transaction('LetterForm', 'readwrite'); 
                var store = tx.objectStore('LetterForm'); 
                  //get all the items from the lettertotheeditor.html file and push them as a transaction inside the local index DB object store
                //then from there onwards we will use background sync and sync all this data to the cloud firestore
                var items = [
                  {
                    
                    id: 'cch-blk-ma656565',
                    subject: document.getElementById("myForm").elements.namedItem("nm_subject").value,
                    body: document.getElementById("myForm").elements.namedItem("nm_letterbody").value,
                    name: document.getElementById("myForm").elements.namedItem("nm_idname").value,
                    address: document.getElementById("myForm").elements.namedItem("nm_idaddress").value,
                    city: document.getElementById("myForm").elements.namedItem("nm_idcity").value,
                    state: document.getElementById("myForm").elements.namedItem("nm_idstate").value,
                    email: document.getElementById("myForm").elements.namedItem("nm_idemail").value
                    
                  }
                ];

                //ADD each object to the store inside the promise.all
                //isko explain karna hai yahan say
                return Promise.all(items.map(function(item) {
                    //console.log('Adding item: ', item);
                    //console.log('All items added successfully!');
                    return store.add(item); //adding the object
                    
                  })
                ).catch(function(e) {
                  tx.abort();
                  console.log(e);
                })
                // .then(function() {
                //   console.log('All items added successfully!');
              
                // });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
              });
          }
          registersyncevent();
         
 }

          //Back Ground Sync
          //Scenario: You fill up a form offline and you hit submit
          //The moment you have connectivity that form is submitted in the background
          //STEPS
          //1- Register for a sync event
          //2- Listen for a Sync Event
          //3- Question: Where do you listen for Sync event? - Answer - Service worker!!!
          //4- The moment we have internet connectivity the Sync event fires
          //5- The moment sync event fires we call our own custom function where we do whatever we want to do!


function registersyncevent(){
//we will register the background sync task in this function. 
//Then inside the service worker we will listen for the background sync event, when it fires, we will do some stuff :)

if('serviceWorker' in navigator){
  //it means service worker is present. We can now safely register the sync task
  navigator.serviceWorker.ready.then(function(registration){
                                      //inside the call back function
                                      //1-(a)to register a task you should give it some unique name
                                      //each background sync task is given a unique tag name. Important: Tag name must BE UNIQUE!!!
                                      //Sync Manager - to access the SyncManager you need to have access to the active service worker!
                                      //the reason to use background sync is to move actions away from the web page and into the background
                                      //so long as your web browser is installed on your system, the background sync event will fire, even if the user navigates away from the page.
                                      //you should consider background sync for all the things that you want to take care of, be it an event to the calender, a todo list or submitting a form!  

                                      registration.sync
                                      .register('send-messages')
                                      .then(function(){
                                                        return registration.sync.getTags();
                                                      })
                                      .then(function(tags){
                                                          console.log(tags)
                                                          }
                                      )                  

  })
}



}

       






        function deletecache(){
            console.log("Delete the cache");
           
        }

        function deleteserviceworker(){
            if('serviceWorker' in navigator)
            {
                navigator.serviceWorker.getRegistrations().then(function(myregistrations){
                    for(let myactualregistrations of myregistrations){
                        myactualregistrations.unregister()
                    }
                })

            }

        }


        

        




   


  