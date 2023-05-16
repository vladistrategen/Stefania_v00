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

* Install dependencies

    ```$ pipenv shell```

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

## Database

The guide above assumes the database already exists and has been correctly configured

That most likely won't be the case, so I'll provide this guide for quickly setting that up

* First configure the 'DATABASES' in ```settings.py``` with the desired database nameand your mysql user & password

* Next create the database by using the mysql CLI

    ```$ CREATE DATABASE dbname```

* Now migrate the changes in django

    in the django project execute the following:

    ```$ python manage.py sqlmigrate patient 0001```

    ```$ python manage.py sqlmigrate doctors 0001```
    
    ```$ python manage.py sqlmigrate appointment 0001```

    ```$ python manage.py makemigrations```

    ```$ python manage.py migrate```



    
