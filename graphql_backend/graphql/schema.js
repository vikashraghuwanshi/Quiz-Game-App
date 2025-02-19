const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLID, GraphQLNonNull } = require("graphql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Question = require("../models/Question");
const GameSession = require("../models/GameSession");
const { VALIDATION_RULES } = require("../constants");

// Define User Type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
  }),
});

// Define Question Type
const QuestionType = new GraphQLObjectType({
  name: "Question",
  fields: () => ({
    id: { type: GraphQLID },
    text: { type: GraphQLString },
    options: { type: new GraphQLList(GraphQLString) },
    correctAnswer: { type: GraphQLString },
  }),
});

// Define Game Session Type
const GameSessionType = new GraphQLObjectType({
  name: "GameSession",
  fields: () => ({
    _id: { type: GraphQLID },
    player1: { type: GraphQLString },
    player2: { type: GraphQLString },
    isCompleted: { type: GraphQLBoolean },
    questions: { type: new GraphQLList(QuestionType) },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAllQuestions: {
      type: new GraphQLList(QuestionType),
      resolve: async () => await Question.find(),
    },
    getQuestionById: {
      type: QuestionType,
      args: { id: { type: GraphQLID } },
      resolve: async (_, { id }) => await Question.findById(id),
    },
    getGame: {
      type: GameSessionType,
      args: { gameId: { type: GraphQLID } },
      resolve: async (_, { gameId }) => await GameSession.findById(gameId).populate("questions"),
    },
  },
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { username, password }) => {
        if (await User.findOne({ username })) throw new Error("User already exists");
        const user = new User({ username, password });
        await user.save();
        return user;
      },
    },
    login: {
      type: GraphQLString,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { username, password }) => {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) throw new Error("Invalid credentials");
        return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
      },
    },
    addQuestion: {
      type: QuestionType,
      args: {
        text: { type: new GraphQLNonNull(GraphQLString) },
        options: { type: new GraphQLList(GraphQLString) },
        answer: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { text, options, answer }) => {
        const question = new Question({ text, options, answer });
        await question.save();
        return question;
      },
    },
    startGame: {
      type: GameSessionType,
      args: {
        player1: { type: new GraphQLNonNull(GraphQLString) },
        player2: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { player1, player2 }) => {
        const questions = await Question.aggregate([{ $sample: { size: VALIDATION_RULES.MAX_QUESTIONS_IN_GAME } }]);
        if (!questions.length) throw new Error("No questions available");
        const game = new GameSession({ player1, player2, questions: questions.map(q => q._id) });
        await game.save();
        const formattedQuestions = questions.map(q => ({
          id: q._id.toString(),
          text: q.text,
          options: q.options,
          answer: q.answer
        }));
        return { _id: game._id, player1, player2, isCompleted: false, questions: formattedQuestions };
      },
    },
    endGame: {
      type: GameSessionType,
      args: { gameId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { gameId }) => {
        const game = await GameSession.findById(gameId);
        if (!game) throw new Error("Game not found");
        game.isCompleted = true;
        await game.save();
        return { _id: game._id, player1: game.player1, player2: game.player2, isCompleted: game.isCompleted, questions: game.questions };
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
