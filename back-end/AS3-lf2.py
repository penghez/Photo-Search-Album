import json
import boto3
from elasticsearch import Elasticsearch, RequestsHttpConnection
from requests_aws4auth import AWS4Auth
def lambda_handler(event, context):
    # ------------ search photos -----------------

    slots =event['currentIntent']['slots']
    if slots['searchKeyB'] != None:
        q = slots['searchKeyA'] + ' and ' + slots['searchKeyB']
    else:
        q = slots['searchKeyA']
 
    # ---------------- elastic ----------------
    host = ''
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
    # es.indices.delete(index='photos', ignore=[400, 404])
    print ("q", q)
    if q == 'all':
        client = boto3.client('s3')
        response = client.list_objects(
            Bucket='photo-search'
        )
        l = [x['Key'] for x in response['Contents']]
    else:
        search_label = {
            'size': 100, 
            'query': {
                'match': {
                    'labels': {
                        'query':q, 
                        'operator':'or',
                        'analyzer': 'stop',
                        'fuzziness': '1'
                    }
                }
            }
        }
        print ("search_label", search_label)
        res = es.search(index="photos", body=json.dumps(search_label))
        print ("es", res)
        l = [x['_source']['objectKey'] for x in res['hits']['hits']]
        l = ["https://s3.amazonaws.com/photo-search/" + i for i in l]


    return {"dialogAction": {
        "type": "Close",
        "fulfillmentState": "Fulfilled",
                "message": {
                    "contentType": "PlainText",
                    "content": str(l)
                }
            }
        }


