import json
import boto3

s3 = boto3.resource('s3')
bucket_name = 'photo-search'

def lambda_handler(event, context):
    msg = {}
    print(event)
    client = boto3.client('lex-runtime')
    params = event['queryStringParameters']
    
    if params['q'] == 'all':
        all_pics = []
        for b in s3.Bucket(bucket_name).objects.all():
            if not '/' in b.key and b.key.endswith('jpg'):
                all_pics.append("https://s3.amazonaws.com/photo-search/" + b.key)
        msg["botresp"] = str(all_pics)
        return {
            'statusCode': 200,
            'headers': {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers,Origin,X-Requested-With,Authorization,Content-Type,Accept,Z-Key',
              'Content-Type': 'application/json'
            },
            'body': json.dumps(msg)
        }
        
    bot_response = client.post_text(
        botName = 'photosearch',
        botAlias = '$LATEST',
        userId = 'cc3',
        inputText = params['q']
    )
   
    msg["botresp"] = bot_response["message"]
    
    return {
        'statusCode': 200,
        'headers': {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers,Origin,X-Requested-With,Authorization,Content-Type,Accept,Z-Key',
          'Content-Type': 'application/json'
        },
        'body': json.dumps(msg)
    }
