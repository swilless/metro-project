# Metro Project 2016
1. Change directory into the project root directory and run "npm install". This will download all node dependencies.
2. Create a file in the project root directory named "config.json" with the following contents:

    {
     "express": {
       "port": 8000,
       "auth": {
          "username": "metro",
          "password": "metro2016"
        }
     },
     "mongo": {
       "connectionString": "mongodb://localhost/metro"
     }
    }

3. In one Terminal tab, run "grunt" to begin watching and updating JS and SCSS files into the public/build directory.
4. In another Terminal tab, run "node index.js" to start the project, and go to http://localhost:8000 in your browser.
5. Optionally, in another Terminal tab, run "mongo" to start a local instance of the mongo database and populate the database with entries (https://docs.mongodb.com/manual/crud/).
