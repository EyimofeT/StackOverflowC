
# StackOverflowC
a mini-prototype clone of stackoverflow with limited functionalities


##installation
install required packages:
  ->  npm install --save bcryptjs body-parser cookieparser cors dotenv express jsonwebtoken mongoose 
  ->  npm install --save-dev nodemon

to run server
    -> npm run start

##API Documentation
https://documenter.getpostman.com/view/15065406/2s847BVGAH


EndPoints                     -         Method 

1 localhost:5001/users      - POST , GET, PROPFIND, DELETE, PATCH
2 localhost:5001/auth/login - POST
3 localhost:5001/auth/logout -GET
4 localhost:5001/post      - POST , GET, PROPFIND, DELETE, PATCH