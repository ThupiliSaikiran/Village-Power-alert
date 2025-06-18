#!/bin/bash
python manage.py migrate
python manage.py create_superuser --mobile 998932044 --name "Sreenu" --password "sr123"
python manage.py collectstatic --noinput
gunicorn village_power.wsgi:application
