import os
import requests

def send_outage_sms(phone_number, message):
    api_key = os.getenv('FAST2SMS_API_KEY')
    if not api_key:
        print('Warning: FAST2SMS_API_KEY not set in environment')
        return None
        
    url = 'https://www.fast2sms.com/dev/bulkV2'
    params = {
        'authorization': api_key,
        'route': 'dlt',
        'message': message,
        'numbers': phone_number,
        'flash': '0'
    }
    
    print(f"Sending SMS to {phone_number}")
    print(f"Message: {message}")
    
    try:
        response = requests.get(url, params=params)
        result = response.json()
        print(f"API Response: {result}")
        
        if result.get('return') == True:
            print(f'SMS sent successfully to {phone_number}')
            return True
        else:
            print(f'Failed to send SMS: {result.get("message")}')
            return False
            
    except Exception as e:
        print(f'Error sending SMS: {str(e)}')
        return False 