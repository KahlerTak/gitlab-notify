# Gitlab Notify
## Stay Informed in Real Time
GitLab Notifier keeps you updated with important events across your GitLab projects — directly in your browser.

Whenever a merge request you're involved in receives updates or requires your attention, the extension sends you a native push notification. No more missed reviews, comments, or approvals.

Key features:

🔄 Real-time GitLab API integration

📬 Notifications for updated merge requests that need your input

🧩 Works seamlessly with self-managed or hosted GitLab instances

📈 Future updates will include additional notification types for issues, pipelines, and more

Perfect for developers and teams who want to stay on top of their GitLab activity — without constantly switching tabs.

## What can it do?

The plugin checks for updates in Gitlab Merge Requests where the user is assigned as a reviewer, whose private token is 
configured in the plugin. It will send desktop Notifications, when there was a new commit.

## What is planned?

* Add configuration for different notification types
* Add support for comment updates in the merge request for new notifications
* Add support for re-requesting reviews 
* Add support for review requests assigned to the user and notify that user if any update was made to the merge request
* Add live statistics about current merge requests and their status

## Development Hints

Clone the repository to a local directory or download the zip file.

make sure that npm is installed and run:
```
npm install
```

### For a single build
#### Manifest Version 2
For firefox or browsers supporting only manifest version 2 run the following:
```
npm run build:v2
```
#### Manifest Version 3
For chrome and browsers supporting manifest version 3 run the following:
```
npm run build:v3
```

### For a continuous development
#### Manifest Version 2
For firefox or browsers supporting only manifest version 2 run the following:
```
npm run watch:v2
```
#### Manifest Version 3
For chrome and browsers supporting manifest version 3 run the following:
```
npm run watch:v3
```

### For creating a release file
#### Manifest Version 2
For firefox or browsers supporting only manifest version 2 run the following:
```
npm run release:v2
```
#### Manifest Version 3
For chrome and browsers supporting manifest version 3 run the following:
```
npm run release:v3
```
