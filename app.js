// Fill in the required fields and run the script
let users = ['example1', 'example2', 'example3']; //Enter the usernames you want to track
const userAgent = 'Instagram 328.1.3.32.89'; //Don't change this if you don't know what you are doing
const sessionid = '' //Enter your instagram session id here
const webhookURL = ''; //Enter your discord webhook url here
const mongodbkey = ''; //Enter your mongodb connection string here
//
module.exports.mongodbkey = mongodbkey;
const axios = require('axios');
require("./connect.js")();
const connect = require('./connect.js');
const model = require('./model.js');
const NodeStability = require('nodestability');


const options = {
  enable: true,
  withWebhook: true,
  webhookURL: `${webhookURL}`,
  webhookType: 'discord', // or 'selfHosted'
  logErrors: true,
};

const nodeStability = new NodeStability(options);

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askUser = () => {
    rl.question('Do you want to just run once or create a schedule? (1/2) ', (answer) => {
        if (answer === '1') {
            // Run the program once
            main();
        } else if (answer === '2') {
            rl.question('Enter the number of hours between each run: ', (hours) => {
                // Validate the input
                if (isNaN(hours) || hours < 10/60) {
                    console.log('Invalid input. Please enter a number greater than 0.17 (which is equivalent to 10 minutes).');
                    askUser();
                } else {
                    const numericInterval = hours * 60 * 60 * 1000; // Convert hours to milliseconds
                    const intervalId = setInterval(main, numericInterval);

                    rl.question('Type "stop" to cancel the schedule: ', (stop) => {
                        if (stop.toLowerCase() === 'stop') {
                            clearInterval(intervalId);
                            console.log('Schedule canceled.');
                            process.exit(0); // Exit with success status
                        }
                        rl.close();
                    });
                }
            });
        } else {
            console.log('Invalid choice. Please type "1" or "2".');
            askUser();
        }
    });
};

connect(askUser); // connect the program with connect.js and ask the user for input

async function getUserStats(i){
    sendWebhookMessage("spacer");
    const url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${users[i]}`;
    let stats = {username: "", full_name: "", biography: "", following: 0, followers: 0, profile_pic: ""};

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': userAgent,
                'Cookie': `sessionid=${sessionid}`
            }
        });
        const data = response.data;
        console.log(data.data.user);
        stats.username = data.data.user.username;
        stats.full_name = data.data.user.full_name;
        stats.biography = data.data.user.biography;
        stats.following = data.data.user.edge_follow.count;
        stats.followers = data.data.user.edge_followed_by.count;
        stats.profile_pic = data.data.user.profile_pic_url_hd;
    } catch (error) {
        console.error(error);
        console.log(error.response.statusText);
    }
    
    const databaseData = await model.findOne({ username: stats.username })

    let full_name;
    let biography;
    let following;
    let followers;
    let profile_pic;

    if(!databaseData || databaseData == null) {
    console.log("empty database data")
     full_name = "";
     biography = "";
     following = 0;
     followers = 0;
     profile_pic = "";
    } else {
    console.log("Database Data Found")
    full_name = databaseData.full_name;
    biography = databaseData.biography;
    following = databaseData.following;
    followers = databaseData.followers;
    profile_pic = databaseData.profile_pic;
    }
    console.log("Database Data")
    console.log(full_name);
    console.log(biography);
    console.log(following);
    console.log(followers);
    console.log(profile_pic);
    console.log("Insta Data")
    console.log(stats.full_name);
    console.log(stats.biography);
    console.log(stats.following);
    console.log(stats.followers);
    console.log(stats.profile_pic);

    if (full_name !== stats.full_name){
        sendWebhookMessage("anomaly",undefined,stats.username,"full name",full_name,stats.full_name)
    }
    if(biography !== stats.biography){
        sendWebhookMessage("anomaly",undefined,stats.username,"biography",biography,stats.biography)
    }
    if(following !== stats.following){
        sendWebhookMessage("anomaly",undefined,stats.username,"following",following,stats.following)
    }
    if(followers !== stats.followers){
        sendWebhookMessage("anomaly",undefined,stats.username,"followers",followers,stats.followers)
    }
    if(profile_pic !== stats.profile_pic){
        sendWebhookMessage("anomaly",undefined,stats.username,"profile pic",profile_pic,stats.profile_pic)
    }
    await model.findOneAndUpdate({ username: stats.username }, {$set: { full_name: stats.full_name, biography: stats.biography, following: stats.following, followers: stats.followers, profile_pic: stats.profile_pic }}, { upsert:true}) 

    return stats;
}

async function main() {
  for (let i = 0; i < users.length; i++) {
    const stats = await getUserStats(i);
    console.log(stats);
    sendWebhookMessage("stats", stats);
    if (i == users.length - 1) {
      await delay(5000, 7000);
      console.log("Operation is finished");
    } else {
      await delay(60000, 120000);
    }
  }
}

function delay(min, max) {
    const delayTime = Math.random() * (max - min) + min;
    console.log(`Waiting for ${(delayTime / 1000).toFixed(0)} seconds`);
    return new Promise(resolve => setTimeout(resolve, delayTime));
}


function sendWebhookMessage(type, stats, username,content,old_data,new_data){
    const currentDate = new Date();

    switch(type){
        case "anomaly":
            content = `:warning: :warning: :warning: Anomaly detected. Username: ${username}, Content: ${content}, Old Data: ${old_data}, New Data ${new_data}`;
            break;
        case "stats":
            content = `Date and Time: ${currentDate}\nUsername: ${stats.username}\nFull Name: ${stats.full_name}\nBiography: ${stats.biography}\nFollowing: ${stats.following}\nFollowers: ${stats.followers}\nProfile Picture: ${stats.profile_pic}`;
            break;
        case "spacer":
            content = `--------------`;
            break;
        default:
            console.log("Invalid type");
    }

    const message = { content };

    axios.post(webhookURL, message)
        .then(response => {
            console.log(`Status: ${response.status}`);
            console.log('Body: ', response.data);
        })
        .catch(error => {
            console.error(`Error: ${error}`);
        });
}