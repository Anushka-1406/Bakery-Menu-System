const ChatbotQuestion = require('../models/ChatbotQuestion');

// GET /api/chatbot/questions?restaurantId=...&activeOnly=true
const getQuestions = async (req, res) => {
  const { restaurantId, activeOnly } = req.query;
  const filter = {};
  if (restaurantId) filter.restaurantId = restaurantId;
  if (activeOnly === 'true') filter.isActive = true;
  const questions = await ChatbotQuestion.find(filter).sort({ createdAt: 1 });
  res.json({ success: true, count: questions.length, data: questions });
};

// POST /api/chatbot/questions/ask  { restaurantId, text }
// Simple keyword-matching lookup against active predefined questions
const askQuestion = async (req, res) => {
  const { restaurantId, text } = req.body;
  if (!text) return res.status(400).json({ success: false, message: 'text is required' });

  const questions = await ChatbotQuestion.find({ restaurantId, isActive: true });
  const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const input = normalize(text);
  const inputWords = new Set(input.split(/\s+/).filter((w) => w.length > 2));

  let best = null;
  let bestScore = 0;
  for (const q of questions) {
    const qWords = normalize(q.question).split(/\s+/).filter((w) => w.length > 2);
    let score = 0;
    for (const w of qWords) if (inputWords.has(w)) score++;
    if (normalize(q.question) === input) score += 10;
    if (score > bestScore) {
      bestScore = score;
      best = q;
    }
  }

  if (best && bestScore > 0) {
    return res.json({ success: true, matched: true, data: { question: best.question, answer: best.answer } });
  }
  res.json({
    success: true,
    matched: false,
    data: { answer: "Sorry, I don't have an answer for that yet. Please select one of the available questions." },
  });
};

// POST /api/chatbot/questions
const createQuestion = async (req, res) => {
  const { question, answer, restaurantId } = req.body;
  if (!question || !answer || !restaurantId) {
    return res.status(400).json({ success: false, message: 'question, answer and restaurantId are required' });
  }
  const q = await ChatbotQuestion.create(req.body);
  res.status(201).json({ success: true, data: q });
};

// PUT /api/chatbot/questions/:id
const updateQuestion = async (req, res) => {
  const q = await ChatbotQuestion.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!q) return res.status(404).json({ success: false, message: 'Question not found' });
  res.json({ success: true, data: q });
};

// DELETE /api/chatbot/questions/:id
const deleteQuestion = async (req, res) => {
  const q = await ChatbotQuestion.findByIdAndDelete(req.params.id);
  if (!q) return res.status(404).json({ success: false, message: 'Question not found' });
  res.json({ success: true, message: 'Question deleted' });
};

module.exports = { getQuestions, askQuestion, createQuestion, updateQuestion, deleteQuestion };
