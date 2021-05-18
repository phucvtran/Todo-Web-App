# Todo-Web-App
Simple todo web app created with Node.js, Express.js, Google Sheet API, EJS template engine.

## Setup
* Pull the project
* Make sure you have Node.js installed.
[link to Node.js download!](https://nodejs.org/en/download/)
* Use the command below to check Node.js version on your machine.
```
$ node -v
```
* Install dependencies of the project. Make sure you're in root directory of the project.
```
$ npm install
```
* Create .env file in root directory of the project. Copy and Paste the following into .env file.
```
PORT = 3000
GOOGLE_SHEET_ID = "1A7zbj8_Fb7ew37jGnTTHCv9t3wW-GiPSq5B06gFxkJ0"
GOOGLE_SERVICE_ACCOUNT_EMAIL = "todo-web-app@rare-study-191822.iam.gserviceaccount.com"
GOOGLE_SERVICE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCbqUl9HQU2Ai+Z\nKn51tNfQSdeY8gzsGFSfN6UkqzhKr0apyWf2Rft1SAVWwd1BaspYI0Rq9QWbqVLn\n3W/wQeN41t5ND/JZT3W3sinGIxf5c7l2sRLydyHA85ENJy8wXkBH4h63TyA7SxlP\n9cmO62PSkFRI8PvOh4BISC6iY1PywPfQciNxGspk45GwsN6j9+QaDitawo/Nn5XS\nXeHsFwwTYfQ7b6+Qu3kGEA/yqJy3SfEj+KepgCIanKeakVuCl5sn/kwblcmgbtiQ\nOJ9ip1bPyeWjepvPWXnghS9dn+XEPVyK2WgpvEYNc5EE/552Ni4YQWJ40K2aVRnB\nWdZx/fIjAgMBAAECggEANnSXp/RSEV3cZvntuaHlahGbIf9zs9ijKfweguB/VelR\nkC5Md2RuHs5uR7aUf8ErPoA//Cbxqk4nGcRm16dFO833gQAWKVZZ+USTxqQaTANH\nG5XA6h/xJ/5NfUt6/7HJTRx24GwG+5c/KLD0rVH93vjs84OSo+LVZvQRlG+pO5/o\nU7xgfI+iYfBOoqMu+uEYKsim15GfZhbe3Usuv1Hf3R74gYwpy7KZU+CiQIFzvF6X\nYT7ZhAJbGMkviRZseoG7GJOze2n4X/XJH+rOPMYvxvYau+hG9zFZp2dNkQ3FAPG2\ne10dgl1GYtcBJcmkTrJsUOdrTeYET1iUN2p8didlWQKBgQDVo9wMAnQ02mrqI8Op\npHCbCwm8XwpKNLnlD0yIF+pdolICafT63w7oqP1DDlVpHyZWznDVHZJyEicsNuR/\nNV2ikVr9JBe3QecGaEqppuzxBJr+5MtzsyWcz1so/YSyrneK6rJt6KJMTfud5zkR\nBmD+A0nExQfgNWNRuXNEDgU57wKBgQC6hnxuC+6PXBpXUwW7RzwgmyasGlH+KUTb\nlM6Z0JgyEKWVKHcVkhqPBLIrYD9HZ5BZoTL5w0G+PuDTvesU5vprWQyaHKAHj7yc\nuwePv7iD/uek5koYhHGUPBvMxyFIyJYRncoifaJTKbf5lWuYHmoKOdcFQEUTgDOb\n7PuqYPsPDQKBgQDC5WBaCGcQzG0aupPGEAC2QISaNy3A8obf42wS/5ZL40fjcdwO\nfS0xrPCWmt3qL4OfT2d51CeELvFTkaQ0NG/+XZJfOuzzvohOvRfX2zNu0J/BhuHf\n4/+dJUFpjJXhF+5waZlrUP22lLHFpGnYETSspj1G5+Q+cxXvOTphTFUSOwKBgEHU\nmTHVsDqUjQ9o08sHFyeC2qE/INUNB6pf2JLc1fpFecss3uqUCB+VzrQUYgD3gjC/\n/de8nAVi98KDcuaLprIgWZxCohBJII5ITCDlz192pZbDWD9S7yscE8uwNAUWFjDd\neau2n4WuYaoKnFCx20cEpujJiBeb1ZsghqnZVII5AoGBAKCXt071VvdoU+NwEZU5\nJGyEhpbnV7fD028cozTnEGQgVQsr/2QXR4Pn8go7Xa8kyONPjWdbRUwvOeewOdb2\nMgkxWtcwEbRHzGGZoviSs+W0dfw9HmknXL4v5VULsgIXK4OaapQgkSTLaE8E+jJi\nBMT8+Y4uCbZV+8JT60BWUAgU\n-----END PRIVATE KEY-----\n"
```
* Run the project
```
$ npm start.
```
* Open your browser at:
```
localhost:3000
```
* [Open Google Sheet](https://docs.google.com/spreadsheets/d/1A7zbj8_Fb7ew37jGnTTHCv9t3wW-GiPSq5B06gFxkJ0/edit?fbclid=IwAR28YU-Dp0Jw__tNqvxytJbSOcMRdnntzJMfIqYJTL1b0upjVERO7X6TK30#gid=0)

## API Test with Postman

* [Postman Download Link](https://www.postman.com/downloads/)
* GET URL:
```
localhost:3000/api/all
```
* POST URL and body sample
```
localhost:3000/api/data

Body: (status value can only be "New" or "Done")
{
    "task": "new task",
    "status": "New",
    "user": "user",
    "date": "Mon - May 17 2021"
 }
```
* Delete URL:
```
localhost:3000/api/data/:taskName

replace <:taskName> with actual task name.
```
Happy Coding :)
