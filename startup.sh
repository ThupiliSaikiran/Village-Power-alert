#!/bin/bash
python manage.py migrate
python manage.py createsuperuser --mobile 7995499172 --name "Sreenu" --password "s123" --noinput || true
python manage.py collectstatic --noinput
gunicorn village_power.wsgi:application
