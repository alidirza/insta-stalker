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

let selection = 1;

const options = {
  enable: true,
  withWebhook: true,
  webhookURL: `${webhookURL}`,
  webhookType: 'discord', // or 'selfHosted'
  logErrors: true,
};

const nodeStability = new NodeStability(options);

const readline = require('readline');
const { start } = require('repl');
const { count } = require('console');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askUser = () => {
    rl.question('Do you want to just run once or create a schedule? (1/2) ', (answer) => {
        if (answer === '1') {
            // Run the program once
            selection = 1;
            main();
        } else if (answer === '2') {
            rl.question('Enter the number of hours between each run: ', (hours) => {
                // Validate the input
                if (isNaN(hours) || hours < 10/60) {
                    console.log('Invalid input. Please enter a number greater than 0.17 (which is equivalent to 10 minutes).');
                    askUser();
                } else {
                    selection = 2;
                    const numericInterval = hours * 60 * 60 * 1000; // Convert hours to milliseconds
                    const intervalId = setInterval(main, numericInterval);
                    countdown("settime",hours * 60 * 60);
                    countdown("start");
                    rl.question('Type "stop" to cancel the schedule or "status" to check the status: ', function handleResponse(stop) {
                    if (stop.toLowerCase() === 'stop') {
                        selection = 1;
                        clearInterval(intervalId);
                        console.log('Schedule canceled.');
                        rl.close();
                        process.exit(0); // Exit with success status
                    } else if (stop.toLowerCase() === 'status') {
                        countdown("left",hours * 60 * 60);
                        rl.question('Type "stop" to cancel the schedule or "status" to check the status: ', handleResponse);
                    } else {
                        console.log('Invalid command. Please type "stop" or "status".');
                        rl.question('Type "stop" to cancel the schedule or "status" to check the status: ', handleResponse);
                    }
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
        await delay(500, 1000);
    }
    if(biography !== stats.biography){
        sendWebhookMessage("anomaly",undefined,stats.username,"biography",biography,stats.biography)
        await delay(500, 1000);
    }
    if(following !== stats.following){
        sendWebhookMessage("anomaly",undefined,stats.username,"following",following,stats.following)
        await delay(500, 1000);
    }
    if(followers !== stats.followers){
        sendWebhookMessage("anomaly",undefined,stats.username,"followers",followers,stats.followers)
        await delay(500, 1000);
    }
    if(profile_pic !== stats.profile_pic){
        const new_raw_profile_pic = profile_pic.split('.jpg');
        const old_raw_profile_pic = stats.profile_pic.split('.jpg');
        if(new_raw_profile_pic[0] !== old_raw_profile_pic[0]){
            sendWebhookMessage("anomaly",undefined,stats.username,"profile pic",profile_pic,stats.profile_pic)
        }else{
            sendWebhookMessage("pp_id_changed")
        }
        await delay(500, 1000);
    }
    await model.findOneAndUpdate({ username: stats.username }, {$set: { full_name: stats.full_name, biography: stats.biography, following: stats.following, followers: stats.followers, profile_pic: stats.profile_pic }}, { upsert:true}) 

    return stats;
}

async function main() {
  countdown ("start");
  for (let i = 0; i < users.length; i++) {
    const stats = await getUserStats(i);
    console.log(stats);
    sendWebhookMessage("stats", stats);
    if (i == users.length - 1) {
      console.log("Operation is finished");
      if (selection === 2) {
        console.log("Waiting for the next run...");
      }else{
        await delay(5000, 10000);
        process.exit(0); // Exit with success status
      }
    } else {
      await delay(120000, 180000);
    }
  }
}

function delay(min, max) {
    const delayTime = Math.random() * (max - min) + min;

    return new Promise((resolve, reject) => {
        let remainingTime = delayTime;
        const interval = setInterval(() => {
            remainingTime -= 1000;
            if (remainingTime <= 0) {
                clearInterval(interval);
                resolve();
            } else {
                process.stdout.write("\b\b\b\b\b\b"); // Move the cursor back
                const remainingTimeString = Math.round(remainingTime / 1000).toString().padStart(5, ' ');
                process.stdout.write(`${remainingTimeString}s`);
            }
        }, 1000);
    });
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
        case "pp_id_changed":
            content = `:warning: Profile Picture ID Changed. For more information check the readme file.`;
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

let intervalTime;
let remainingTime;
function countdown(action, seconds) {
    if (action === "start") {
        remainingTime = intervalTime;
        return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
        remainingTime -= 1;
        if (remainingTime <= 1) {
            clearInterval(interval);
            resolve();
        }
    }, 1000);
});
    } else if (action === "left") {
        console.log("\nNext run in: ");
        console.log(`${Math.round(remainingTime)} seconds`);
    }
    else if (action === "settime") {
        intervalTime = seconds;
    }
}
