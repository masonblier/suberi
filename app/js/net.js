var net = window.net = {};
var ws;

net.connect = function(){
  ws = new WebSocket('ws://'+window.location.hostname+
    (window.location.port ? ':'+window.location.port : '')
    +window.location.pathname+'multiplayer');
  ws.addEventListener('open', function(){
    net.emitEvent('open');
  });
  ws.addEventListener('close', function(){
    net.emitEvent('close');
  });
  ws.addEventListener('message', function(e, flags){
    net.emitEvent('message', JSON.parse(e.data));
  });
};
net.disconnect = function(){
  if (ws) ws.close();
};

net.send = function(obj){
  if (ws) {
    ws.send(JSON.stringify(obj));
  } else {
    throw new Error("websocket not connected");
  }
};

net.listeners = {};
net.addEventListener = function(eventName, listener){
  if (!net.listeners[eventName]) net.listeners[eventName] = [];
  net.listeners[eventName].push(listener);
};
net.removeEventListener = function(eventName, listener){
  if (net.listeners[eventName]) {
    for (var li = 0; li < net.listeners[eventName].length; ++li) {
      if (net.listeners[eventName][li] === listener) {
        net.listeners[eventName].splice(li, 1);
        break;
      }
    }
  }
};
net.emitEvent = function(eventName, arg){
  if (net.listeners[eventName]) {
    net.listeners[eventName].forEach(function(listener){
      listener(arg);
    });
  }
};
