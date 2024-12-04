"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.latestTemplates = exports.likeTemplate = exports.getTop5Templates = exports.createTemplate = void 0;
const TemplateModel_1 = __importDefault(require("../models/TemplateModel"));
const QuestionModel_1 = __importDefault(require("../models/QuestionModel"));
const LikeModel_1 = __importDefault(require("../models/LikeModel"));
// ToDo - Optimize
const createTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, createdBy, topic, type, questions } = req.body;
        if (!title || !description || !createdBy || !topic || !type || questions.length === 0) {
            res.status(400).json({ message: 'All inputs are required for creating the template' });
            return;
        }
        const newTemplate = new TemplateModel_1.default({
            title,
            description,
            createdBy,
            topic: topic.toLowerCase(),
            isPublic: type === 'public' ? true : false,
        });
        yield newTemplate.save();
        const createQuestions = () => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all(questions.map((q) => __awaiter(void 0, void 0, void 0, function* () {
                const newQuestion = new QuestionModel_1.default({
                    templateId: newTemplate._id,
                    question: q.question,
                    type: q.type,
                    options: q.options,
                });
                yield newQuestion.save();
            })));
        });
        createQuestions();
        res.status(200).json({ message: 'Successfully created template' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.createTemplate = createTemplate;
const getTop5Templates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topTemplates = yield LikeModel_1.default.aggregate([
            { $group: { _id: '$templateId', likeCount: { $sum: 0 } } },
            { $sort: { likeCount: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'templates', localField: 'templateId', foreignField: '_id', as: 'template' } },
            { $unwind: '$template' },
            { $project: { _id: 0, template: 1, likeCount: 1 } }
        ]);
        res.status(200).json({ topTemplates });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.getTop5Templates = getTop5Templates;
const likeTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, templateId } = req.body;
        if (!userId || !templateId) {
            res.status(400).json({ message: 'User ID and Template ID are required' });
            return;
        }
        const existingLike = yield LikeModel_1.default.findOne({ userId, templateId });
        if (existingLike)
            return;
        const newLike = new LikeModel_1.default({ userId, templateId });
        yield newLike.save();
        res.status(200).json({ message: 'Template liked successfully' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.likeTemplate = likeTemplate;
const latestTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const latestTemplates = yield TemplateModel_1.default.aggregate([
            { $match: { isPublic: true } },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'author' } },
            { $unwind: '$author' },
            { $project: { _id: 0, title: 1, description: 1, topic: 1, created: 1, 'author.firstName': 1, 'author.lastName': 1, 'author.email': 1 } },
        ]);
        res.status(200).json(latestTemplates);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.latestTemplates = latestTemplates;
