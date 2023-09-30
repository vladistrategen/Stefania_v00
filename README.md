# Stefania_v00

## About

This app intends to provide an easier way for storing and managing appointments.

Is intented to be used by a clinic in Bucharest who needed a better way to view exactly what appointment each doctor has, with what patients, at what time etc...

Built using:
    Django, MySQL, The Django REST Framework and React

![dragndrop](https://user-images.githubusercontent.com/100209446/224561891-908e0da9-ff21-43f0-a919-73b93338d665.png)

![editappointmentshowcase](https://user-images.githubusercontent.com/100209446/224561901-64a19255-31fc-4882-8559-263ec63c2f79.png)

![createappointmentshowcase](https://user-images.githubusercontent.com/100209446/224561919-83d5b8c3-974e-4664-ab5d-e2bf41dd6b66.png)


## Prerequisites for running the project
First make sure you install **NPM**, **Python**, **Pip** and **MySQL**

Check the following commands
```
$ npm -v
```
Possible output: ``` 8.15.0 ```


```
$ python --version
```
Possible output: ```  Python 3.10.7```

```
$ pip --version
```

Possible output: ``` pip 22.2.2 ```

## Installation
_Step by step guide on installing the project on a machine_ 

* Clone the project

    ```$ git clone https://github.com/vladistrategen/Stefania_v00 somedir ```

* Cd into the project

    ```$ cd somedir```

* Create the virtual enviroment

    ```$ pip install pipenv```
  
    ```$ python -m venv myenv```

  Then activate the virtual enviroment using your preferred method.
  Using VSCode with the git bash terminal you can use the command:

    ```$ source myenv/Scrips/Activate```

  Or using windows Powershell:

    ```C:\> myenv\Scripts\activate```

* Install dependencies

    ```$ pip install -r requirements.txt```

* Install npm packages
    
    ```$ cd frontend```

    ```$ npm i```

* Build the static files

    ```$ npm run build```

* Create a superuser

    ```$ cd ..```

    ```$ python manage.py createsuperuser```

    _And follow the instructions_

* Finally run the app

    ```$ python manage.py runserver```

## Database Setup

The guide above assumes that a database already exists and has been configured correctly. However, this might not always be the case. Follow the guide below to set up your database quickly.

* First, create the database. You can do this using the MySQL/MariaDB CLI or any other database management tool of your choice.

    ```shell
    CREATE DATABASE dbname;
    ```

* Next, create a `db.env` file in the root directory of the project. Populate this file with your MySQL/MariaDB credentials, URL, and port. Below is an example of how this file might look:

    ```env
    PROGRAMARI_DB_NAME=dbname
    PROGRAMARI_DB_USER=your_username
    PROGRAMARI_DB_PASSWORD=your_password
    PROGRAMARI_DB_HOST=127.0.0.1
    PROGRAMARI_DB_PORT=3306
    ```

* Now migrate the changes in django

    in the django project execute the following:

    ```$ python manage.py sqlmigrate patient 0001```

    ```$ python manage.py sqlmigrate doctors 0001```
    
    ```$ python manage.py sqlmigrate appointment 0001```

    ```$ python manage.py makemigrations```

    ```$ python manage.py migrate```



    
