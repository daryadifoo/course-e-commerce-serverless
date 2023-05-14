"use strict";

const AWS = require("aws-sdk");
const uuid = require("uuid");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Create course
module.exports.createCourse = (event, context, callback) => {
  const datetime = new Date().toISOString();
  const data = JSON.parse(event.body);

  const params = {
    TableName: "courses",
    Item: {
      id: uuid.v1(),
      code: data.code,
      name: data.name,
      content: data.content,
      duration: data.duration,
      createdAt: datetime,
      updatedAt: datetime,
    },
  };
  dynamoDb.put(params, (error, data) => {
    if (error) {
      console.error(error);
      callback(new Error(error));
      return;
    }
    const response = {
      statusCode: 201,
      body: JSON.stringify(data.Item),
    };
    callback(null, response);
  });
};

// Get course list
module.exports.listCourse = (event, context, callback) => {
  const params = {
    TableName: "courses",
  };

  dynamoDb.scan(params, (error, data) => {
    if (error) {
      callback(new Error(error));
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };

    callback(null, response);
  });
};

// Retrieve Course
module.exports.getCourse = (event, context, callback) => {
  const params = {
    TableName: "courses",
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.get(params, (error, data) => {
    if (error) {
      callback(new Error(error));
      return;
    }

    const response = data.Item
      ? {
          statusCode: 200,
          body: JSON.stringify(data.Item),
        }
      : {
          statusCode: 404,
          body: JSON.stringify({ message: "Course not found" }),
        };

    callback(null, response);
  });
};

// Update Course
module.exports.updateCourse = (event, context, callback) => {
  const datetime = new Date().toISOString();
  const data = JSON.parse(event.body);

  const params = {
    TableName: "courses",
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeValues: {
      ":cd": data.code,
      ":nm": data.name,
      ":ct": data.content,
      ":dr": data.duration,
      ":ua": datetime,
    },
    ExpressionAttributeNames: {
      "#courseName": "name",
      "#courseDuration": "duration",
    },
    UpdateExpression:
      "set code = :cd, #courseName = :nm, content = :ct, #courseDuration = :dr, updatedAt = :ua",
  };

  dynamoDb.update(params, (error, data) => {
    if (error) {
      console.error(error);
      callback(new Error(error));
      return;
    }
    const response = {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };

    callback(null, response);
  });
};

// Delete Course
module.exports.deleteCourse = (event, context, callback) => {
  const params = {
    TableName: "courses",
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.delete(params, (error, data) => {
    if (error) {
      callback(new Error(error));
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify({}),
    };

    callback(null, response);
  });
};
