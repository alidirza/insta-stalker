# Insta-Stalker
Insta-Stalker is a program for automated stalking and tracking of Instagram users' stats (posts, following, followers, bio, etc.).

## Features:

The program can track and store stats of users with MongoDB.

Receive a webhook when an anomaly is detected in stats.

Run the program periodically and track stats with automation.

## Instalation:
### Download:
```shell
git clone https://github.com/alidirza/insta-stalker.git && cd insta-stalker
npm install
```

<details>
<summary>
Video
</summary>
  
https://github.com/alidirza/insta-stalker/assets/38112259/8de75f78-3abe-4ef3-8ea8-bb5e60797201
  
</details>

### Webhook:
Open Discord's web application and create a new server.

Open server settings and click on Integrations.

Create a new webhook and copy the URL.

Paste the webhook URL in the code.

<details>
<summary>
Video
</summary>
  
https://github.com/alidirza/insta-stalker/assets/38112259/fc218216-1b9a-420f-8577-77e6d723c136
  
</details>

### Instagram:
###### Note: Don't use your main account, you might get banned.
###### Note: Session IDs change every time you log out or switch accounts.
Open Instagram's web application and log in.

Open the web inspector and enter the Applications tab.

Click on cookies and find Instagram's session ID.

Copy the session ID and paste it in the code.

<details>
<summary>
Video
</summary>
  
https://github.com/alidirza/insta-stalker/assets/38112259/43d6e559-8494-43be-b97e-5c5b360cd179

</details>

### MongoDB:
Deploy your database.

Copy the password and click on "Create Database User".

Go to Network Access under the Security tab.

Click on "Add IP Address", then click "Allow Access From Anywhere" and confirm.

Go to Database under the Deployment tab.

Click on Connect and select Drivers.

Copy the connection string and then replace "< password >" with your saved password.

Paste it in the code.

<details>
<summary>
Video
</summary>
  
https://github.com/alidirza/insta-stalker/assets/38112259/1473d39f-e0e6-4d21-aeb2-b6ab35ede472

</details>

## Dependencies:

NodeJS

Axios

Mongoose

Nodestability

## Compatibility:

Cross-platform compatibility (Windows, macOS, Linux)

## License:

Insta-Stalker is open-source software distributed under the MIT License, allowing for free use and modification.
