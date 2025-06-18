#!/bin/bash
python manage.py migrate
gunicorn village_power.wsgi:application
