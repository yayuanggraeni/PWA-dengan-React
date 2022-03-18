importScripts('idb.js');
/*installing the service worker*/
//On Install you fire the Pre-Caching thing. On Fetch you will fire the code for Dynamic Caching
self.addEventListener('install', function(event){
console.log('[Service Worker] - [Installing the Service worker event]',event)

//const cache1 =  caches.open('my-cache');

event.waitUntil(
    caches.open('mystaticcachev1')
        .then(function(cache)
        {
            //IMP: One fails all fails
            cache.addAll([
            '/',
            '/app.js',
            '/index.html',
            '/manifest.json',
            'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js', 
            'https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js',
            'https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js',
            'images/DailyNewz.jpeg',
            'images/dnatech.jpeg',
            'images/function.jpeg',
            'images/futurechange.jpeg',
            'images/imagehands.jpeg',
            'images/probing.jpeg',
            'images/techeducation.jpeg',
            'images/techfuture.jpeg',
            'images/techfuture1.jpeg',
            'images/technology.jpeg',
            '/idb.js'
            ]
        );

        
      
      
            
                console.log('[Service Worker] PreCaching');

                
              

        /*         
                cache.add('/');
                cache.add('/app.js');
                cache.add('/index.html');
            
           
                //add these separately    
                cache.add('https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js');
                cache.add('https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css');
                cache.add('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js');
                cache.add('https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js');
                //add these separately
 
                cache.add('images/DailyNewz.png');
                cache.add('images/dnatech.png');   
                cache.add('images/function.jpeg');
                cache.add('images/futurechange.jpeg');
                cache.add('images/imagehands.jpeg');
                cache.add('images/probing.jpeg');
               
                cache.add('images/techeducation.jpeg');
                cache.add('images/techfuture.jpeg');
                cache.add('images/technology.jpeg');
                cache.add('images/topplayers.jpeg');
            */
 
        })
)

});

self.addEventListener('activate',function(event){
    console.log('[Service Worker] - Activation event fired',event);
   
});








//cache first strategy! 
self.addEventListener('fetch',function(event){

  
    
    event.respondWith(
        caches.match(event.request) 
            .then(function(response) 
            {
                 if(response) 
                 {
                     console.log('[Service Worker]: Came here for Cache API');
                     return response; //RETURN THE RESPOPONSE FROM THE CACHE - CACHE HIT
                     
                 }
                
                 return fetch(event.request)
                 .then(function(response){
                       //see first if you have a valid response
                       if(response.status==200){
                           return response
                       }

                //clone the response object
                //???
                //Double comsume a single stream
                var myresponsecopy = response.clone();
                caches.open('mystaticcachev1')
                .then(function(mycache){
                    //Cache.put(event.request,myresponsecopy);
                    cache.put(event.request,myresponsecopy);

                    
                })
                    return response;
                    }
                 );
                })
        );


        //caches.delete('mystaticcachev1');

        // trimcache('mystaticcachev1',8); //put it without quotations and show debug
});

//NETWORK STRATEGY
//THE SERVICE WORKER LISTENS TO THE FETCH EVENT, THEN GOES STRAIGHT TO THE NETWORK AND RETURNS THE RESPONSE

// self.addEventListener('fetch',function(event){

//     event.respondWith(
//         fetch(event.request).then(
//                     function(networkresponse)
//                     {
//                         return(networkresponse)
 
//                     }
//         ).catch(
//             function(reason)
//             {
//                 console.log("some problem"+ reason);
//             }
//         )
        

//     )

// });





          //Back Ground Sync
          //Scenario: You fill up a form offline and you hit submit
          //The moment you have connectivity that form is submitted in the background
          //STEPS
          //1- Register for a sync event
          //2- Listen for a Sync Event
          //3- Question: Where do you listen for Sync event? - Answer - Service worker!!!
          //4- The moment we have internet connectivity the Sync event fires
          //5- The moment sync event fires we call our own custom function where we do whatever we want to do!

// self.addEventListener('sync',function(event){
//                                 //the code that will execute when the call back function is called
//                                 console.log('aaya')
//                                 if(event.tag == 'send-messages')
//                                         {
//                                             //inside the IF block scope
//                                             event.waitUntil(doSomeStuff());    
//                                         }


//                                 }
// );

//here it is always listening to the sync task the moment service worker is registered
//the sync event is put in queue on the click of the button on letter to the editor
//service worker is always listening for sync event
//even of we close the tag it will be executed
self.addEventListener('sync', function(event) {
    if (event.tag == 'send-messages') {
      event.waitUntil(doSomeStuff());
      //event.waitUntil(newdoSomeStuff());
    }
  });





function doSomeStuff(){
    // console.log('this function will do something...well it will push the data from indexDB to the Cloud DB storage! We will see next');
    //this will be the function which will pull all records from Index DB and push them to Firebase Cloud Database
    console.log("Tis is where you push to the Firebase.Cloud server");

    var dataArray=[];

    var js_address,js_body,js_city,js_email,js_id,js_name,js_state,js_subject;

    readAllData('LetterForm')
    .then(function(data)
                    {
                        //everything you write here is within the scope of this function
                        //data has all the data from what is returned from readall function
                        for( var key in data)
                        {
                            //console.log(data[key]);
                            //Push all the values inside the dataarray array that we have created
                            dataArray.push(data[key]);
                        }        
                            // console.log(dataArray[0]['address']);
                            // console.log(dataArray[0]['body']);
                            // console.log(dataArray[0]['city']);
                            // console.log(dataArray[0]['email']);
                            // console.log(dataArray[0]['id']);
                            // console.log(dataArray[0]['name']);
                            // console.log(dataArray[0]['state']);
                            // console.log(dataArray[0]['subject']);
                        
                            js_address = dataArray[0]['address'];
                            js_body = dataArray[0]['body'];
                            js_city= dataArray[0]['city'];
                            js_email= dataArray[0]['email'];
                            js_id= dataArray[0]['id'];
                            js_name= dataArray[0]['name'];
                            js_state= dataArray[0]['state'];
                            js_subject= dataArray[0]['subject'];

                            var obj =   {
                                        "address": js_address,
                                        "body" : js_body,
                                        "city" : js_city,
                                        "email" : js_email,
                                        "id" : js_id,
                                        "name" : js_name,
                                        "state" : js_state,
                                        "subject" :js_subject
                                     }
                    
                                     //stay within the .then call back function
                                     fetch('https://pwa2-985cf.firebaseio.com/pwa2-985cf.json',{
                                           method:'POST',
                                           headers: {
                                               'Content-Type':'application/json',
                                               'Accept':'application/json',
                                               'mode':'no-cors'
                                           },
                                           body:JSON.stringify(obj)

                                     }).then(function(myresult){
                                                                console.log("Fetch sucessfully executed");
                                                                return Promise.resolve();
                                                                }
                                     ).catch(function(error){
                                                                console.log("problem posting data to the cloud database!");

                                                            }
                                     );
                    
                    }).catch(function(errorinreadall){
                                                    console.log('Some problem encountered in Read All data call');

                                                    }
                    )

}

function readAllData(st)
{
    console.log('inside read all data');
    var dbPromise =  idb.open('letter-to-the-editor');
    return dbPromise
    .then(function(db)
            {
                console.log('inside the read all call back function');
                var tx = db.transaction(st,'readonly');
                var store = tx.objectStore(st);
                return(store.getAll());
            }
    )
}




//original one which is working. New one below
function doSomeStuff1(){
    console.log("This is where you push to FireBase/Cloud server ");
    var dataArray=[];

    var js_address,js_body,js_city,js_email,js_id,js_name,js_state,js_subject; //declare at function level
     //problem i am getting IDB is not defined
     readAllData('LetterForm')
     .then(function(data){
         //console.log(data[0]);
         //data[0] //pehlie row lay kar aaye ga
         for(var key in data){
             //console.log(data[key]);
             dataArray.push(data[key]);
         }
         console.log(dataArray[0]['address']);
         console.log(dataArray[0]['body']);
         console.log(dataArray[0]['city']);
         console.log(dataArray[0]['email']);
         console.log(dataArray[0]['id']);
         console.log(dataArray[0]['name']);
         console.log(dataArray[0]['state']);
         console.log(dataArray[0]['subject']);

         js_address=dataArray[0]['address'];
         js_body=dataArray[0]['body'];
         js_city=dataArray[0]['city'];
         js_email=dataArray[0]['email'];
         js_id=dataArray[0]['id'];
         js_name=dataArray[0]['name'];
         js_state=dataArray[0]['state'];
         js_subject=dataArray[0]['subject'];

         //original:https://pwa-1-3384b.firebaseio.com/pwa-1-3384b.json
         //https://pwa2-985cf.firebaseio.com/pwa2-985cf.json
         //because of a variable scope problem putting this inside the function of readall
         //importat
         var obj = { "address": js_address,  "body": js_body, "city":js_city,"email":js_email,"id":js_id,"name":js_name,"state":js_state,"subject":js_subject };
         fetch('https://pwa2-985cf.firebaseio.com/pwa2-985cf.json', {
             method:'POST',
             headers: {
                 'Content-Type': 'application/json',
                 'Accept': 'application/json',
                 'mode':'no-cors'
                 },
             body:JSON.stringify(obj)
         }).then(function(myresult){
             console.log("Fetch sucessfully executed");
             return Promise.resolve();
         }).catch(function(error){
             console.log("problem so comming here");
         });

        //  for (var i in dataArray) 
        //     {
        //         console.log("row " + i);
        //         for (var j in dataArray[i]) 
        //             {
        //                 console.log("value of J " + j);
        //             console.log(" " + dataArray[i][j]);
        //             }
        //     }

     }).catch(function(error)
     {
         console.log('some problem encountered in Read all data call');
     }
     )


    //return Promise.resolve();
}


//new one: first reolve erros them come back to this one
function newdoSomeStuff(){
    console.log("This is where you push tp server ");
   
   

    
}

// PROBLEM I am getting IDB is not defined
function readAllData1(st){
    console.log('inside read all data');
    var dbPromise = idb.open('letter-to-the-editor');
    return dbPromise
    .then(function(db){
        console.log('inside read all function');
        var tx=db.transaction(st,'readonly');
        var store=tx.objectStore(st);
        return(store.getAll()); //sari rows jo database mai hain return honge
    })
}