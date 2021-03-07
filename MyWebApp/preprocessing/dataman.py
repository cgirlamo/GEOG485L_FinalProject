# import shapely
# import geopandas as gpd
import csv
import json
import pandas as pd


# open the geojson using geopandas
# countries = gpd.read_file('world.geojson')
# print(countries.head())

#open the csv using pandas

# beer = pd.read_csv('Beer Consumtion.csv', index_col = 0,skiprows = 0, header = 1)
# beer = beer.T
# beer.to_csv('beer.csv')
# # beer1 = beer.T
# beer1.to_csv('beer1.csv')
# wine = pd.read_csv('C:\Users\Chris\OneDrive - University of New Mexico\Documents\UNM_SP_2021\internet mapping\FP\cgirlamo.github.io\MyWebApp\GEOG485L-WebMap\data\Wine Imports.csv')
# spirits = pd.read_csv('Spirit Consumption.csv', index_col=0, skiprows = 0, header =1)




whiskey = pd.read_csv(r'C:\Users\Chris\OneDrive - University of New Mexico\Documents\UNM_SP_2021\internet mapping\FP\cgirlamo.github.io\MyWebApp\GEOG485L-WebMap\data\Whiskey.csv')
print(whiskey)
# wine = wine.T
# wine.to_csv(r'C:\Users\Chris\OneDrive - University of New Mexico\Documents\UNM_SP_2021\internet mapping\FP\cgirlamo.github.io\MyWebApp\GEOG485L-WebMap\data\Wine Imports1.csv', index_col=0, skiprows = 0, header = 1)


    
# for features in countries: 
#     x=0
#     for column in beer:
#         if(column == countries['CNTRY_NAME'][x]):
#             for 
    

    # x=x+1
      
# def append_properties_to_geojson(csvfile, geojsonfile):
#     data = gpd.read_file('countries.geojson')
#     data = copy.deepcopy(data)
#     values_to_add = pd.read_csv('Beer Consumtion.csv', index_col=0, skiprows=0, header=1)
#     try:
#         for entry in range(len(data["features"])):
#             data["features"][entry]["properties"][read_in_csv(
#                 csvfile)[1]] = values_to_add[entry]
#     except:
#         print("Note: Your CSV and geojson features do not contain the same number of values")
#     return data

#     if __name__ == "__main__":
#         csvfile = sys.argv[1]
#         geojsonfile = sys.argv[2]

#     with open('updated_data.json', 'w') as outfile:
#         json.dump(append_properties_to_geojson(csvfile, geojsonfile), outfile, indent=6)

#     print("Data dumped into 'updated_data.json'")

# Usage: python add_csv_to_geojson.py csvfile.csv geojsonfile.json




# #open the whiskey csv
# with open('Whiskey.csv','r') as file:
#     reader = csv.reader(file, delimiter = '\t')
#     for row in reader:
#         whiskey = {}
#         x=0
#         #create a name variable that holds the name of each country
#         Name = row[2]
#         #format the name to remove any DF's
#         if(Name[0:2] == 'DF'):
#             Name = Name[3:]
#         #cycle through each country in the geojson
#         for each in countries['CNTRY_NAME']:
#         #create an empty list of dictionaries


#             if countries['CNTRY_NAME'].iloc[x] == Name:
#                 if(row[4] != ''):
#                     countries[row[3]] = row[4]
#                 else:
#                     countries[row[3]] = ''
#             x =x+1
