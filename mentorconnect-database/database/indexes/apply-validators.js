/**
 * MentorConnect — Apply JSON Schema Validators
 *
 * Run with: mongosh mentorconnect apply-validators.js
 * Applies the schemas from ../schema-docs/*.schema.json to each collection.
 * validationLevel "moderate" = only validates new/modified docs,
 * existing bad data won't break.
 */

db = db.getSiblingDB("mentorconnect");

function applyValidator(collName, schema) {
  const exists = db.getCollectionNames().includes(collName);
  if (!exists) db.createCollection(collName);

  db.runCommand({
    collMod: collName,
    validator: schema,
    validationLevel: "moderate",
    validationAction: "warn" // change to "error" once data is clean
  });
  print(`✅ Validator applied: ${collName}`);
}

// NOTE: Paste each schema's $jsonSchema content here, or load via mongosh's
// `load()` if running locally with file access enabled.

applyValidator("users", {
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "email", "passwordHash", "role"],
    properties: {
      name: { bsonType: "string" },
      email: { bsonType: "string" },
      passwordHash: { bsonType: "string" },
      role: { enum: ["STUDENT", "MENTOR"] }
    }
  }
});

applyValidator("mentors", {
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "email", "company"],
    properties: {
      company: { bsonType: "string" },
      popularityScore: { bsonType: "int", minimum: 0 },
      fraudFlag: { bsonType: "bool" }
    }
  }
});

applyValidator("doubts", {
  $jsonSchema: {
    bsonType: "object",
    required: ["studentId", "mentorId", "question", "status"],
    properties: {
      status: { enum: ["OPEN", "RESOLVED"] }
    }
  }
});

applyValidator("ai_flags", {
  $jsonSchema: {
    bsonType: "object",
    required: ["userId", "flagType", "reason"],
    properties: {
      flagType: { enum: ["SLACKER", "FRAUD"] }
    }
  }
});

print("✅ All validators applied.");
