# Grafana MongoDB Bridge - MongoDB Datasource for Grafana 

Create a new data source of type MongoDB as shown below. The MongoDB details are :

* **HTTP Settings - URL** - Address of the grafana-mongodb-bridge `http://localhost:3333` 
* **MongoDB URL** - `mongodb://rpiread:rpiread@rpi-sensor-data-shard-00-00-ifxxs.mongodb.net:27017,rpi-sensor-data-shard-00-01-ifxxs.mongodb.net:27017,rpi-sensor-data-shard-00-02-ifxxs.mongodb.net:27017/test?ssl=true&replicaSet=rpi-sensor-data-shard-0&authSource=admin`
* **MongoDB Database** - `rpi`

<img src="doc/img/sample_datasource.png" alt="Sample Data Source" style="width: 500px;"/>

## Examples

#### Example 1 - Simple aggregate to rename fields

Import the dashboard in `examples\RPI MongoDB - Atlas.json`

This should show a graph of light sensor values from a Raspberry PI with an [EnviroPHAT](https://thepihut.com/products/enviro-phat) board feeding readings every minute into a MongoDB Atlas database.

<img src="doc/img/sample_dashboard.png" alt="Sample Dashboard" style="width: 800px;"/>

Clicking on the title of the graph allows you to see the aggregation query being run against the 'RPI Atlas' data source

<img src="doc/img/sample_query.png" alt="Sample Query" style="width: 800px;"/>

```javascript
db.sensor_value.aggregate([
	{"$match": {
        "sensor_type": "$sensor",
        "host_name": "$host",   
        "ts": {"$gte": "$from", "$lte": "$to"} 
    }},
    {"$sort" : {"ts" : 1}},
    {"$project": {"name": "value", "value": "$sensor_value", "ts": "$ts", "_id" : 0}} 
])
 ```
 The API is expecting back documents with the following fields

 * `name` - Name of the series ( will be displayed on the graph)
 * `value` - The float value of the point
 * `ts` - The time of the point as a BSON date

 These documents are then converted into the [Grafana API](http://docs.grafana.org/plugins/developing/datasources/)

`$grafanaFrom` and `$grafanaTo` are expanded by the plugin as BSON dates based on the range settings on the UI.

## Template Variables

`$sensor` and `$host` are template variables that are filled in by Grafana based on the drop down. The sample template queries are shown below. They expect documents to be returned with a single `_id` field.

<img src="doc/img/sample_template.png" alt="Sample Templates" style="width: 800px;"/>

#### Example 2 - Using $bucketAuto to push data point aggregation to the server

Grafana tells the backend server the date range along with the size of the buckets that should be used to calculate points. Therefore it's possible to use the MongoDB aggregation operator [$bucketAuto](https://docs.mongodb.com/manual/reference/operator/aggregation/bucketAuto/) to automatically bucket the data points into display points. To support this the backend provides the `$dateBucketCount` macro so that queries such as the one below can be written

```javascript
db.sensor_value.aggregate([
    {"$match": {
        "sensor_type": "$sensor", 
        "host_name": "$host",
        "ts": {"$gte": "$from", "$lt": "$to" }
    }},
    {"$bucketAuto": {
        "groupBy": "$ts",  
		"buckets": "$dateBucketCount", 
		"output":  {
            "maxValue": {"$max" : "$sensor_value"}  
        }   
    }},  
    {"$project": {"name": "value", "value": "$maxValue", "ts": "$_id.min", "_id": 0}}
])
```    
Note that ```_id``` field of the bucketAuto output contains the start and end of the bucket so we can use that as the ```ts``` value

#### Example 3 - Using a Tabel Panel

<img src="doc/img/table_panel.png" alt="Table Panel" style="width: 800px;"/>

Table panels are now supported with queries of the form

```javascript
db.sensor_value.aggregate(
[
	{"$match": {"ts": {"$gte": "$from", "$lt": "$to"}}},
	{"$group": {
        "_id": {
            "sensor_name": "$sensor_name", 
            "sensor_type": "$sensor_type"
        }, 
        "cnt": {"$sum" : 1},
        "ts": {"$max": "$ts"}  
    }}, 
	{"$project": {  
        "name": {"$concat": ["$_id.sensor_name",":","$_id.sensor_type" ]},
        "value": "$cnt",
        "ts": 1, 
        "_id" : 0
    }} 
])
```    
## Query substitutions 

### **$grafanaIntervalGroup** - Creates a group for a specified field based on a Grafana interval

- Required: MongoDB Version 4.2+

```js
db.users.aggregate([
	{"$group": {
		"_id": {
			"interval": {"$grafanaIntervalGroup": "$created"},
			"role": "$role"
		},
			"count": {
			"$sum": 1
		}
	}},
	{"$project": {"name": "$_id.role",  "value": "$count",  "ts": "$_id.interval",  "_id": 0}}
])
```

### **$grafanaIntervalBucketCount** - Calculated bucket count for $bucketAuto query

- Unlike $grafanaIntervalGroup there is no simple way to create secondary group with this method

```js
db.users.aggregate([
	{"$bucketAuto": {
		"groupBy" : "$created",  
		"buckets" : "$grafanaIntervalBucketCount", 
		"output" :  {
			"maxLoginAttempts" : { "$max" : "$loginAttempts" } 
		}
	}},
	{"$project": {"name": "Login attempts",  "value": "$maxLoginAttempts",  "ts": "$_id.created",  "_id": 0}}
])
```    
### **$grafanaIntervalMilliseconds** - Interval length in milliseconds
### **$grafanaFrom** - Date object for date selection range start
### **$grafanaTo** - Date object for date selection range end

### **$from** - deprecated (alias for $grafanaFrom)
### **$to** - deprecated (alias for $grafanaTo)
### **$dateBucketCount** - deprecated (alias for $grafanaIntervalBucketCount)

