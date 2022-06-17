# [Citrus Financial](https://citrus.financial)

#### Development Environment/Tools
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-%20-blue?style=for-the-badge&logo=visual-studio-code&logoColor=white&color=007acc) ![GitHub](https://img.shields.io/badge/Github-%20-blue?style=for-the-badge&logo=github&logoColor=white&color=181717) ![React](https://img.shields.io/badge/React-%20-blue?style=for-the-badge&logo=react&logoColor=white&color=61dafb) ![Node.js](https://img.shields.io/badge/NodeJs-%20-blue?style=for-the-badge&logo=node.js&logoColor=white&color=339933) ![Git](https://img.shields.io/badge/git-%20-blue?style=for-the-badge&logo=git&logoColor=white&color=F05032)

#### Databse Deployment/Management
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%20-blue?style=for-the-badge&logo=postgresql&logoColor=white&color=4169e1)

#### Development Languages
![JavaScript](https://img.shields.io/badge/JavaScript-%20-blue?style=for-the-badge&logo=javascript&logoColor=white&color=f7df1e) ![CSS3](https://img.shields.io/badge/CSS3-%20-blue?style=for-the-badge&logo=css3&logoColor=white&color=1572b6) ![SASS](https://img.shields.io/badge/sass-%20-blue?style=for-the-badge&logo=sass&logoColor=white&color=cc6699) ![HTML5](https://img.shields.io/badge/HTML5-%20-blue?style=for-the-badge&logo=html5&logoColor=white&color=e34f26)

#### Web Hosting
![Amazon Web Services](https://img.shields.io/badge/Amazon%20Web%20Services-%20-blue?style=for-the-badge&logo=amazon-aws&logoColor=white&color=232f3e)

## Meet Development Team

### Lead Software Developers ([Joe Dobbelaar](https://github.com/r2pen2)) and ([Oliver Risch](https://github.com/oliver-risch))
Something about the two of us...

## Developer Manual

#### Displaying Notifications
Notifications are displayed in the NotificationContainer that lies outside the routes in App.js. Notifications can be created by any component and will display as an overlay on the entire application. 

In order to create a notitification, NotificationManager must be imported.
```js
import NotificationManager from 'react-notifications';
```

After it has been imported, notifications can be displayed by calling the following functions.
```js
NotificationManager.success("This one is green!", "Notification title...");
NotificationManager.info("This one is blue!", "It can have a different title, too!");
NotificationManager.warning("This one is orange.", "Maybe not the worst thing, but we thought we'd let you know.");
NotificationManager.error("This one is red!", "The sky is falling!");
```

There are a few other props, but they are currently unused in this application: timeOut, callback, and priority.
The order is as follows: NotificationManager.success(message, title, timeOut, callback, priority);
```js
NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);                         // Closes after 3 seconds
NotificationManager.error('Error message', 'Click me!', 5000, () => { console.log("Ouch!"); });     // Closes after 5 seconds and has an on-click event
NotificationManager.error('High priority', 'Title', 1000, () => {}, true);                          // Priority is a boolean— high priority notifications are displayed at the top