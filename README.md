# Insta-Stalker
Insta-Stalker is a program for automated stalking and tracking the instagram users stats(post, following, followes, bio etc.).

## Features:

Program can track and store stats of users with MongoDB.

Receive webhook when an anomaly detected in stats.

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
Open discord web and create a new server.

Open server setting and click Integrations.

Create a new webhook and copy the url.

Paste the webhook url at code.

<details>
<summary>
Video
</summary>
  
https://github.com/alidirza/insta-stalker/assets/38112259/fc218216-1b9a-420f-8577-77e6d723c136
  
</details>

### Instagram:
Open instagram web and login.

Open web inspector and enter the Applications tab

Click cookies and find the instagram's session id.

Copy the session id and paste at code

<details>
<summary>
Video
</summary>
  
https://github.com/alidirza/insta-stalker/assets/38112259/43d6e559-8494-43be-b97e-5c5b360cd179

</details>

### MongoDB:
Deploy your database.

Copy the password and press "Create Databse User".

Go to Network Acces under the Security tab.

Press "Add IP Adress" then click "Allow Access From Anywhere" and then press confirm

Go to Database under the Deployment tab.

Click Connect and select Drivers.

Copy the connection string and then change the "< password > " with your saved password.

Paste at code

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
