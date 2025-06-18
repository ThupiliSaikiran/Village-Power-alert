#!/bin/bash
python manage.py migrate
python manage.py createsuperuser --mobile 9989320447 --name "Sreenu" --password "sr123" --noinput || true
python manage.py collectstatic --noinput
gunicorn village_power.wsgi:application
