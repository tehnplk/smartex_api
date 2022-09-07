const mqtt = require('mqtt');
var moment = require('moment');
const { now } = require('moment');

const config = require('./config.json')

var mqtt_broker = "mqtt://" + config.mqtt.broker;
var mqtt_topic = config.mqtt.topic

class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = mqtt_broker;
    this.port = 1883;
    //this.clientId = 'smartex_nodejs';
    //this.username = 'YOUR_USER'; // mqtt credentials if these are needed to connect
    //this.password = 'YOUR_PASSWORD';

    this.connect()
  }

  connect() {
    var now = moment().format('YYYY_MM_D_H_mm_ss');
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, {
      clientId: `client-${now}`,
      keepalive: 5000,
      reconnectPeriod: 500,
      rejectUnauthorized: false
    })

    // Mqtt error calback
    this.mqttClient.on('error', (err) => {
      var now = moment().format('YYYY-MM-D H:mm:ss');
      console.log(now, 'mqtt', err);
      this.mqttClient = mqtt.connect(this.host)
      //this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      var now = moment().format('YYYY-MM-D H:mm:ss');
      console.log(now, 'mqtt', config.mqtt.broker, mqtt_topic, 'is connected');
    });

    // mqtt subscriptions
    this.mqttClient.subscribe(mqtt_topic, { qos: 0 });

    // When a message arrives, console.log it
    this.mqttClient.on('message', function (topic, message) {
      var now = moment().format('YYYY-MM-D H:mm:ss');
      console.log(now, 'mqtt on msg ', message.toString());
    });

    this.mqttClient.on('close', () => {
      var now = moment().format('YYYY-MM-D H:mm:ss');
      console.log(now, `mqtt client disconnected`);
    });
  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(message) {
    this.mqttClient.publish(mqtt_topic, message);
  }
}

module.exports = MqttHandler;