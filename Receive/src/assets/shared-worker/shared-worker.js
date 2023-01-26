connections = [];
 self.onconnect = connectEvent => {
   const port = connectEvent.ports[0];
 
   connections.push(port);
 
   port.onmessage = messageEvent => {
    
     connections.forEach(connection => {
       connection.postMessage(messageEvent.data);
     });
   }
 };