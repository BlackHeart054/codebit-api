"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var faker_1 = require("@faker-js/faker");
var edge_1 = require("@prisma/client/edge");
var bcrypt = __importStar(require("bcrypt"));
var prisma = new edge_1.PrismaClient();
var LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP'];
var TAGS = ['web', 'backend', 'frontend', 'database', 'algoritmo', 'devops', 'mobile', 'security'];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var password, admin, users, i, firstName, lastName, createdUsers, snippets, i, randomAuthor, randomTags;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Iniciando o seed...');
                    return [4 /*yield*/, prisma.snippet.deleteMany()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()];
                case 2:
                    _a.sent();
                    console.log('🧹 Banco limpo.');
                    return [4 /*yield*/, bcrypt.hash('123456', 10)];
                case 3:
                    password = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'dev@codebit.com',
                                name: 'Admin Codebit',
                                password: password,
                            },
                        })];
                case 4:
                    admin = _a.sent();
                    console.log("\uD83D\uDC64 Admin criado: ".concat(admin.email));
                    users = [];
                    for (i = 0; i < 50; i++) {
                        firstName = faker_1.fakerPT_BR.person.firstName();
                        lastName = faker_1.fakerPT_BR.person.lastName();
                        users.push(prisma.user.create({
                            data: {
                                email: faker_1.fakerPT_BR.internet.email({ firstName: firstName, lastName: lastName }).toLowerCase(),
                                name: "".concat(firstName, " ").concat(lastName),
                                password: password,
                            },
                        }));
                    }
                    return [4 /*yield*/, Promise.all(users)];
                case 5:
                    createdUsers = _a.sent();
                    createdUsers.push(admin);
                    console.log("\uD83D\uDC65 ".concat(createdUsers.length, " usu\u00E1rios gerados."));
                    snippets = [];
                    for (i = 0; i < 100; i++) {
                        randomAuthor = createdUsers[Math.floor(Math.random() * createdUsers.length)];
                        randomTags = faker_1.fakerPT_BR.helpers.arrayElements(TAGS, { min: 1, max: 3 });
                        snippets.push(prisma.snippet.create({
                            data: {
                                title: faker_1.fakerPT_BR.hacker.phrase(),
                                language: faker_1.fakerPT_BR.helpers.arrayElement(LANGUAGES),
                                code: generateFakeCode(),
                                description: faker_1.fakerPT_BR.lorem.paragraph(),
                                tags: randomTags,
                                authorId: randomAuthor.id,
                                createdAt: faker_1.fakerPT_BR.date.past(),
                            },
                        }));
                    }
                    return [4 /*yield*/, Promise.all(snippets)];
                case 6:
                    _a.sent();
                    console.log("\uD83D\uDCDD ".concat(snippets.length, " snippets gerados."));
                    console.log('✅ Seed finalizado com sucesso!');
                    return [2 /*return*/];
            }
        });
    });
}
function generateFakeCode() {
    return "\nfunction ".concat(faker_1.fakerPT_BR.hacker.verb(), "() {\n  const ").concat(faker_1.fakerPT_BR.hacker.noun(), " = \"").concat(faker_1.fakerPT_BR.hacker.adjective(), "\";\n  if (").concat(faker_1.fakerPT_BR.datatype.boolean(), ") {\n    return console.log(\"Codebit API Rocks!\");\n  }\n  // ").concat(faker_1.fakerPT_BR.hacker.phrase(), "\n  return null;\n}");
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
