# import arcpy

import json
Polygon = {}
Point = {}
Polyfeat= []
Pointfeat = []
# with open(r'24Hour-location\test.json','r') as data:
#     data1 = json.load(data)
with open(r'24Hour-location\formspree_xleadrpo_2021-04-14T18 51 06_export.json','r') as json_file:
    data = json.load(json_file)

    data1=data['submissions']
    for i in data1:
        json_data = json.loads(i['geocode'])
        print(json_data)

    for x in json_data['features']:
        typ = x['geometry']['type']
        if typ == 'Polygon':
            Polyfeat.append(x)
        if typ == 'Point':
            Pointfeat.append(x)
    
    Polygon['features'] = Polyfeat
    Point['features'] = Pointfeat
    Polygon['type'] = 'FeatureCollection'
    Point['type'] = 'FeatureCollection'
with open(r'24Hour-location\Polygon.json','w') as json_file:
    json.dump(Polygon,json_file,indent =4,sort_keys=True)
with open(r'24Hour-location\Point.json','w') as json_point:
    json.dump(Point,json_point,indent=4,sort_keys=True)