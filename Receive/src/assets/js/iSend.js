var bc;
var myEventEmitter;
var debugMode = false;
var Window
var iSend = {
  init: function () {
    console.log("iSend start...");
    bc = new BroadcastChannel('internal_noti')
    myEventEmitter = new MyEventEmitter();
    if (is_iFrame()) {
      Window = window
      // รับ message และส่งข้อมูลจาก iframe ไปยังหน้าหลักที่เรียกฝั่ง iframe
      bc.addEventListener('message', msg => window.parent.postMessage(msg.data, "*"));
      // // รับคำสั่งจากหน้าที่เรียก iframe มาเพื่อให้ส่งต่อข้อความ
      window.addEventListener("message", (msg) => {
        if (msg.data.action) {
          debugLog(msg.data);
          bc.postMessage(msg.data);
        }

      });
    } else {
      // หน้าหลักใช้สำหรับรับข้อความที่ถูกส่งต่อมาจาก iframe
      bc.addEventListener('message', (msg) => {
        debugLog(msg.data);
        myEventEmitter.emit(msg.data.action, msg.data);
      });
    }
  },

  getEventEmitter() {
    return myEventEmitter;
  },
  developMode() {
    debugMode = true;
  },
  broadcast(msg) {
    bc.postMessage(msg);
  },


};

function debugLog(logMessage) {
  if (debugMode) {
    console.log(logMessage);
  }
}

function is_iFrame() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

class MyEventEmitter {
  constructor() {
    this._events = {};
  }

  on(name, listener) {
    if (!this._events[name]) {
      this._events[name] = [];
    }

    this._events[name].push(listener);
  }

  removeListener(name, listenerToRemove) {
    if (!this._events[name]) {
      throw new Error(`Can't remove a listener. Event "${name}" doesn't exits.`);
    }

    const filterListeners = (listener) => listener !== listenerToRemove;

    this._events[name] = this._events[name].filter(filterListeners);
  }

  emit(name, data) {
    if (!this._events[name]) {
      throw new Error(`Can't emit an event. Event "${name}" doesn't exits.`);
    }

    const fireCallbacks = (callback) => {
      callback(data);
    };

    this._events[name].forEach(fireCallbacks);
  }
}
