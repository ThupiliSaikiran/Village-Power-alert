#!/bin/bash
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py create_admin
gunicorn village_power.wsgi:application
