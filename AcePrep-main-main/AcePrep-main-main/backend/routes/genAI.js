// genaiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config(); // Load environment variables

async function run(responses) {
  // responses
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create a single prompt that includes all the questions and answers
    const assessmentPrompt = `
You are an AI assistant. Assess the following answers based on the respective questions.

For each question-answer pair, return a JSON object in the following format:

{
  "question": "<original question>",
  "answer": "<original answer>",
  "rating": "<rating out of 10>",
  "grammarReview": "<grammar correction and comments>",
  "questionType": "<type of question such as emotional intelligence, time management, etc.>",
  "moreAppropriateAnswer": "<a better or more professional version of the answer>",
  "satisfactory": "<true or false>",
  "tone": "<positive, neutral, or negative>"
}

Return an array of these JSON objects.

Questions and Answers:
${responses
  .map(
    (response, index) => `
${index + 1}.
Question: "${response.question}"
Answer: "${response.answer}"
`
  )
  .join("")}
ONLY return valid JSON. Do not include explanations or markdown.
`;

    //console.log(assessmentPrompt);

    // Request AI to assess the answers all at once
    const assessmentResult = await model.generateContent([assessmentPrompt]);

    // Log the AI's response to understand its structure
    //console.log("AI Response:", assessmentResult.response.text());

    // Extract assessment data from the AI response
    let result = assessmentResult.response.text(); // Assuming it returns a detailed assessment
    // Clean markdown formatting if present
    result = result
      .replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .replace(/```/g, "")
      .trim();

    // Try parsing JSON
    let assessmentJSON;
    try {
      assessmentJSON = JSON.parse(result);
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError);
      return {
        error: "AI response could not be parsed as valid JSON.",
        raw: result, // Return raw result for debugging
      };
    }

    return {
      responses: responses,
      assessments: assessmentJSON,
    };
  } catch (error) {
    console.error("Error generating content:", error);
    return {
      error:
        "Failed to generate content. Please check the logs for more details.",
    };
  }
}

// Helper function to parse the AI's assessment
function parseAssessment(assessmentText) {
  // Remove the asterisks (*) from the input text
  const cleanedText = assessmentText.replace(/\*/g, ""); // This will remove all '*' characters
  // Use safe matching with optional null checks based on the cleaned response structure

  // Match the ratings, grammar review, question types, appropriate answers, satisfaction, and tone for each question
  const ratingMatch = cleanedText.match(/Rating:\s*([0-9]+\/[0-9]+)/g);
  const grammarMatch = cleanedText.match(/Grammar:\s*(.*?)(\n|\.|$)/g);

  const questionTypeMatch = cleanedText.match(
    /Question Type:\s*(.*?)\s*\n/g // Captures everything up to the first newline after the "Question Type:"
  );

  // Remove the trailing newline from each match
  const cleanedQuestionTypes = questionTypeMatch
    ? questionTypeMatch.map((q) => q.split(":")[1].trim().split("\n")[0])
    : [];
  const appropriateAnswerMatch = cleanedText.match(
    /More Appropriate Answer:\s*(.*?)(\n|$)/g // Capture everything after "More Appropriate Answer:" up to the newline
  );
  const satisfiedMatch = cleanedText.match(
    /Satisfactory:\s*(.*?)(\n|$)/g // Capture everything after "Satisfactory:" up to the newline
  );
  const toneMatch = cleanedText.match(/Tone:\s*(.*?)(\n|$)/g);

  // Return a structured JSON containing the results for each question
  return {
    rating: ratingMatch ? ratingMatch.map((r) => r.split(":")[1].trim()) : [],
    grammarReview: grammarMatch
      ? grammarMatch.map((g) => g.split(":")[1].trim())
      : [],
    questionType: cleanedQuestionTypes,
    moreAppropriateAnswer: appropriateAnswerMatch
      ? appropriateAnswerMatch.map((a) => a.split(":")[1].trim())
      : [],
    satisfied: satisfiedMatch
      ? satisfiedMatch.map((s) => s.split(":")[1].trim()) // No need to check for true/false, just capture the full text
      : [],
    tone: toneMatch ? toneMatch.map((t) => t.split(":")[1].trim()) : [],
  };
}

// Export the `run` function to be used in other files
module.exports = { run };
