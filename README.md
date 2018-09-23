# Hello and Welcome!
Meteor-Tuts is one of the projects closest to our hearts designed as a useful tool for any programmer
that wants to step up his/her game. Navigating through this complex but rather easy to understand tutorial you will be 
accompanied by video tutorials for each chapter and for that access www.meteor-tuts.com. 
We recommend you to take it step by step in order to achieve a better understanding and mastery of the MeteorJS framework, so
we created for you several branches, each of them being an iteration of the tutorial

# Installation
- Clone this repository
- Make sure you have installed meteor, if you don't have it: https://www.meteor.com/ 
- Go in the root directory of this project and run the following commands

```bash
meteor npm install # to install all the dependencies
npm run start # to run the project
```

Roger's addendum:

If the project does not "build" into a Meteor application 
and you see errors from the Meteor system, you may need to add three extra Meteor packages. 
These Meteor packages are mentioned in the Meteor configuration files for this project
(in the .meteor/packages file). They are not listed in the "package.json" file.

The "meteor npm install" command might add these extra Meteor packages automatically; 
I'm not quite sure.

The first Meteor package helped me to simplify the queries I make to the Mongo DB.

You can add that package to your Meteor system with this command:
meteor add cultofcoders:grapher


The second Meteor package should help me to automate certain tasks
that I want to happen before and after modifications to the data in the database.

You can add that package to your Meteor system with this comment:
meteor add matb33:collection-hooks


The third Meteor package helps me to run and view the results
of my unit tests. I wanted some assurance that my database queries and commands
returned the expected results regardless of my choice and implementation of any GUI. 

You can add that package to your Meteor system with this command:
meteor add cultofcoders:mocha

