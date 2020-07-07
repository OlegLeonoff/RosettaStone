# Multivariant Fullstack Project


Several realisatons of the same idea. That's the point of the project. It contains 3 variants of backend and 3 variants of frontend. Totally 3x3=9 different fullstack combinations for the same functionality.

![Scheme](scheme.jpg)

This is a 'Virtual Money' system. Users can send to each other an amount of virtual money. Each user from the beginning has 500 units on his balance. Each transaction is stored in database and can be viewed on '/history' page.

This project demonstrates a way to communicate between backend and frontend being protected by an authorization token. During the login process frontend recieves that token and after that constantly sends this token in headers in all successive requests.

## Requirements

Dotnet Core SDK<br/>
NodeJS<br/>
npm<br/>


## Things of interest

Dotnet Core Backend: Server Authorization with Roles
<br/>
Angular Frontend: 2 HttpInterceptors</br>
SQLite Backend: transaction queries
</br>
React MobX:
Webpack config is "ejected" (i.e. custom). Lazy components loading.

## Frontend screenshots (Angular as the most mature Material UI version)</br>

![Sign Up](signup1.png)
![Sign Up](signup2.png)
![Sign Up](signup3.png)
![Login](login1.png)
![Login](login2.png)
![Login](login3.png) 
![Login](login4.png)
![Send Money](sendMoney1.png)
![Send Money](sendMoney2.png)
![Send Money](sendMoney3.png)
![Send Money](sendMoney4.png)
![Transaction History](history.png)


<br/><br/>Negative transactions mean sending money to someone else. Positive ones mean receiving money from someone.
      
<br/> <div style="text-align: center;"><h3>Here's backend server API</h3></div>

**Create/Register a user**<br/>
**POST** */users*<br/>
body:<br/>
{name, password, email}<br/>
returns:<br/>
{token}<br/>
errors:<br/>
400: A user with that email already exists<br/>
400: You must send username and password<br/>
example:<br/>
{"name":"John Doo","password":"johnpwd","email":"john@doo.foo"}<br/>
{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IkFuaW1hbCBQbGFuZXQgVXNlciIsImVtYWlsIjoiMUAxLjEiLCJpZCI6MywiYmFsYW5jZSI6NTAwLCJpYXQiOjE0ODE1ODQ4ODksImV4cCI6MTQ4MTYwMjg4OX0.h4CzCxTOMRk6S8juxM0tRc5pql99XkXlR09pUzVMH9I"}<br/><br/> 

**Login**<br/>
**POST** */sessions/create*<br/>
body:<br/>
{email, password}<br/>
returns:<br/>
{token}<br/>
errors:<br/>
400: You must send email and password.<br/>
401: Invalid email or password.<br/><br/><br/>

**List of logged user transactions**<br/>
**GET** */api/protected/transactions*<br/>
authentication: bearer<br/>
body:<br/>
returns:<br/>
{transactions:[{id, date, username, amount, balance}]}<br/>
errors:<br/>
401: UnauthorizedError<br/>
401: Invalid user<br/><br/>

**Create a transaction**<br/>
Sender: logged user<br/>
Recipient: name in a body<br/>

**POST** */api/protected/transactions*<br/>
authentication: bearer<br/>
body:<br/>
{name, amount}<br/>
returns:<br/>
{transaction:{id, date, username, amount, balance}}<br/>
errors:<br/>
400: user not found<br/>
400: balance exceeded<br/>
401: UnauthorizedError<br/><br/>

**Logged user info**<br/>
**GET** */api/protected/userinfo*<br/>
authentication: bearer<br/>
body:<br/>
returns: {id, name, email, balance}<br/>
errors:<br/>
400: user not found<br/>
401: UnauthorizedError<br/><br/> 

**Filtered User list**<br/>
**POST** */api/protected/users/list* <br/>
authentication: bearer<br/>
body:<br/>
{filter}<br/>
returns:<br/>
[{id, name}]<br/>
errors:<br/>
401: UnauthorizedError<br/>
400: No search string<br/>



To launch this project open a shell, choose a backend variant, go to its folder and input for ASP.Net Core:

```csharp
dotnet restore
dotnet run
```
     

For other backend variants and for all frontend variants:

```csharp
npm install
npm start 
``` 

Now open your browser and input http://localhost:3000

For React project you can see a picture of bundles opened in browser.

![Bundle Analyzer](BundleAnalyzer.png)