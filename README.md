# Fidan Zeynalli (101504996) - COMP3123 Assignment2

## How to run:
In the terminal: `docker-compose up --build`

Open http://localhost:3000/

## Notes:
1. First, you will need to sign up. Then - login. 

   After login, a token will be generated. If you try to access a protected route (/employees, for instance) by simply typing it in the link - you won't be able to see any employees, as the table will fail to load (you will get the appropriate error message on the screen).
2. When you run the app, the 'uploads' folder will be automatically created in the backend/src folder (if you don't already have it created). All the uploaded files for the profile pictures will be stored in that folder. 
3. _After_ the search, clear the fields and click on the 'Search' button to see all the employees again.
