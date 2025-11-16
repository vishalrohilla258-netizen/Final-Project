//models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the Response schema
// Schema for individual response (question-answer pair)
const responseSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  _id: mongoose.Schema.Types.ObjectId
});

// Schema for assessment related to responses
const singleAssessmentSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  rating: { type: Number, required: true },
  grammarReview: { type: String, required: true },
  questionType: { type: String, required: true },
  moreAppropriateAnswer: { type: String, required: true },
  satisfied: { type: Boolean, required: true },
  tone: { type: String, required: true },
  _id: mongoose.Schema.Types.ObjectId
});

// Main user schema with embedded responses and assessments
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  subscriptionType: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free',
  },
  geminiResponse: {
    type: [new mongoose.Schema({ 
      responses: [responseSchema], 
      assessments: [singleAssessmentSchema], 
      responseDate: { type: Date, default: Date.now }, 
      responseTime: { type: String, default: new Date().toLocaleTimeString() },
    })], // Ensure it's an array of objects
    default: [] // Initialize as an empty array
  }
});


// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
