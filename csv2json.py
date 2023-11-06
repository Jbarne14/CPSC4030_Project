import csv
import json

csv_file = 'IMDB Movies 2000 - 2020.csv'
json_file = 'your_output.json'

# Read data from the CSV file
data = []
with open(csv_file, 'r',encoding="utf8") as csvf:
    csv_reader = csv.DictReader(csvf)
    for row in csv_reader:
        data.append(row)

# Write the data to a JSON file
with open(json_file, 'w') as jsonf:
    jsonf.write(json.dumps(data, indent=4))

print(f'CSV file "{csv_file}" has been converted to JSON and saved as "{json_file}".')
