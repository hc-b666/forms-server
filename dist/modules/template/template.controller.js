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
const googleapis_1 = require("googleapis");
const stream_1 = require("stream");
const http_errors_1 = __importDefault(require("http-errors"));
const template_service_1 = __importDefault(require("./template.service"));
const createTemplate_dto_1 = require("./dto/createTemplate.dto");
const updateDetails_dto_1 = require("./dto/updateDetails.dto");
class TemplateController {
    constructor() {
        this.validateId = (id, paramName) => {
            if (!id || isNaN(parseInt(id))) {
                throw (0, http_errors_1.default)(400, `${paramName} is required`);
            }
            return parseInt(id);
        };
        this.getAll = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const templates = yield this.templateService.findAll();
                res.status(200).json(templates);
            }
            catch (err) {
                next(err);
            }
        });
        this.getTop = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const templates = yield this.templateService.findTop();
                res.status(200).json(templates);
            }
            catch (err) {
                next(err);
            }
        });
        this.getLatest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const templates = yield this.templateService.findLatest();
                res.status(200).json(templates);
            }
            catch (err) {
                next(err);
            }
        });
        this.getById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const templateId = this.validateId(req.params.templateId, 'Template id');
                const template = yield this.templateService.findById(templateId);
                if (!template) {
                    throw (0, http_errors_1.default)(404, `There is no template with id ${templateId}`);
                }
                res.status(200).json(template);
            }
            catch (err) {
                next(err);
            }
        });
        this.getPublicByUserId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = this.validateId(req.params.userId, 'User id');
                const templates = yield this.templateService.findPublicTemplatesByUserId(userId);
                res.status(200).json(templates);
            }
            catch (err) {
                next(err);
            }
        });
        this.getPrivateByUserId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = this.validateId(req.params.userId, 'User id');
                const templates = yield this.templateService.findPrivateTemplatesByUserId(userId);
                res.status(200).json(templates);
            }
            catch (err) {
                next(err);
            }
        });
        this.getPrivateAccessibleByUserId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = this.validateId(req.params.userId, 'User id');
                const templates = yield this.templateService.findPrivateAccessibleTemplatesByUserId(userId);
                res.status(200).json(templates);
            }
            catch (err) {
                next(err);
            }
        });
        this.getByTagId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { tagId } = req.params;
                if (!tagId || tagId === 'null') {
                    const templates = yield this.templateService.findAll();
                    res.status(200).json(templates);
                    return;
                }
                const templates = yield this.templateService.findByTagId(parseInt(tagId));
                res.status(200).json(templates);
            }
            catch (err) {
                next(err);
            }
        });
        this.validateCreateTemplateData = (body) => {
            const { title, description, topic, type, tags, questions, users } = body;
            const result = createTemplate_dto_1.createTemplateSchema.safeParse({
                title,
                description,
                topic,
                type,
                tags: JSON.parse(tags),
                questions: JSON.parse(questions),
                users: JSON.parse(users),
            });
            if (!result.success) {
                const firstError = result.error.errors[0];
                throw (0, http_errors_1.default)(400, firstError.message);
            }
            return result.data;
        };
        this.initializeGoogleDrive = () => {
            const auth = new googleapis_1.google.auth.GoogleAuth({
                credentials: {
                    type: process.env.GOOGLE_TYPE,
                    project_id: process.env.GOOGLE_PROJECT_ID,
                    private_key: process.env.GOOGLE_PRIVATE_KEY,
                    client_email: process.env.GOOGLE_CLIENT_EMAIL,
                    client_id: process.env.GOOGLE_CLIENT_ID,
                },
                scopes: ['https://www.googleapis.com/auth/drive'],
            });
            const drive = googleapis_1.google.drive({ version: 'v3', auth });
            return drive;
        };
        this.createFileStream = (buffer) => {
            const fileStream = new stream_1.Readable();
            fileStream.push(buffer);
            fileStream.push(null);
            return fileStream;
        };
        this.uploadFileToDrive = (drive, file) => __awaiter(this, void 0, void 0, function* () {
            const fileStream = this.createFileStream(file.buffer);
            const fileMetaData = {
                name: file.originalname,
                mimeType: file.mimetype,
            };
            const media = {
                mimeType: file.mimetype,
                body: fileStream,
                parents: [this.folderId],
            };
            const response = yield drive.files.create({
                requestBody: fileMetaData,
                media,
                fields: 'id, webViewLink',
            });
            return response.data.id;
        });
        this.setFilePermissions = (drive, fileId) => __awaiter(this, void 0, void 0, function* () {
            yield drive.permissions.create({
                fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });
            const updatedFile = yield drive.files.get({
                fileId,
                fields: 'id, webViewLink',
            });
            return updatedFile.data;
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = this.validateCreateTemplateData(req.body);
                const userId = this.validateId(req.params.userId, 'User id');
                const templateId = yield this.templateService.create(userId, data);
                const file = req.file;
                if (file) {
                    const drive = this.initializeGoogleDrive();
                    const fileId = yield this.uploadFileToDrive(drive, file);
                    const updatedFile = yield this.setFilePermissions(drive, fileId);
                    yield this.templateService.addImage(templateId, updatedFile.id);
                }
                res.status(200).json({ message: 'Successfully created template' });
            }
            catch (err) {
                next(err);
            }
        });
        this.search = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req.query;
                if (!query || typeof query !== 'string') {
                    throw (0, http_errors_1.default)(400, 'Query is required to search templates');
                }
                const templates = yield this.templateService.search(query);
                res.status(200).json(templates);
            }
            catch (err) {
                next(err);
            }
        });
        this.updateDetails = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const templateId = this.validateId(req.params.templateId, 'Template id');
                const result = updateDetails_dto_1.updateDetailsSchema.safeParse(req.body);
                if (!result.success) {
                    const firstError = result.error.errors[0];
                    throw (0, http_errors_1.default)(400, firstError.message);
                }
                const isUpdated = yield this.templateService.updateDetails(templateId, result.data);
                if (!isUpdated) {
                    throw (0, http_errors_1.default)(500, `Failed to update template with id ${templateId}. Sorry for the inconvenience. Please try again later.`);
                }
                res.status(200).json({ message: 'Successfully updated template' });
            }
            catch (err) {
                next(err);
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const templateId = this.validateId(req.params.templateId, 'Template id');
                yield this.templateService.delete(templateId);
                res.status(200).json({ message: 'Successfully deleted template' });
            }
            catch (err) {
                next(err);
            }
        });
        this.templateService = template_service_1.default.getInstance();
        this.folderId = this.getFolderId();
    }
    getFolderId() {
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
        if (!folderId) {
            throw (0, http_errors_1.default)(500, 'Internal server error. Sorry for the inconvenience.');
        }
        return folderId;
    }
}
exports.default = new TemplateController();
