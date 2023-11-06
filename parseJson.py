import json

input_json_file = 'your_output.json'
key1 = 'country'
key2 = 'worlwide_gross_income'

# Read the JSON data from the input file
with open(input_json_file, 'r') as jsonf:
    data = json.load(jsonf)

# Initialize a list to store the new objects
new_objects = []

# Iterate through the data and create new objects based on the specified key-value pairs
for obj in data:
    value1 = obj.get(key1)
    value2 = obj.get(key2)
    
    if value1 is not None and value2 is not None:
        new_obj = {
            "Country": value1,
            "WorldWide Gross Income": value2
        }
        new_objects.append(new_obj)

# Print or further process the new objects
for obj in new_objects:
    print(obj)
