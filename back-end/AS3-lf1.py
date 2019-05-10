import json
import boto3
from datetime import datetime
from elasticsearch import Elasticsearch, RequestsHttpConnection
from requests_aws4auth import AWS4Auth
def lambda_handler(event, context):
    
    # ------------ create labels ------------#
    fileName = event['Records'][0]['s3']['object']['key']
    
    client=boto3.client('rekognition')
    response = client.detect_labels(Image={'S3Object':{'Bucket':'photo-search','Name':fileName}})

    labels = []
    for e in response['Labels']:
        if e['Confidence'] > 90:
            labels.append(e['Name'])
        
    photo_index = {
        "objectKey": fileName,
        "bucket": 'photo-search',
        "createdTimestamp": str(datetime.now()),
        "labels": labels
     }
   
    host = ""
    region = 'us-east-1'

    service = 'es'
    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service,session_token=credentials.token)

    
    es = Elasticsearch(
        hosts = [{'host': host, 'port': 443}],
        http_auth = awsauth,
        use_ssl = True,
        verify_certs = True,
        connection_class = RequestsHttpConnection
    )

  
    res = es.index(index="photos", doc_type="_doc", id=fileName, body=photo_index)