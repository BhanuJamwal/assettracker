const mqtt = require('mqtt');
const { faker } = require('@faker-js/faker');

// MQTT broker URL
const brokerUrl = 'mqtts://dmp-tata.orbiwise.com:8883'; // You can use any public or local MQTT broker

// MQTT topic
const topic = 'assettracker';

// Connect to the MQTT broker
const client = mqtt.connect(brokerUrl,{"username":"4k9UgYKe2bom5YIw0m68vWX3V","password":"p9G8Y58qPbjhgG2PVcHsCf6HMqKZ"});

client.on('connect', () => {
  console.log('Connected to MQTT broker');
 client.subscribe("alert",()=>{
    console.log("subscribed!")
 })
  // Simulate asset data every 5 seconds
  setInterval(() => {
    const assetData = generateAssetData();
    publishData(assetData);
  }, 5000);
});
client.on('message',(message)=>{
    console.log(message,"here comes the downstream")
})
client.on('error', (err) => {
  console.error('Connection error: ', err);
  client.end();
});
var speedValue = 0
var increment = true
// Generate fake asset data
function generateAssetData() {
  const data =  incrementDecrementLoop(speedValue,increment)
  speedValue = data.value
  increment = data.increment
  return {
    deviceId: "assettrackertata289601",
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    speed: speedValue,
    timestamp: new Date().toISOString()
  };
}

// Publish data to the MQTT topic
function publishData(data) {
  const payload = JSON.stringify(data);
  client.publish(topic, payload, { qos: 1 }, (err) => {
    if (err) {
      console.error('Failed to publish data: ', err);
    } else {
      console.log('Data published: ', payload);
    }
  });
}


function incrementDecrementLoop(value,increment) {
    //let value = 0;
    //let increment = true;
  
    //while (true) {
      //console.log(value);
  
      if (increment) {
        value += 5 ;
        if (value >= 100) {
          increment = false;
        }
      } else {
        value-= 5;
        if (value <= 0) {
          increment = true;
        }
      }
      return {value,increment}
  
      // Sleep for a short period to make the loop observable
      //await new Promise(resolve => setTimeout(resolve, 100));
    //}
  }


  