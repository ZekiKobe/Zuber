/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("compression");

/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(8);
const bull_1 = __webpack_require__(9);
const schedule_1 = __webpack_require__(10);
const database_config_1 = __webpack_require__(11);
const redis_config_1 = __webpack_require__(12);
const auth_module_1 = __webpack_require__(13);
const users_module_1 = __webpack_require__(40);
const drivers_module_1 = __webpack_require__(41);
const rides_module_1 = __webpack_require__(42);
const payments_module_1 = __webpack_require__(54);
const wallet_module_1 = __webpack_require__(57);
const notifications_module_1 = __webpack_require__(52);
const admin_module_1 = __webpack_require__(58);
const dispatch_module_1 = __webpack_require__(50);
const pricing_module_1 = __webpack_require__(60);
const websocket_module_1 = __webpack_require__(64);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: database_config_1.databaseConfig,
                inject: [config_1.ConfigService],
            }),
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: redis_config_1.redisConfig,
                inject: [config_1.ConfigService],
            }),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            drivers_module_1.DriversModule,
            rides_module_1.RidesModule,
            payments_module_1.PaymentsModule,
            wallet_module_1.WalletModule,
            notifications_module_1.NotificationsModule,
            admin_module_1.AdminModule,
            dispatch_module_1.DispatchModule,
            pricing_module_1.PricingModule,
            websocket_module_1.WebSocketModule,
        ],
    })
], AppModule);


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/typeorm");

/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/bull");

/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.databaseConfig = void 0;
const databaseConfig = (configService) => ({
    type: 'mysql',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 3306),
    username: configService.get('DB_USERNAME', 'root'),
    password: configService.get('DB_PASSWORD', ''),
    database: configService.get('DB_NAME', 'zuber_db'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    synchronize: configService.get('APP_ENV') === 'development',
    logging: configService.get('APP_ENV') === 'development',
    extra: {
        connectionLimit: 20,
        connectTimeout: 2000,
    },
});
exports.databaseConfig = databaseConfig;


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.redisConfig = void 0;
const redisConfig = (configService) => ({
    redis: {
        host: configService.get('REDIS_HOST', 'localhost'),
        port: configService.get('REDIS_PORT', 6379),
        password: configService.get('REDIS_PASSWORD'),
    },
});
exports.redisConfig = redisConfig;


/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const jwt_1 = __webpack_require__(14);
const passport_1 = __webpack_require__(15);
const config_1 = __webpack_require__(4);
const auth_service_1 = __webpack_require__(16);
const auth_controller_1 = __webpack_require__(31);
const jwt_strategy_1 = __webpack_require__(36);
const local_strategy_1 = __webpack_require__(38);
const user_entity_1 = __webpack_require__(19);
const driver_entity_1 = __webpack_require__(22);
const wallet_account_entity_1 = __webpack_require__(26);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, driver_entity_1.Driver, wallet_account_entity_1.WalletAccount]),
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN', '7d'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, local_strategy_1.LocalStrategy],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(17);
const jwt_1 = __webpack_require__(14);
const bcrypt = __webpack_require__(18);
const user_entity_1 = __webpack_require__(19);
const wallet_account_entity_1 = __webpack_require__(26);
let AuthService = class AuthService {
    constructor(userRepository, walletAccountRepository, jwtService) {
        this.userRepository = userRepository;
        this.walletAccountRepository = walletAccountRepository;
        this.jwtService = jwtService;
    }
    async registerUser(phoneNumber, password, firstName, lastName, email) {
        const existingUser = await this.userRepository.findOne({
            where: { phoneNumber },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this phone number already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const user = this.userRepository.create({
            phoneNumber,
            password: hashedPassword,
            firstName,
            lastName,
            email,
            phoneVerificationCode: verificationCode,
            phoneVerificationExpires: new Date(Date.now() + 10 * 60 * 1000),
            status: user_entity_1.UserStatus.PENDING_VERIFICATION,
        });
        await this.userRepository.save(user);
        const wallet = this.walletAccountRepository.create({
            userId: user.id,
            balance: 0,
            currency: 'ETB',
        });
        await this.walletAccountRepository.save(wallet);
        return {
            userId: user.id,
            phoneNumber: user.phoneNumber,
            message: 'Verification code sent to your phone',
        };
    }
    async verifyPhone(userId, code) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (user.phoneVerificationCode !== code) {
            throw new common_1.BadRequestException('Invalid verification code');
        }
        if (new Date() > user.phoneVerificationExpires) {
            throw new common_1.BadRequestException('Verification code expired');
        }
        user.isPhoneVerified = true;
        user.status = user_entity_1.UserStatus.ACTIVE;
        user.phoneVerificationCode = null;
        user.phoneVerificationExpires = null;
        await this.userRepository.save(user);
        const token = this.generateToken(user.id, 'user');
        return {
            token,
            user: {
                id: user.id,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        };
    }
    async loginUser(phoneNumber, password) {
        const user = await this.userRepository.findOne({
            where: { phoneNumber },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isPhoneVerified) {
            throw new common_1.UnauthorizedException('Phone number not verified');
        }
        if (user.status !== user_entity_1.UserStatus.ACTIVE) {
            throw new common_1.UnauthorizedException('Account is not active');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = this.generateToken(user.id, 'user');
        return {
            token,
            user: {
                id: user.id,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        };
    }
    generateToken(id, type) {
        return this.jwtService.sign({ sub: id, type });
    }
    async validateUser(userId) {
        return this.userRepository.findOne({ where: { id: userId } });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(wallet_account_entity_1.WalletAccount)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _c : Object])
], AuthService);


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = exports.UserStatus = void 0;
const typeorm_1 = __webpack_require__(17);
const class_transformer_1 = __webpack_require__(20);
const ride_entity_1 = __webpack_require__(21);
const wallet_account_entity_1 = __webpack_require__(26);
const saved_place_entity_1 = __webpack_require__(30);
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["BLOCKED"] = "blocked";
    UserStatus["PENDING_VERIFICATION"] = "pending_verification";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "profilePicture", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.PENDING_VERIFICATION,
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isPhoneVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phoneVerificationCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], User.prototype, "phoneVerificationExpires", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8, nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], User.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "totalRides", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'ETB' }),
    __metadata("design:type", String)
], User.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'am' }),
    __metadata("design:type", String)
], User.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ride_entity_1.Ride, (ride) => ride.user),
    __metadata("design:type", Array)
], User.prototype, "rides", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => wallet_account_entity_1.WalletAccount, (wallet) => wallet.user),
    __metadata("design:type", typeof (_b = typeof wallet_account_entity_1.WalletAccount !== "undefined" && wallet_account_entity_1.WalletAccount) === "function" ? _b : Object)
], User.prototype, "wallet", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => saved_place_entity_1.SavedPlace, (place) => place.user),
    __metadata("design:type", Array)
], User.prototype, "savedPlaces", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);


/***/ }),
/* 20 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Ride = exports.CancellationReason = exports.RideStatus = void 0;
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(19);
const driver_entity_1 = __webpack_require__(22);
const ride_type_entity_1 = __webpack_require__(24);
const trip_payment_entity_1 = __webpack_require__(28);
const trip_rating_entity_1 = __webpack_require__(29);
var RideStatus;
(function (RideStatus) {
    RideStatus["REQUESTED"] = "requested";
    RideStatus["DRIVER_ASSIGNED"] = "driver_assigned";
    RideStatus["DRIVER_ARRIVED"] = "driver_arrived";
    RideStatus["IN_PROGRESS"] = "in_progress";
    RideStatus["COMPLETED"] = "completed";
    RideStatus["CANCELLED"] = "cancelled";
    RideStatus["EXPIRED"] = "expired";
})(RideStatus || (exports.RideStatus = RideStatus = {}));
var CancellationReason;
(function (CancellationReason) {
    CancellationReason["USER_CANCELLED"] = "user_cancelled";
    CancellationReason["DRIVER_CANCELLED"] = "driver_cancelled";
    CancellationReason["DRIVER_NO_SHOW"] = "driver_no_show";
    CancellationReason["USER_NO_SHOW"] = "user_no_show";
    CancellationReason["SYSTEM_TIMEOUT"] = "system_timeout";
    CancellationReason["OTHER"] = "other";
})(CancellationReason || (exports.CancellationReason = CancellationReason = {}));
let Ride = class Ride {
};
exports.Ride = Ride;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Ride.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.rides),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", String)
], Ride.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], Ride.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.Driver, (driver) => driver.rides),
    (0, typeorm_1.JoinColumn)({ name: 'driver_id' }),
    __metadata("design:type", String)
], Ride.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.Driver, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'driver_id' }),
    __metadata("design:type", typeof (_b = typeof driver_entity_1.Driver !== "undefined" && driver_entity_1.Driver) === "function" ? _b : Object)
], Ride.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.ManyToOne)(() => ride_type_entity_1.RideType),
    (0, typeorm_1.JoinColumn)({ name: 'ride_type_id' }),
    __metadata("design:type", String)
], Ride.prototype, "rideTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ride_type_entity_1.RideType),
    (0, typeorm_1.JoinColumn)({ name: 'ride_type_id' }),
    __metadata("design:type", typeof (_c = typeof ride_type_entity_1.RideType !== "undefined" && ride_type_entity_1.RideType) === "function" ? _c : Object)
], Ride.prototype, "rideType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Ride.prototype, "pickupLatitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Ride.prototype, "pickupLongitude", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Ride.prototype, "pickupAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8 }),
    __metadata("design:type", Number)
], Ride.prototype, "dropoffLatitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8 }),
    __metadata("design:type", Number)
], Ride.prototype, "dropoffLongitude", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Ride.prototype, "dropoffAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RideStatus,
        default: RideStatus.REQUESTED,
    }),
    __metadata("design:type", String)
], Ride.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Ride.prototype, "distance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Ride.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Ride.prototype, "estimatedDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Ride.prototype, "estimatedDistance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Ride.prototype, "baseFare", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Ride.prototype, "distanceFare", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Ride.prototype, "timeFare", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 1.0 }),
    __metadata("design:type", Number)
], Ride.prototype, "surgeMultiplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Ride.prototype, "totalFare", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Ride.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Ride.prototype, "finalFare", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Ride.prototype, "promoCodeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Ride.prototype, "requestedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Ride.prototype, "assignedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], Ride.prototype, "arrivedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_g = typeof Date !== "undefined" && Date) === "function" ? _g : Object)
], Ride.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_h = typeof Date !== "undefined" && Date) === "function" ? _h : Object)
], Ride.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_j = typeof Date !== "undefined" && Date) === "function" ? _j : Object)
], Ride.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CancellationReason,
        nullable: true,
    }),
    __metadata("design:type", String)
], Ride.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Ride.prototype, "cancellationNote", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Ride.prototype, "cancelledBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Ride.prototype, "isScheduled", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_k = typeof Date !== "undefined" && Date) === "function" ? _k : Object)
], Ride.prototype, "scheduledTime", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => trip_payment_entity_1.TripPayment, (payment) => payment.ride),
    __metadata("design:type", typeof (_l = typeof trip_payment_entity_1.TripPayment !== "undefined" && trip_payment_entity_1.TripPayment) === "function" ? _l : Object)
], Ride.prototype, "payment", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => trip_rating_entity_1.TripRating, (rating) => rating.ride),
    __metadata("design:type", typeof (_m = typeof trip_rating_entity_1.TripRating !== "undefined" && trip_rating_entity_1.TripRating) === "function" ? _m : Object)
], Ride.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_o = typeof Date !== "undefined" && Date) === "function" ? _o : Object)
], Ride.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_p = typeof Date !== "undefined" && Date) === "function" ? _p : Object)
], Ride.prototype, "updatedAt", void 0);
exports.Ride = Ride = __decorate([
    (0, typeorm_1.Entity)('rides')
], Ride);


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Driver = exports.DriverAvailability = exports.DriverStatus = void 0;
const typeorm_1 = __webpack_require__(17);
const class_transformer_1 = __webpack_require__(20);
const ride_entity_1 = __webpack_require__(21);
const vehicle_entity_1 = __webpack_require__(23);
const driver_document_entity_1 = __webpack_require__(25);
const wallet_account_entity_1 = __webpack_require__(26);
var DriverStatus;
(function (DriverStatus) {
    DriverStatus["PENDING_APPROVAL"] = "pending_approval";
    DriverStatus["APPROVED"] = "approved";
    DriverStatus["REJECTED"] = "rejected";
    DriverStatus["BLOCKED"] = "blocked";
    DriverStatus["SUSPENDED"] = "suspended";
})(DriverStatus || (exports.DriverStatus = DriverStatus = {}));
var DriverAvailability;
(function (DriverAvailability) {
    DriverAvailability["OFFLINE"] = "offline";
    DriverAvailability["ONLINE"] = "online";
    DriverAvailability["ON_TRIP"] = "on_trip";
    DriverAvailability["BREAK"] = "break";
})(DriverAvailability || (exports.DriverAvailability = DriverAvailability = {}));
let Driver = class Driver {
};
exports.Driver = Driver;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Driver.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Driver.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Driver.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], Driver.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Driver.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Driver.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Driver.prototype, "profilePicture", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DriverStatus,
        default: DriverStatus.PENDING_APPROVAL,
    }),
    __metadata("design:type", String)
], Driver.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DriverAvailability,
        default: DriverAvailability.OFFLINE,
    }),
    __metadata("design:type", String)
], Driver.prototype, "availability", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Driver.prototype, "isPhoneVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Driver.prototype, "phoneVerificationCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Driver.prototype, "phoneVerificationExpires", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8, nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Driver.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Driver.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Driver.prototype, "heading", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Driver.prototype, "totalRides", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Driver.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Driver.prototype, "totalEarnings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Driver.prototype, "pendingEarnings", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'ETB' }),
    __metadata("design:type", String)
], Driver.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'am' }),
    __metadata("design:type", String)
], Driver.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Driver.prototype, "licenseNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Driver.prototype, "licenseExpiryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Driver.prototype, "nationalId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ride_entity_1.Ride, (ride) => ride.driver),
    __metadata("design:type", Array)
], Driver.prototype, "rides", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vehicle_entity_1.Vehicle, (vehicle) => vehicle.driver),
    __metadata("design:type", Array)
], Driver.prototype, "vehicles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => driver_document_entity_1.DriverDocument, (doc) => doc.driver),
    __metadata("design:type", Array)
], Driver.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => wallet_account_entity_1.WalletAccount, (wallet) => wallet.driver),
    __metadata("design:type", typeof (_c = typeof wallet_account_entity_1.WalletAccount !== "undefined" && wallet_account_entity_1.WalletAccount) === "function" ? _c : Object)
], Driver.prototype, "wallet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Driver.prototype, "lastOnlineAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Driver.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], Driver.prototype, "updatedAt", void 0);
exports.Driver = Driver = __decorate([
    (0, typeorm_1.Entity)('drivers')
], Driver);


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Vehicle = exports.VehicleStatus = void 0;
const typeorm_1 = __webpack_require__(17);
const driver_entity_1 = __webpack_require__(22);
const ride_type_entity_1 = __webpack_require__(24);
var VehicleStatus;
(function (VehicleStatus) {
    VehicleStatus["PENDING"] = "pending";
    VehicleStatus["APPROVED"] = "approved";
    VehicleStatus["REJECTED"] = "rejected";
    VehicleStatus["INACTIVE"] = "inactive";
})(VehicleStatus || (exports.VehicleStatus = VehicleStatus = {}));
let Vehicle = class Vehicle {
};
exports.Vehicle = Vehicle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Vehicle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.Driver, (driver) => driver.vehicles),
    (0, typeorm_1.JoinColumn)({ name: 'driver_id' }),
    __metadata("design:type", String)
], Vehicle.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.Driver),
    (0, typeorm_1.JoinColumn)({ name: 'driver_id' }),
    __metadata("design:type", typeof (_a = typeof driver_entity_1.Driver !== "undefined" && driver_entity_1.Driver) === "function" ? _a : Object)
], Vehicle.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vehicle.prototype, "make", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vehicle.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Vehicle.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "licensePlate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vehicle.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.ManyToOne)(() => ride_type_entity_1.RideType),
    (0, typeorm_1.JoinColumn)({ name: 'ride_type_id' }),
    __metadata("design:type", String)
], Vehicle.prototype, "rideTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ride_type_entity_1.RideType),
    (0, typeorm_1.JoinColumn)({ name: 'ride_type_id' }),
    __metadata("design:type", typeof (_b = typeof ride_type_entity_1.RideType !== "undefined" && ride_type_entity_1.RideType) === "function" ? _b : Object)
], Vehicle.prototype, "rideType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: VehicleStatus,
        default: VehicleStatus.PENDING,
    }),
    __metadata("design:type", String)
], Vehicle.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "registrationDocument", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "insuranceDocument", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Vehicle.prototype, "insuranceExpiryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 4 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Vehicle.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Vehicle.prototype, "updatedAt", void 0);
exports.Vehicle = Vehicle = __decorate([
    (0, typeorm_1.Entity)('vehicles')
], Vehicle);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RideType = exports.RideTypeCategory = void 0;
const typeorm_1 = __webpack_require__(17);
var RideTypeCategory;
(function (RideTypeCategory) {
    RideTypeCategory["STANDARD"] = "standard";
    RideTypeCategory["XL"] = "xl";
    RideTypeCategory["MOTORCYCLE"] = "motorcycle";
    RideTypeCategory["BAJAJ"] = "bajaj";
    RideTypeCategory["PREMIUM"] = "premium";
})(RideTypeCategory || (exports.RideTypeCategory = RideTypeCategory = {}));
let RideType = class RideType {
};
exports.RideType = RideType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RideType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], RideType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RideType.prototype, "displayName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RideTypeCategory,
    }),
    __metadata("design:type", String)
], RideType.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RideType.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], RideType.prototype, "baseFare", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], RideType.prototype, "perKmRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], RideType.prototype, "perMinuteRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], RideType.prototype, "minimumFare", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 1.0 }),
    __metadata("design:type", Number)
], RideType.prototype, "surgeMultiplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 4 }),
    __metadata("design:type", Number)
], RideType.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RideType.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], RideType.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], RideType.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], RideType.prototype, "updatedAt", void 0);
exports.RideType = RideType = __decorate([
    (0, typeorm_1.Entity)('ride_types')
], RideType);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriverDocument = exports.DocumentStatus = exports.DocumentType = void 0;
const typeorm_1 = __webpack_require__(17);
const driver_entity_1 = __webpack_require__(22);
var DocumentType;
(function (DocumentType) {
    DocumentType["NATIONAL_ID"] = "national_id";
    DocumentType["DRIVING_LICENSE"] = "driving_license";
    DocumentType["VEHICLE_REGISTRATION"] = "vehicle_registration";
    DocumentType["INSURANCE"] = "insurance";
    DocumentType["PROFILE_PHOTO"] = "profile_photo";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["PENDING"] = "pending";
    DocumentStatus["APPROVED"] = "approved";
    DocumentStatus["REJECTED"] = "rejected";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
let DriverDocument = class DriverDocument {
};
exports.DriverDocument = DriverDocument;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DriverDocument.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.Driver, (driver) => driver.documents),
    (0, typeorm_1.JoinColumn)({ name: 'driver_id' }),
    __metadata("design:type", String)
], DriverDocument.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.Driver),
    (0, typeorm_1.JoinColumn)({ name: 'driver_id' }),
    __metadata("design:type", typeof (_a = typeof driver_entity_1.Driver !== "undefined" && driver_entity_1.Driver) === "function" ? _a : Object)
], DriverDocument.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DocumentType,
    }),
    __metadata("design:type", String)
], DriverDocument.prototype, "documentType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DriverDocument.prototype, "documentUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DocumentStatus,
        default: DocumentStatus.PENDING,
    }),
    __metadata("design:type", String)
], DriverDocument.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DriverDocument.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DriverDocument.prototype, "reviewedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], DriverDocument.prototype, "reviewedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], DriverDocument.prototype, "expiryDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], DriverDocument.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], DriverDocument.prototype, "updatedAt", void 0);
exports.DriverDocument = DriverDocument = __decorate([
    (0, typeorm_1.Entity)('driver_documents')
], DriverDocument);


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WalletAccount = void 0;
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(19);
const driver_entity_1 = __webpack_require__(22);
const wallet_transaction_entity_1 = __webpack_require__(27);
let WalletAccount = class WalletAccount {
};
exports.WalletAccount = WalletAccount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WalletAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.wallet),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", String)
], WalletAccount.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], WalletAccount.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    (0, typeorm_1.OneToOne)(() => driver_entity_1.Driver, (driver) => driver.wallet),
    (0, typeorm_1.JoinColumn)({ name: 'driver_id' }),
    __metadata("design:type", String)
], WalletAccount.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => driver_entity_1.Driver, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'driver_id' }),
    __metadata("design:type", typeof (_b = typeof driver_entity_1.Driver !== "undefined" && driver_entity_1.Driver) === "function" ? _b : Object)
], WalletAccount.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], WalletAccount.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], WalletAccount.prototype, "pendingBalance", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'ETB' }),
    __metadata("design:type", String)
], WalletAccount.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], WalletAccount.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => wallet_transaction_entity_1.WalletTransaction, (transaction) => transaction.wallet),
    __metadata("design:type", Array)
], WalletAccount.prototype, "transactions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], WalletAccount.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], WalletAccount.prototype, "updatedAt", void 0);
exports.WalletAccount = WalletAccount = __decorate([
    (0, typeorm_1.Entity)('wallet_accounts')
], WalletAccount);


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WalletTransaction = exports.PaymentMethod = exports.TransactionStatus = exports.TransactionType = void 0;
const typeorm_1 = __webpack_require__(17);
const wallet_account_entity_1 = __webpack_require__(26);
var TransactionType;
(function (TransactionType) {
    TransactionType["DEPOSIT"] = "deposit";
    TransactionType["WITHDRAWAL"] = "withdrawal";
    TransactionType["PAYMENT"] = "payment";
    TransactionType["REFUND"] = "refund";
    TransactionType["COMMISSION"] = "commission";
    TransactionType["EARNINGS"] = "earnings";
    TransactionType["BONUS"] = "bonus";
    TransactionType["PENALTY"] = "penalty";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["CANCELLED"] = "cancelled";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["TELEBIRR"] = "telebirr";
    PaymentMethod["WALLET"] = "wallet";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
let WalletTransaction = class WalletTransaction {
};
exports.WalletTransaction = WalletTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WalletTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.ManyToOne)(() => wallet_account_entity_1.WalletAccount, (wallet) => wallet.transactions),
    (0, typeorm_1.JoinColumn)({ name: 'wallet_id' }),
    __metadata("design:type", String)
], WalletTransaction.prototype, "walletId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => wallet_account_entity_1.WalletAccount),
    (0, typeorm_1.JoinColumn)({ name: 'wallet_id' }),
    __metadata("design:type", typeof (_a = typeof wallet_account_entity_1.WalletAccount !== "undefined" && wallet_account_entity_1.WalletAccount) === "function" ? _a : Object)
], WalletTransaction.prototype, "wallet", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TransactionType,
    }),
    __metadata("design:type", String)
], WalletTransaction.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], WalletTransaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], WalletTransaction.prototype, "balanceBefore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], WalletTransaction.prototype, "balanceAfter", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.PENDING,
    }),
    __metadata("design:type", String)
], WalletTransaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentMethod,
        nullable: true,
    }),
    __metadata("design:type", String)
], WalletTransaction.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WalletTransaction.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WalletTransaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WalletTransaction.prototype, "rideId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WalletTransaction.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], WalletTransaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], WalletTransaction.prototype, "updatedAt", void 0);
exports.WalletTransaction = WalletTransaction = __decorate([
    (0, typeorm_1.Entity)('wallet_transactions')
], WalletTransaction);


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TripPayment = void 0;
const typeorm_1 = __webpack_require__(17);
const ride_entity_1 = __webpack_require__(21);
const wallet_transaction_entity_1 = __webpack_require__(27);
let TripPayment = class TripPayment {
};
exports.TripPayment = TripPayment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TripPayment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, typeorm_1.OneToOne)(() => ride_entity_1.Ride, (ride) => ride.payment),
    (0, typeorm_1.JoinColumn)({ name: 'ride_id' }),
    __metadata("design:type", String)
], TripPayment.prototype, "rideId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => ride_entity_1.Ride),
    (0, typeorm_1.JoinColumn)({ name: 'ride_id' }),
    __metadata("design:type", typeof (_a = typeof ride_entity_1.Ride !== "undefined" && ride_entity_1.Ride) === "function" ? _a : Object)
], TripPayment.prototype, "ride", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], TripPayment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: wallet_transaction_entity_1.PaymentMethod,
    }),
    __metadata("design:type", typeof (_b = typeof wallet_transaction_entity_1.PaymentMethod !== "undefined" && wallet_transaction_entity_1.PaymentMethod) === "function" ? _b : Object)
], TripPayment.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: wallet_transaction_entity_1.TransactionStatus,
        default: wallet_transaction_entity_1.TransactionStatus.PENDING,
    }),
    __metadata("design:type", typeof (_c = typeof wallet_transaction_entity_1.TransactionStatus !== "undefined" && wallet_transaction_entity_1.TransactionStatus) === "function" ? _c : Object)
], TripPayment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TripPayment.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TripPayment.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TripPayment.prototype, "failureReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], TripPayment.prototype, "paidAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], TripPayment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], TripPayment.prototype, "updatedAt", void 0);
exports.TripPayment = TripPayment = __decorate([
    (0, typeorm_1.Entity)('trip_payments')
], TripPayment);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TripRating = void 0;
const typeorm_1 = __webpack_require__(17);
const ride_entity_1 = __webpack_require__(21);
let TripRating = class TripRating {
};
exports.TripRating = TripRating;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TripRating.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, typeorm_1.OneToOne)(() => ride_entity_1.Ride, (ride) => ride.rating),
    (0, typeorm_1.JoinColumn)({ name: 'ride_id' }),
    __metadata("design:type", String)
], TripRating.prototype, "rideId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => ride_entity_1.Ride),
    (0, typeorm_1.JoinColumn)({ name: 'ride_id' }),
    __metadata("design:type", typeof (_a = typeof ride_entity_1.Ride !== "undefined" && ride_entity_1.Ride) === "function" ? _a : Object)
], TripRating.prototype, "ride", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TripRating.prototype, "driverRating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TripRating.prototype, "driverReview", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], TripRating.prototype, "userRating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TripRating.prototype, "userReview", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], TripRating.prototype, "isRatedByUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], TripRating.prototype, "isRatedByDriver", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], TripRating.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], TripRating.prototype, "updatedAt", void 0);
exports.TripRating = TripRating = __decorate([
    (0, typeorm_1.Entity)('trip_ratings')
], TripRating);


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SavedPlace = exports.PlaceType = void 0;
const typeorm_1 = __webpack_require__(17);
const user_entity_1 = __webpack_require__(19);
var PlaceType;
(function (PlaceType) {
    PlaceType["HOME"] = "home";
    PlaceType["WORK"] = "work";
    PlaceType["FAVORITE"] = "favorite";
    PlaceType["RECENT"] = "recent";
})(PlaceType || (exports.PlaceType = PlaceType = {}));
let SavedPlace = class SavedPlace {
};
exports.SavedPlace = SavedPlace;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SavedPlace.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.savedPlaces),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", String)
], SavedPlace.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], SavedPlace.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SavedPlace.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SavedPlace.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8 }),
    __metadata("design:type", Number)
], SavedPlace.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8 }),
    __metadata("design:type", Number)
], SavedPlace.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PlaceType,
        default: PlaceType.FAVORITE,
    }),
    __metadata("design:type", String)
], SavedPlace.prototype, "placeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SavedPlace.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], SavedPlace.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], SavedPlace.prototype, "updatedAt", void 0);
exports.SavedPlace = SavedPlace = __decorate([
    (0, typeorm_1.Entity)('saved_places')
], SavedPlace);


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const auth_service_1 = __webpack_require__(16);
const register_user_dto_1 = __webpack_require__(32);
const jwt_auth_guard_1 = __webpack_require__(34);
const current_user_decorator_1 = __webpack_require__(35);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async registerUser(dto) {
        return this.authService.registerUser(dto.phoneNumber, dto.password, dto.firstName, dto.lastName, dto.email);
    }
    async verifyPhone(dto) {
        return this.authService.verifyPhone(dto.userId, dto.code);
    }
    async loginUser(dto) {
        return this.authService.loginUser(dto.phoneNumber, dto.password);
    }
    async getProfile(user) {
        if (user.type === 'user') {
            return this.authService.validateUser(user.sub);
        }
        return this.authService.validateUser(user.sub);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register/user'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Register new user (rider)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof register_user_dto_1.RegisterUserDto !== "undefined" && register_user_dto_1.RegisterUserDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)('verify/user'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Verify user phone number' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof register_user_dto_1.VerifyPhoneDto !== "undefined" && register_user_dto_1.VerifyPhoneDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyPhone", null);
__decorate([
    (0, common_1.Post)('login/user'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof register_user_dto_1.LoginUserDto !== "undefined" && register_user_dto_1.LoginUserDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user/driver profile' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginUserDto = exports.VerifyPhoneDto = exports.RegisterUserDto = void 0;
const class_validator_1 = __webpack_require__(33);
const swagger_1 = __webpack_require__(3);
class RegisterUserDto {
}
exports.RegisterUserDto = RegisterUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+251912345678' }),
    (0, class_validator_1.IsPhoneNumber)('ET'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'password123', minLength: 6 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'john@example.com', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "email", void 0);
class VerifyPhoneDto {
}
exports.VerifyPhoneDto = VerifyPhoneDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyPhoneDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123456' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyPhoneDto.prototype, "code", void 0);
class LoginUserDto {
}
exports.LoginUserDto = LoginUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+251912345678' }),
    (0, class_validator_1.IsPhoneNumber)('ET'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginUserDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'password123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginUserDto.prototype, "password", void 0);


/***/ }),
/* 33 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(15);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurrentUser = void 0;
const common_1 = __webpack_require__(2);
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(15);
const passport_jwt_1 = __webpack_require__(37);
const config_1 = __webpack_require__(4);
const auth_service_1 = __webpack_require__(16);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, authService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
        this.configService = configService;
        this.authService = authService;
    }
    async validate(payload) {
        const { sub: id, type } = payload;
        if (type === 'user') {
            const user = await this.authService.validateUser(id);
            if (!user) {
                throw new common_1.UnauthorizedException();
            }
            return { ...user, type: 'user' };
        }
        else if (type === 'driver') {
            const driver = await this.authService.validateDriver(id);
            if (!driver) {
                throw new common_1.UnauthorizedException();
            }
            return { ...driver, type: 'driver' };
        }
        throw new common_1.UnauthorizedException();
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object])
], JwtStrategy);


/***/ }),
/* 37 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(15);
const passport_local_1 = __webpack_require__(39);
const auth_service_1 = __webpack_require__(16);
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super({
            usernameField: 'phoneNumber',
            passwordField: 'password',
        });
        this.authService = authService;
    }
    async validate(phoneNumber, password) {
        return { phoneNumber, password };
    }
};
exports.LocalStrategy = LocalStrategy;
exports.LocalStrategy = LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], LocalStrategy);


/***/ }),
/* 39 */
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const user_entity_1 = __webpack_require__(19);
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User])],
        controllers: [],
        providers: [],
        exports: [],
    })
], UsersModule);


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriversModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const driver_entity_1 = __webpack_require__(22);
let DriversModule = class DriversModule {
};
exports.DriversModule = DriversModule;
exports.DriversModule = DriversModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([driver_entity_1.Driver])],
        controllers: [],
        providers: [],
        exports: [],
    })
], DriversModule);


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RidesModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const ride_entity_1 = __webpack_require__(21);
const rides_controller_1 = __webpack_require__(43);
const rides_service_1 = __webpack_require__(44);
const dispatch_module_1 = __webpack_require__(50);
const notifications_module_1 = __webpack_require__(52);
let RidesModule = class RidesModule {
};
exports.RidesModule = RidesModule;
exports.RidesModule = RidesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([ride_entity_1.Ride]),
            dispatch_module_1.DispatchModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [rides_controller_1.RidesController],
        providers: [rides_service_1.RidesService],
        exports: [rides_service_1.RidesService],
    })
], RidesModule);


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RidesController_1;
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RidesController = void 0;
const common_1 = __webpack_require__(2);
const jwt_auth_guard_1 = __webpack_require__(34);
const current_user_decorator_1 = __webpack_require__(35);
const user_entity_1 = __webpack_require__(19);
const driver_entity_1 = __webpack_require__(22);
const ride_entity_1 = __webpack_require__(21);
const rides_service_1 = __webpack_require__(44);
let RidesController = RidesController_1 = class RidesController {
    constructor(ridesService) {
        this.ridesService = ridesService;
        this.logger = new common_1.Logger(RidesController_1.name);
    }
    async requestRide(user, requestBody) {
        try {
            const ride = await this.ridesService.requestRide(user.id, requestBody);
            return { success: true, data: ride };
        }
        catch (error) {
            this.logger.error(`Error requesting ride: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to request ride', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getRideById(user, rideId) {
        try {
            const ride = await this.ridesService.getRideById(rideId, user.id);
            if (!ride) {
                throw new common_1.HttpException('Ride not found', common_1.HttpStatus.NOT_FOUND);
            }
            return { success: true, data: ride };
        }
        catch (error) {
            this.logger.error(`Error getting ride: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to get ride', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async cancelRide(user, rideId, reason) {
        try {
            const result = await this.ridesService.cancelRide(rideId, user.id, 'user', reason);
            return { success: true, data: result };
        }
        catch (error) {
            this.logger.error(`Error cancelling ride: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to cancel ride', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getActiveRidesForUser(user) {
        try {
            const rides = await this.ridesService.getActiveRidesForUser(user.id);
            return { success: true, data: rides };
        }
        catch (error) {
            this.logger.error(`Error getting active rides: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to get active rides', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getRideHistoryForUser(user) {
        try {
            const rides = await this.ridesService.getRideHistoryForUser(user.id);
            return { success: true, data: rides };
        }
        catch (error) {
            this.logger.error(`Error getting ride history: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to get ride history', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getNearbyDrivers(lat, lon, radius = 5, limit = 10) {
        try {
            const drivers = await this.ridesService.getNearbyDrivers({
                lat,
                lon,
                radius: radius || 5,
                limit: limit || 10,
            });
            return { success: true, data: drivers };
        }
        catch (error) {
            this.logger.error(`Error getting nearby drivers: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to get nearby drivers', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async acceptRide(driver, rideId) {
        try {
            const result = await this.ridesService.acceptRide(rideId, driver.id);
            return { success: true, data: result };
        }
        catch (error) {
            this.logger.error(`Error accepting ride: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to accept ride', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async markRideArriving(driver, rideId) {
        try {
            const result = await this.ridesService.markRideStatus(rideId, driver.id, ride_entity_1.RideStatus.DRIVER_ARRIVED);
            return { success: true, data: result };
        }
        catch (error) {
            this.logger.error(`Error marking ride as arriving: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to mark ride as arriving', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async startRide(driver, rideId) {
        try {
            const result = await this.ridesService.startRide(rideId, driver.id);
            return { success: true, data: result };
        }
        catch (error) {
            this.logger.error(`Error starting ride: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to start ride', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async completeRide(driver, rideId, body) {
        try {
            const result = await this.ridesService.completeRide(rideId, driver.id, body);
            return { success: true, data: result };
        }
        catch (error) {
            this.logger.error(`Error completing ride: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to complete ride', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async cancelRideByDriver(driver, rideId, reason) {
        try {
            const result = await this.ridesService.cancelRide(rideId, driver.id, 'driver', reason);
            return { success: true, data: result };
        }
        catch (error) {
            this.logger.error(`Error cancelling ride by driver: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to cancel ride', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getActiveRidesForDriver(driver) {
        try {
            const rides = await this.ridesService.getActiveRidesForDriver(driver.id);
            return { success: true, data: rides };
        }
        catch (error) {
            this.logger.error(`Error getting active rides for driver: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to get active rides', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.RidesController = RidesController;
__decorate([
    (0, common_1.Post)('request'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], RidesController.prototype, "requestRide", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _c : Object, String]),
    __metadata("design:returntype", Promise)
], RidesController.prototype, "getRideById", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _d : Object, String, String]),
    __metadata("design:returntype", Promise)
], RidesController.prototype, "cancelRide", null);
__decorate([
    (0, common_1.Get)('active/user'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], RidesController.prototype, "getActiveRidesForUser", null);
__decorate([
    (0, common_1.Get)('history/user'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], RidesController.prototype, "getRideHistoryForUser", null);
__decorate([
    (0, common_1.Get)('nearby-drivers'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lon')),
    __param(2, (0, common_1.Query)('radius')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], RidesController.prototype, "getNearbyDrivers", null);
__decorate([
    (0, common_1.Put)(':id/accept'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof driver_entity_1.Driver !== "undefined" && driver_entity_1.Driver) === "function" ? _g : Object, String]),
    __metadata("design:returntype", Promise)
], RidesController.prototype, "acceptRide", null);
__decorate([
    (0, common_1.Put)(':id/arriving'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof driver_entity_1.Driver !== "undefined" && driver_entity_1.Driver) === "function" ? _h : Object, String]),
    __metadata("design:returntype", Promise)
], RidesController.prototype, "markRideArriving", null);
__decorate([
    (0, common_1.Put)(':id/start'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof driver_entity_1.Driver !== "undefined" && driver_entity_1.Driver) === "function" ? _j : Object, String]),
    __metadata("design:returntype", Promise)
], RidesController.prototype, "startRide", null);
__decorate([
    (0, common_1.Put)(':id/complete'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof driver_entity_1.Driver !== "undefined" && driver_entity_1.Driver) === "function" ? _k : Object, String, Object]),
    __metadata("design:returntype", Promise)
], RidesController.prototype, "completeRide", null);
__decorate([
    (0, common_1.Put)(':id/cancel-driver'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof driver_entity_1.Driver !== "undefined" && driver_entity_1.Driver) === "function" ? _l : Object, String, String]),
    __metadata("design:returntype", Promise)
], RidesController.prototype, "cancelRideByDriver", null);
__decorate([
    (0, common_1.Get)('active/driver'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof driver_entity_1.Driver !== "undefined" && driver_entity_1.Driver) === "function" ? _m : Object]),
    __metadata("design:returntype", Promise)
], RidesController.prototype, "getActiveRidesForDriver", null);
exports.RidesController = RidesController = RidesController_1 = __decorate([
    (0, common_1.Controller)('rides'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof rides_service_1.RidesService !== "undefined" && rides_service_1.RidesService) === "function" ? _a : Object])
], RidesController);


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RidesService_1;
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RidesService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(17);
const ride_entity_1 = __webpack_require__(21);
const user_entity_1 = __webpack_require__(19);
const driver_entity_1 = __webpack_require__(22);
const ride_type_entity_1 = __webpack_require__(24);
const trip_payment_entity_1 = __webpack_require__(28);
const trip_rating_entity_1 = __webpack_require__(29);
const driver_location_entity_1 = __webpack_require__(45);
const driver_entity_2 = __webpack_require__(22);
const dispatch_service_1 = __webpack_require__(46);
const notification_service_1 = __webpack_require__(48);
const distance_util_1 = __webpack_require__(47);
const typeorm_3 = __webpack_require__(17);
let RidesService = RidesService_1 = class RidesService {
    constructor(rideRepository, userRepository, driverRepository, rideTypeRepository, paymentRepository, ratingRepository, driverLocationRepository, dispatchService, notificationService) {
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.rideTypeRepository = rideTypeRepository;
        this.paymentRepository = paymentRepository;
        this.ratingRepository = ratingRepository;
        this.driverLocationRepository = driverLocationRepository;
        this.dispatchService = dispatchService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(RidesService_1.name);
    }
    async onModuleInit() {
        this.startScheduledTasks();
    }
    startScheduledTasks() {
        setInterval(async () => {
            await this.checkDispatchTimeouts();
        }, 30000);
    }
    async checkDispatchTimeouts() {
        try {
            const assignedRides = await this.rideRepository.find({
                where: {
                    status: ride_entity_1.RideStatus.DRIVER_ASSIGNED,
                    assignedAt: (0, typeorm_2.MoreThanOrEqual)(new Date(Date.now() - 60000)),
                },
                relations: ['driver'],
            });
            for (const ride of assignedRides) {
                if (ride.assignedAt) {
                    const timeSinceAssignment = Date.now() - ride.assignedAt.getTime();
                    const dispatchTimeout = 120000;
                    if (timeSinceAssignment > dispatchTimeout) {
                        await this.dispatchService.handleDispatchTimeout(ride.id);
                    }
                }
            }
        }
        catch (error) {
            this.logger.error(`Error checking dispatch timeouts: ${error.message}`);
        }
    }
    async requestRide(userId, rideData) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const rideType = await this.rideTypeRepository.findOne({
                where: { id: rideData.rideTypeId },
            });
            if (!rideType) {
                throw new Error('Invalid ride type');
            }
            const distance = (0, distance_util_1.calculateDistance)(rideData.pickupLatitude, rideData.pickupLongitude, rideData.dropoffLatitude, rideData.dropoffLongitude);
            const estimatedDuration = this.estimateDuration(distance);
            const baseFare = 2.50;
            const distanceRate = 1.50;
            const timeRate = 0.30;
            const distanceFare = distance * distanceRate;
            const timeFare = (estimatedDuration / 60) * timeRate;
            const surgeMultiplier = 1.0;
            const totalFare = (baseFare + distanceFare + timeFare) * surgeMultiplier;
            const ride = new ride_entity_1.Ride();
            ride.userId = userId;
            ride.rideTypeId = rideData.rideTypeId;
            ride.pickupLatitude = rideData.pickupLatitude;
            ride.pickupLongitude = rideData.pickupLongitude;
            ride.pickupAddress = rideData.pickupAddress;
            ride.dropoffLatitude = rideData.dropoffLatitude;
            ride.dropoffLongitude = rideData.dropoffLongitude;
            ride.dropoffAddress = rideData.dropoffAddress;
            ride.distance = distance;
            ride.duration = estimatedDuration;
            ride.estimatedDistance = distance;
            ride.estimatedDuration = estimatedDuration;
            ride.baseFare = baseFare;
            ride.distanceFare = distanceFare;
            ride.timeFare = timeFare;
            ride.surgeMultiplier = surgeMultiplier;
            ride.totalFare = totalFare;
            ride.finalFare = totalFare;
            if (rideData.promoCodeId) {
                ride.promoCodeId = rideData.promoCodeId;
            }
            ride.requestedAt = new Date();
            ride.status = ride_entity_1.RideStatus.REQUESTED;
            if (rideData.scheduledTime) {
                ride.isScheduled = true;
                ride.scheduledTime = new Date(rideData.scheduledTime);
            }
            const savedRide = await this.rideRepository.save(ride);
            if (!ride.isScheduled) {
                try {
                    await this.dispatchService.dispatchRide(savedRide.id);
                }
                catch (error) {
                    this.logger.error(`Failed to dispatch ride ${savedRide.id}: ${error.message}`);
                }
            }
            await this.notificationService.sendRideNotification(userId, 'ride_requested', 'Ride Requested', 'Your ride has been requested', { rideId: savedRide.id });
            return savedRide;
        }
        catch (error) {
            this.logger.error(`Error requesting ride: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getRideById(rideId, userId) {
        const ride = await this.rideRepository.findOne({
            where: { id: rideId },
            relations: ['user', 'driver', 'rideType', 'payment', 'rating'],
        });
        if (!ride) {
            throw new common_1.NotFoundException('Ride not found');
        }
        if (ride.userId !== userId && ride.driverId !== userId) {
            throw new Error('Unauthorized access to ride');
        }
        return ride;
    }
    async cancelRide(rideId, actorId, actorType, reason) {
        const ride = await this.rideRepository.findOne({
            where: { id: rideId },
            relations: ['user', 'driver'],
        });
        if (!ride) {
            throw new common_1.NotFoundException('Ride not found');
        }
        if ((actorType === 'user' && ride.userId !== actorId) ||
            (actorType === 'driver' && ride.driverId !== actorId)) {
            throw new Error('Unauthorized to cancel this ride');
        }
        if (![ride_entity_1.RideStatus.REQUESTED, ride_entity_1.RideStatus.DRIVER_ASSIGNED, ride_entity_1.RideStatus.DRIVER_ARRIVED].includes(ride.status)) {
            throw new Error('Cannot cancel ride in current status');
        }
        ride.status = ride_entity_1.RideStatus.CANCELLED;
        ride.cancelledAt = new Date();
        ride.cancellationReason = reason ? ride_entity_1.CancellationReason.OTHER : ride_entity_1.CancellationReason.USER_CANCELLED;
        ride.cancellationNote = reason;
        ride.cancelledBy = actorType;
        const updatedRide = await this.rideRepository.save(ride);
        if (ride.driverId) {
            const driver = await this.driverRepository.findOne({
                where: { id: ride.driverId },
            });
            if (driver) {
                driver.availability = driver_entity_2.DriverAvailability.ONLINE;
                await this.driverRepository.save(driver);
            }
            await this.notificationService.sendRideNotification(ride.driverId, 'ride_cancelled', 'Ride Cancelled', `Ride was cancelled by ${actorType}`, { rideId: updatedRide.id });
        }
        await this.notificationService.sendRideNotification(ride.userId, 'ride_cancelled', 'Ride Cancelled', `Your ride was cancelled`, { rideId: updatedRide.id });
        return updatedRide;
    }
    async acceptRide(rideId, driverId) {
        const ride = await this.rideRepository.findOne({
            where: { id: rideId },
            relations: ['user', 'driver', 'rideType'],
        });
        if (!ride) {
            throw new common_1.NotFoundException('Ride not found');
        }
        if (ride.status !== ride_entity_1.RideStatus.REQUESTED) {
            throw new Error('Ride is not available for acceptance');
        }
        ride.driverId = driverId;
        ride.status = ride_entity_1.RideStatus.DRIVER_ASSIGNED;
        ride.assignedAt = new Date();
        const updatedRide = await this.rideRepository.save(ride);
        const driver = await this.driverRepository.findOne({
            where: { id: driverId },
        });
        if (driver) {
            driver.availability = driver_entity_2.DriverAvailability.ON_TRIP;
            await this.driverRepository.save(driver);
        }
        await this.notificationService.sendRideNotification(ride.userId, 'ride_accepted', 'Driver Assigned', 'A driver has been assigned to your ride', { rideId: updatedRide.id, driverId });
        await this.notificationService.sendRideNotification(driverId, 'ride_accepted', 'Ride Accepted', 'You have accepted a ride', { rideId: updatedRide.id });
        return updatedRide;
    }
    async markRideStatus(rideId, driverId, status) {
        const ride = await this.rideRepository.findOne({
            where: { id: rideId },
            relations: ['user', 'driver'],
        });
        if (!ride) {
            throw new common_1.NotFoundException('Ride not found');
        }
        if (ride.driverId !== driverId) {
            throw new Error('Unauthorized to update this ride');
        }
        if (status === ride_entity_1.RideStatus.DRIVER_ARRIVED && ride.status !== ride_entity_1.RideStatus.DRIVER_ASSIGNED) {
            throw new Error('Ride must be assigned before arriving');
        }
        ride.status = status;
        if (status === ride_entity_1.RideStatus.DRIVER_ARRIVED) {
            ride.arrivedAt = new Date();
        }
        const updatedRide = await this.rideRepository.save(ride);
        if (status === ride_entity_1.RideStatus.DRIVER_ARRIVED) {
            await this.notificationService.sendRideNotification(ride.userId, 'driver_arrived', 'Driver Arrived', 'Your driver has arrived at the pickup location', { rideId: updatedRide.id });
        }
        return updatedRide;
    }
    async startRide(rideId, driverId) {
        const ride = await this.rideRepository.findOne({
            where: { id: rideId },
            relations: ['user', 'driver'],
        });
        if (!ride) {
            throw new common_1.NotFoundException('Ride not found');
        }
        if (ride.driverId !== driverId) {
            throw new Error('Unauthorized to start this ride');
        }
        if (![ride_entity_1.RideStatus.DRIVER_ASSIGNED, ride_entity_1.RideStatus.DRIVER_ARRIVED].includes(ride.status)) {
            throw new Error('Ride must be assigned or arrived before starting');
        }
        ride.status = ride_entity_1.RideStatus.IN_PROGRESS;
        ride.startedAt = new Date();
        const updatedRide = await this.rideRepository.save(ride);
        await this.notificationService.sendRideNotification(ride.userId, 'ride_started', 'Ride Started', 'Your ride has started', { rideId: updatedRide.id });
        return updatedRide;
    }
    async completeRide(rideId, driverId, data) {
        const ride = await this.rideRepository.findOne({
            where: { id: rideId },
            relations: ['user', 'driver', 'rideType'],
        });
        if (!ride) {
            throw new common_1.NotFoundException('Ride not found');
        }
        if (ride.driverId !== driverId) {
            throw new Error('Unauthorized to complete this ride');
        }
        if (ride.status !== ride_entity_1.RideStatus.IN_PROGRESS) {
            throw new Error('Ride must be in progress to complete');
        }
        if (data?.distance) {
            ride.distance = data.distance;
        }
        if (data?.duration) {
            ride.duration = data.duration;
        }
        ride.status = ride_entity_1.RideStatus.COMPLETED;
        ride.completedAt = new Date();
        if (ride.driverId) {
            await this.driverRepository.update({ id: ride.driverId }, {
                totalRides: () => 'total_rides + 1',
                rating: () => 'COALESCE(rating, 0)',
            });
        }
        const updatedRide = await this.rideRepository.save(ride);
        const payment = new trip_payment_entity_1.TripPayment();
        payment.rideId = updatedRide.id;
        payment.amount = updatedRide.finalFare;
        await this.paymentRepository.save(payment);
        await this.notificationService.sendRideNotification(ride.userId, 'ride_completed', 'Ride Completed', `Your ride has been completed. Fare: $${updatedRide.finalFare?.toFixed(2)}`, { rideId: updatedRide.id, fare: updatedRide.finalFare });
        return updatedRide;
    }
    async getActiveRidesForUser(userId) {
        return await this.rideRepository.find({
            where: {
                userId,
                status: (0, typeorm_3.In)([ride_entity_1.RideStatus.REQUESTED, ride_entity_1.RideStatus.DRIVER_ASSIGNED, ride_entity_1.RideStatus.DRIVER_ARRIVED, ride_entity_1.RideStatus.IN_PROGRESS]),
            },
            relations: ['driver', 'rideType'],
            order: { createdAt: 'DESC' },
        });
    }
    async getRideHistoryForUser(userId) {
        return await this.rideRepository.find({
            where: {
                userId,
                status: (0, typeorm_3.In)([ride_entity_1.RideStatus.COMPLETED, ride_entity_1.RideStatus.CANCELLED]),
            },
            relations: ['driver', 'rideType', 'payment'],
            order: { createdAt: 'DESC' },
            take: 50,
        });
    }
    async getActiveRidesForDriver(driverId) {
        return await this.rideRepository.find({
            where: {
                driverId,
                status: (0, typeorm_3.In)([ride_entity_1.RideStatus.DRIVER_ASSIGNED, ride_entity_1.RideStatus.DRIVER_ARRIVED, ride_entity_1.RideStatus.IN_PROGRESS]),
            },
            relations: ['user', 'rideType'],
            order: { createdAt: 'DESC' },
        });
    }
    async getNearbyDrivers(params) {
        const distanceSQL = (0, distance_util_1.getDistanceSQL)('driver.latitude', 'driver.longitude', params.lat, params.lon);
        const drivers = await this.driverRepository
            .createQueryBuilder('driver')
            .leftJoinAndSelect('driver.vehicles', 'vehicle')
            .where('driver.availability = :availability', {
            availability: driver_entity_2.DriverAvailability.ONLINE,
        })
            .andWhere('driver.status = :status', { status: 'approved' })
            .andWhere('driver.latitude IS NOT NULL')
            .andWhere('driver.longitude IS NOT NULL')
            .andWhere(`${distanceSQL} <= :radius`, {
            radius: params.radius,
        })
            .orderBy(distanceSQL, 'ASC')
            .limit(params.limit)
            .getMany();
        return drivers.map(driver => ({
            id: driver.id,
            firstName: driver.firstName,
            lastName: driver.lastName,
            rating: driver.rating,
            totalRides: driver.totalRides,
            latitude: driver.latitude,
            longitude: driver.longitude,
            distance: (0, distance_util_1.calculateDistance)(params.lat, params.lon, driver.latitude, driver.longitude),
            vehicle: driver.vehicles?.[0],
        }));
    }
    estimateDuration(distanceInKm) {
        const averageSpeedKmh = 20;
        const durationHours = distanceInKm / averageSpeedKmh;
        return Math.round(durationHours * 3600);
    }
};
exports.RidesService = RidesService;
exports.RidesService = RidesService = RidesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ride_entity_1.Ride)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __param(3, (0, typeorm_1.InjectRepository)(ride_type_entity_1.RideType)),
    __param(4, (0, typeorm_1.InjectRepository)(trip_payment_entity_1.TripPayment)),
    __param(5, (0, typeorm_1.InjectRepository)(trip_rating_entity_1.TripRating)),
    __param(6, (0, typeorm_1.InjectRepository)(driver_location_entity_1.DriverLocation)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object, typeof (_f = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _f : Object, typeof (_g = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _g : Object, typeof (_h = typeof dispatch_service_1.DispatchService !== "undefined" && dispatch_service_1.DispatchService) === "function" ? _h : Object, typeof (_j = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _j : Object])
], RidesService);


/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DriverLocation = void 0;
const typeorm_1 = __webpack_require__(17);
const driver_entity_1 = __webpack_require__(22);
let DriverLocation = class DriverLocation {
};
exports.DriverLocation = DriverLocation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DriverLocation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.Driver),
    (0, typeorm_1.JoinColumn)({ name: 'driver_id' }),
    __metadata("design:type", String)
], DriverLocation.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.Driver),
    (0, typeorm_1.JoinColumn)({ name: 'driver_id' }),
    __metadata("design:type", typeof (_a = typeof driver_entity_1.Driver !== "undefined" && driver_entity_1.Driver) === "function" ? _a : Object)
], DriverLocation.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], DriverLocation.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8 }),
    __metadata("design:type", Number)
], DriverLocation.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], DriverLocation.prototype, "heading", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], DriverLocation.prototype, "speed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 1, nullable: true }),
    __metadata("design:type", Number)
], DriverLocation.prototype, "accuracy", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], DriverLocation.prototype, "createdAt", void 0);
exports.DriverLocation = DriverLocation = __decorate([
    (0, typeorm_1.Entity)('driver_locations'),
    (0, typeorm_1.Index)(['driverId', 'createdAt']),
    (0, typeorm_1.Index)(['latitude', 'longitude'])
], DriverLocation);


/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DispatchService_1;
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatchService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(17);
const config_1 = __webpack_require__(4);
const driver_entity_1 = __webpack_require__(22);
const ride_entity_1 = __webpack_require__(21);
const driver_location_entity_1 = __webpack_require__(45);
const driver_entity_2 = __webpack_require__(22);
const ride_entity_2 = __webpack_require__(21);
const distance_util_1 = __webpack_require__(47);
let DispatchService = DispatchService_1 = class DispatchService {
    constructor(driverRepository, rideRepository, driverLocationRepository, configService) {
        this.driverRepository = driverRepository;
        this.rideRepository = rideRepository;
        this.driverLocationRepository = driverLocationRepository;
        this.configService = configService;
        this.logger = new common_1.Logger(DispatchService_1.name);
        this.dispatchRadius = parseFloat(this.configService.get('DISPATCH_RADIUS_KM', '3'));
        this.dispatchTimeout = parseInt(this.configService.get('DISPATCH_TIMEOUT_SECONDS', '30'));
        this.maxRetries = parseInt(this.configService.get('DISPATCH_MAX_RETRIES', '3'));
        this.maxRadius = this.dispatchRadius * 3;
    }
    async findNearestDriver(rideId, pickupLat, pickupLon, rideTypeId, radiusKm = this.dispatchRadius) {
        try {
            const distanceSQL = (0, distance_util_1.getDistanceSQL)('driver.latitude', 'driver.longitude', pickupLat, pickupLon);
            const drivers = await this.driverRepository
                .createQueryBuilder('driver')
                .leftJoinAndSelect('driver.vehicles', 'vehicle')
                .where('driver.availability = :availability', {
                availability: driver_entity_2.DriverAvailability.ONLINE,
            })
                .andWhere('driver.status = :status', {
                status: 'approved',
            })
                .andWhere('driver.latitude IS NOT NULL')
                .andWhere('driver.longitude IS NOT NULL')
                .andWhere('vehicle.rideTypeId = :rideTypeId', { rideTypeId })
                .andWhere('vehicle.status = :vehicleStatus', {
                vehicleStatus: 'approved',
            })
                .andWhere(`${distanceSQL} <= :radius`, {
                radius: radiusKm,
            })
                .orderBy(distanceSQL, 'ASC')
                .limit(10)
                .getMany();
            if (drivers.length === 0) {
                this.logger.warn(`No drivers found within ${radiusKm}km for ride ${rideId}`);
                return null;
            }
            let bestDriver = drivers[0];
            let bestScore = this.calculateDriverScore(bestDriver, pickupLat, pickupLon);
            for (const driver of drivers.slice(1)) {
                const score = this.calculateDriverScore(driver, pickupLat, pickupLon);
                if (score > bestScore) {
                    bestDriver = driver;
                    bestScore = score;
                }
            }
            this.logger.log(`Found driver ${bestDriver.id} for ride ${rideId} at ${radiusKm}km radius`);
            return bestDriver;
        }
        catch (error) {
            this.logger.error(`Error finding nearest driver: ${error.message}`, error.stack);
            return null;
        }
    }
    calculateDriverScore(driver, pickupLat, pickupLon) {
        const ratingScore = (driver.rating || 0) * 0.4;
        const experienceScore = Math.min(driver.totalRides / 100, 1) * 0.2;
        const distance = (0, distance_util_1.calculateDistance)(pickupLat, pickupLon, driver.latitude || 0, driver.longitude || 0);
        const normalizedDistance = Math.max(0, 1 - distance / 10);
        const distanceScore = normalizedDistance * 0.4;
        return ratingScore + experienceScore + distanceScore;
    }
    async dispatchRide(rideId, retryCount = 0) {
        try {
            const ride = await this.rideRepository.findOne({
                where: { id: rideId },
                relations: ['rideType'],
            });
            if (!ride) {
                return { success: false, error: 'Ride not found' };
            }
            if (ride.status !== ride_entity_2.RideStatus.REQUESTED) {
                return { success: false, error: 'Ride is not in requested status' };
            }
            const radiusKm = this.dispatchRadius + retryCount * (this.dispatchRadius / 2);
            if (radiusKm > this.maxRadius) {
                return {
                    success: false,
                    error: 'No drivers available within maximum radius',
                };
            }
            const driver = await this.findNearestDriver(rideId, ride.pickupLatitude, ride.pickupLongitude, ride.rideTypeId, radiusKm);
            if (!driver) {
                if (retryCount < this.maxRetries) {
                    this.logger.log(`Retrying dispatch for ride ${rideId}, attempt ${retryCount + 1}`);
                    return this.dispatchRide(rideId, retryCount + 1);
                }
                return { success: false, error: 'No available drivers found' };
            }
            ride.driverId = driver.id;
            ride.status = ride_entity_2.RideStatus.DRIVER_ASSIGNED;
            ride.assignedAt = new Date();
            await this.rideRepository.save(ride);
            driver.availability = driver_entity_2.DriverAvailability.ON_TRIP;
            await this.driverRepository.save(driver);
            this.logger.log(`Ride ${rideId} dispatched to driver ${driver.id} on attempt ${retryCount + 1}`);
            return { success: true, driverId: driver.id };
        }
        catch (error) {
            this.logger.error(`Error dispatching ride ${rideId}: ${error.message}`, error.stack);
            return { success: false, error: error.message };
        }
    }
    async handleDriverRejection(rideId, driverId) {
        try {
            const ride = await this.rideRepository.findOne({
                where: { id: rideId },
            });
            if (!ride || ride.driverId !== driverId) {
                return { success: false };
            }
            ride.driverId = null;
            ride.status = ride_entity_2.RideStatus.REQUESTED;
            ride.assignedAt = null;
            await this.rideRepository.save(ride);
            const driver = await this.driverRepository.findOne({
                where: { id: driverId },
            });
            if (driver) {
                driver.availability = driver_entity_2.DriverAvailability.ONLINE;
                await this.driverRepository.save(driver);
            }
            return this.dispatchRide(rideId, 1);
        }
        catch (error) {
            this.logger.error(`Error handling driver rejection: ${error.message}`, error.stack);
            return { success: false };
        }
    }
    async handleDispatchTimeout(rideId) {
        try {
            const ride = await this.rideRepository.findOne({
                where: { id: rideId },
            });
            if (!ride ||
                ride.status !== ride_entity_2.RideStatus.DRIVER_ASSIGNED ||
                !ride.assignedAt) {
                return;
            }
            const timeSinceAssignment = Date.now() - ride.assignedAt.getTime();
            if (timeSinceAssignment < this.dispatchTimeout * 1000) {
                return;
            }
            this.logger.warn(`Dispatch timeout for ride ${rideId}, reassigning...`);
            const driverId = ride.driverId;
            await this.handleDriverRejection(rideId, driverId);
        }
        catch (error) {
            this.logger.error(`Error handling dispatch timeout: ${error.message}`, error.stack);
        }
    }
    async getNearbyDrivers(lat, lon, radiusKm = 5, limit = 20) {
        try {
            const distanceSQL = (0, distance_util_1.getDistanceSQL)('driver.latitude', 'driver.longitude', lat, lon);
            return await this.driverRepository
                .createQueryBuilder('driver')
                .leftJoinAndSelect('driver.vehicles', 'vehicle')
                .where('driver.availability = :availability', {
                availability: driver_entity_2.DriverAvailability.ONLINE,
            })
                .andWhere('driver.status = :status', { status: 'approved' })
                .andWhere('driver.latitude IS NOT NULL')
                .andWhere('driver.longitude IS NOT NULL')
                .andWhere(`${distanceSQL} <= :radius`, {
                radius: radiusKm,
            })
                .orderBy(distanceSQL, 'ASC')
                .limit(limit)
                .getMany();
        }
        catch (error) {
            this.logger.error(`Error getting nearby drivers: ${error.message}`, error.stack);
            return [];
        }
    }
};
exports.DispatchService = DispatchService;
exports.DispatchService = DispatchService = DispatchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __param(1, (0, typeorm_1.InjectRepository)(ride_entity_1.Ride)),
    __param(2, (0, typeorm_1.InjectRepository)(driver_location_entity_1.DriverLocation)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _d : Object])
], DispatchService);


/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.calculateDistance = calculateDistance;
exports.getDistanceSQL = getDistanceSQL;
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
function getDistanceSQL(latColumn, lonColumn, lat, lon) {
    return `(
    6371 * acos(
      cos(radians(${lat})) *
      cos(radians(${latColumn})) *
      cos(radians(${lonColumn}) - radians(${lon})) +
      sin(radians(${lat})) *
      sin(radians(${latColumn}))
    )
  )`;
}


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(17);
const notification_entity_1 = __webpack_require__(49);
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
        this.logger = new common_1.Logger(NotificationService_1.name);
    }
    async createNotification(data) {
        const notification = new notification_entity_1.Notification();
        notification.userId = data.userId;
        notification.driverId = data.driverId;
        notification.type = data.type;
        notification.title = data.title;
        notification.message = data.message;
        notification.data = data.data || {};
        return await this.notificationRepository.save(notification);
    }
    async sendRideNotification(userId, type, title, message, data) {
        const notificationType = this.mapRideNotificationType(type);
        return await this.createNotification({
            userId,
            type: notificationType,
            title,
            message,
            data,
        });
    }
    async getUserNotifications(userId, limit = 50, offset = 0, unreadOnly = false) {
        const queryBuilder = this.notificationRepository
            .createQueryBuilder('notification')
            .where('notification.userId = :userId', { userId })
            .orderBy('notification.createdAt', 'DESC')
            .limit(limit)
            .offset(offset);
        if (unreadOnly) {
            queryBuilder.andWhere('notification.isRead = false');
        }
        return await queryBuilder.getMany();
    }
    async getDriverNotifications(driverId, limit = 50, offset = 0, unreadOnly = false) {
        const queryBuilder = this.notificationRepository
            .createQueryBuilder('notification')
            .where('notification.driverId = :driverId', { driverId })
            .orderBy('notification.createdAt', 'DESC')
            .limit(limit)
            .offset(offset);
        if (unreadOnly) {
            queryBuilder.andWhere('notification.isRead = false');
        }
        return await queryBuilder.getMany();
    }
    async markAsRead(notificationId, userId, driverId) {
        const whereClause = { id: notificationId };
        if (userId) {
            whereClause.userId = userId;
        }
        else if (driverId) {
            whereClause.driverId = driverId;
        }
        const result = await this.notificationRepository.update(whereClause, {
            isRead: true,
            readAt: new Date(),
        });
        return result.affected > 0;
    }
    async markAllAsRead(userId, driverId) {
        const whereClause = {};
        if (userId) {
            whereClause.userId = userId;
        }
        else if (driverId) {
            whereClause.driverId = driverId;
        }
        const result = await this.notificationRepository.update({ ...whereClause, isRead: false }, { isRead: true, readAt: new Date() });
        return result.affected > 0;
    }
    async countUnread(userId, driverId) {
        const whereClause = { isRead: false };
        if (userId) {
            whereClause.userId = userId;
        }
        else if (driverId) {
            whereClause.driverId = driverId;
        }
        return await this.notificationRepository.count({
            where: whereClause,
        });
    }
    mapRideNotificationType(type) {
        const mapping = {
            'ride_requested': notification_entity_1.NotificationType.RIDE_REQUEST,
            'ride_accepted': notification_entity_1.NotificationType.RIDE_ACCEPTED,
            'driver_arrived': notification_entity_1.NotificationType.DRIVER_ARRIVING,
            'ride_started': notification_entity_1.NotificationType.RIDE_STARTED,
            'ride_completed': notification_entity_1.NotificationType.RIDE_COMPLETED,
            'ride_cancelled': notification_entity_1.NotificationType.RIDE_CANCELLED,
            'payment_received': notification_entity_1.NotificationType.PAYMENT_RECEIVED,
            'payment_failed': notification_entity_1.NotificationType.PAYMENT_FAILED,
            'driver_approved': notification_entity_1.NotificationType.DRIVER_APPROVED,
            'driver_rejected': notification_entity_1.NotificationType.DRIVER_REJECTED,
            'promo_code': notification_entity_1.NotificationType.PROMO_CODE,
            'system_announcement': notification_entity_1.NotificationType.SYSTEM_ANNOUNCEMENT,
        };
        return mapping[type] || type;
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], NotificationService);


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Notification = exports.NotificationType = void 0;
const typeorm_1 = __webpack_require__(17);
var NotificationType;
(function (NotificationType) {
    NotificationType["RIDE_REQUEST"] = "ride_request";
    NotificationType["RIDE_ACCEPTED"] = "ride_accepted";
    NotificationType["DRIVER_ARRIVING"] = "driver_arriving";
    NotificationType["RIDE_STARTED"] = "ride_started";
    NotificationType["RIDE_COMPLETED"] = "ride_completed";
    NotificationType["RIDE_CANCELLED"] = "ride_cancelled";
    NotificationType["PAYMENT_RECEIVED"] = "payment_received";
    NotificationType["PAYMENT_FAILED"] = "payment_failed";
    NotificationType["WALLET_DEPOSIT"] = "wallet_deposit";
    NotificationType["WALLET_WITHDRAWAL"] = "wallet_withdrawal";
    NotificationType["DRIVER_APPROVED"] = "driver_approved";
    NotificationType["DRIVER_REJECTED"] = "driver_rejected";
    NotificationType["PROMO_CODE"] = "promo_code";
    NotificationType["SYSTEM_ANNOUNCEMENT"] = "system_announcement";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
let Notification = class Notification {
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: NotificationType,
    }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Record !== "undefined" && Record) === "function" ? _a : Object)
], Notification.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Notification.prototype, "readAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isSent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Notification.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Notification.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Notification.prototype, "updatedAt", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)('notifications'),
    (0, typeorm_1.Index)(['userId', 'isRead', 'createdAt']),
    (0, typeorm_1.Index)(['driverId', 'isRead', 'createdAt'])
], Notification);


/***/ }),
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatchModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const dispatch_service_1 = __webpack_require__(46);
const dispatch_controller_1 = __webpack_require__(51);
const driver_entity_1 = __webpack_require__(22);
const ride_entity_1 = __webpack_require__(21);
const driver_location_entity_1 = __webpack_require__(45);
let DispatchModule = class DispatchModule {
};
exports.DispatchModule = DispatchModule;
exports.DispatchModule = DispatchModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([driver_entity_1.Driver, ride_entity_1.Ride, driver_location_entity_1.DriverLocation])],
        providers: [dispatch_service_1.DispatchService],
        controllers: [dispatch_controller_1.DispatchController],
        exports: [dispatch_service_1.DispatchService],
    })
], DispatchModule);


/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatchController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const dispatch_service_1 = __webpack_require__(46);
const jwt_auth_guard_1 = __webpack_require__(34);
let DispatchController = class DispatchController {
    constructor(dispatchService) {
        this.dispatchService = dispatchService;
    }
    async dispatchRide(rideId) {
        return this.dispatchService.dispatchRide(rideId);
    }
    async getNearbyDrivers(lat, lon, radius = 5, limit = 20) {
        return this.dispatchService.getNearbyDrivers(parseFloat(lat.toString()), parseFloat(lon.toString()), radius, limit);
    }
};
exports.DispatchController = DispatchController;
__decorate([
    (0, common_1.Post)('assign'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Manually trigger ride dispatch' }),
    __param(0, (0, common_1.Body)('rideId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DispatchController.prototype, "dispatchRide", null);
__decorate([
    (0, common_1.Get)('nearby-drivers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get nearby drivers for a location' }),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lon')),
    __param(2, (0, common_1.Query)('radius')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], DispatchController.prototype, "getNearbyDrivers", null);
exports.DispatchController = DispatchController = __decorate([
    (0, swagger_1.ApiTags)('dispatch'),
    (0, common_1.Controller)('dispatch'),
    __metadata("design:paramtypes", [typeof (_a = typeof dispatch_service_1.DispatchService !== "undefined" && dispatch_service_1.DispatchService) === "function" ? _a : Object])
], DispatchController);


/***/ }),
/* 52 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const notification_entity_1 = __webpack_require__(49);
const notification_controller_1 = __webpack_require__(53);
const notification_service_1 = __webpack_require__(48);
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([notification_entity_1.Notification]),
        ],
        controllers: [notification_controller_1.NotificationController],
        providers: [notification_service_1.NotificationService],
        exports: [notification_service_1.NotificationService],
    })
], NotificationsModule);


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationController_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationController = void 0;
const common_1 = __webpack_require__(2);
const notification_service_1 = __webpack_require__(48);
let NotificationController = NotificationController_1 = class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(NotificationController_1.name);
    }
    async getUserNotifications(userId, limit = 50, offset = 0, unreadOnly = false) {
        try {
            const notifications = await this.notificationService.getUserNotifications(userId, limit, offset, unreadOnly);
            return { success: true, data: notifications };
        }
        catch (error) {
            this.logger.error(`Error getting user notifications: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to get notifications', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDriverNotifications(driverId, limit = 50, offset = 0, unreadOnly = false) {
        try {
            const notifications = await this.notificationService.getDriverNotifications(driverId, limit, offset, unreadOnly);
            return { success: true, data: notifications };
        }
        catch (error) {
            this.logger.error(`Error getting driver notifications: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to get notifications', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getNotificationById(userId, notificationId) {
        try {
            const notification = await this.notificationService.getUserNotifications(userId, 1, 0, false);
            const notificationObj = notification.find(n => n.id === notificationId);
            if (!notificationObj) {
                throw new common_1.HttpException('Notification not found', common_1.HttpStatus.NOT_FOUND);
            }
            return { success: true, data: notificationObj };
        }
        catch (error) {
            this.logger.error(`Error getting notification: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to get notification', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async markNotificationAsRead(userId, notificationId) {
        try {
            const success = await this.notificationService.markAsRead(notificationId, userId);
            if (!success) {
                throw new common_1.HttpException('Notification not found', common_1.HttpStatus.NOT_FOUND);
            }
            return { success: true, message: 'Notification marked as read' };
        }
        catch (error) {
            this.logger.error(`Error marking notification as read: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to mark notification as read', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async markAllNotificationsAsRead(userId) {
        try {
            const success = await this.notificationService.markAllAsRead(userId);
            return { success: true, message: 'All notifications marked as read' };
        }
        catch (error) {
            this.logger.error(`Error marking all notifications as read: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to mark all notifications as read', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async countUnreadNotifications(userId) {
        try {
            const count = await this.notificationService.countUnread(userId);
            return { success: true, data: { count } };
        }
        catch (error) {
            this.logger.error(`Error counting unread notifications: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to count unread notifications', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('unreadonly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Boolean]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getUserNotifications", null);
__decorate([
    (0, common_1.Get)('driver'),
    __param(0, (0, common_1.Query)('driverId')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('unreadonly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Boolean]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getDriverNotifications", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotificationById", null);
__decorate([
    (0, common_1.Put)(':id/read'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markNotificationAsRead", null);
__decorate([
    (0, common_1.Put)('read-all'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAllNotificationsAsRead", null);
__decorate([
    (0, common_1.Get)('count/unread'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "countUnreadNotifications", null);
exports.NotificationController = NotificationController = NotificationController_1 = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [typeof (_a = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _a : Object])
], NotificationController);


/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const trip_payment_entity_1 = __webpack_require__(28);
const ride_entity_1 = __webpack_require__(21);
const user_entity_1 = __webpack_require__(19);
const payments_controller_1 = __webpack_require__(55);
const payments_service_1 = __webpack_require__(56);
const notifications_module_1 = __webpack_require__(52);
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([trip_payment_entity_1.TripPayment, ride_entity_1.Ride, user_entity_1.User]),
            notifications_module_1.NotificationsModule,
        ],
        controllers: [payments_controller_1.PaymentsController],
        providers: [payments_service_1.PaymentsService],
        exports: [payments_service_1.PaymentsService],
    })
], PaymentsModule);


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentsController_1;
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsController = void 0;
const common_1 = __webpack_require__(2);
const jwt_auth_guard_1 = __webpack_require__(34);
const current_user_decorator_1 = __webpack_require__(35);
const user_entity_1 = __webpack_require__(19);
const payments_service_1 = __webpack_require__(56);
let PaymentsController = PaymentsController_1 = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
        this.logger = new common_1.Logger(PaymentsController_1.name);
    }
    async getPaymentById(user, paymentId) {
        try {
            const payment = await this.paymentsService.getPaymentById(paymentId, user.id);
            if (!payment) {
                throw new common_1.HttpException('Payment not found', common_1.HttpStatus.NOT_FOUND);
            }
            return { success: true, data: payment };
        }
        catch (error) {
            this.logger.error(`Error getting payment: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to get payment', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getPaymentsForUser(user, userId) {
        if (user.id !== userId) {
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        try {
            const payments = await this.paymentsService.getPaymentsForUser(userId);
            return { success: true, data: payments };
        }
        catch (error) {
            this.logger.error(`Error getting payments: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to get payments', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getPaymentByRideId(user, rideId) {
        try {
            const payment = await this.paymentsService.getPaymentByRideId(rideId);
            if (!payment) {
                throw new common_1.HttpException('Payment not found', common_1.HttpStatus.NOT_FOUND);
            }
            return { success: true, data: payment };
        }
        catch (error) {
            this.logger.error(`Error getting payment by ride: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to get payment', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async processPayment(user, paymentId, body) {
        try {
            const result = await this.paymentsService.processPayment(paymentId, user.id, body.paymentMethod, body.token);
            return { success: true, data: result };
        }
        catch (error) {
            this.logger.error(`Error processing payment: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to process payment', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async refundPayment(user, paymentId, reason) {
        try {
            if (!user.id) {
                throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
            }
            const result = await this.paymentsService.refundPayment(paymentId, reason);
            return { success: true, data: result };
        }
        catch (error) {
            this.logger.error(`Error refunding payment: ${error.message}`);
            throw new common_1.HttpException(error.message || 'Failed to refund payment', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _b : Object, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPaymentById", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _c : Object, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPaymentsForUser", null);
__decorate([
    (0, common_1.Get)('ride/:rideId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('rideId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _d : Object, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPaymentByRideId", null);
__decorate([
    (0, common_1.Put)(':id/process'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _e : Object, String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "processPayment", null);
__decorate([
    (0, common_1.Put)(':id/refund'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _f : Object, String, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "refundPayment", null);
exports.PaymentsController = PaymentsController = PaymentsController_1 = __decorate([
    (0, common_1.Controller)('payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof payments_service_1.PaymentsService !== "undefined" && payments_service_1.PaymentsService) === "function" ? _a : Object])
], PaymentsController);


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentsService_1;
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(17);
const trip_payment_entity_1 = __webpack_require__(28);
const ride_entity_1 = __webpack_require__(21);
const user_entity_1 = __webpack_require__(19);
const wallet_transaction_entity_1 = __webpack_require__(27);
const notification_service_1 = __webpack_require__(48);
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(paymentRepository, rideRepository, userRepository, notificationService) {
        this.paymentRepository = paymentRepository;
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    async getPaymentById(paymentId, userId) {
        const payment = await this.paymentRepository.findOne({
            where: { id: paymentId },
            relations: ['ride', 'ride.user'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.ride?.userId !== userId) {
            throw new Error('Unauthorized access to payment');
        }
        return payment;
    }
    async getPaymentsForUser(userId) {
        return await this.paymentRepository
            .createQueryBuilder('payment')
            .innerJoinAndSelect('payment.ride', 'ride')
            .where('ride.userId = :userId', { userId })
            .orderBy('payment.createdAt', 'DESC')
            .getMany();
    }
    async getPaymentByRideId(rideId) {
        return await this.paymentRepository.findOne({
            where: { rideId },
            relations: ['ride'],
        });
    }
    async processPayment(paymentId, userId, paymentMethod, token) {
        const payment = await this.paymentRepository.findOne({
            where: { id: paymentId },
            relations: ['ride', 'ride.user'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.ride?.userId !== userId) {
            throw new Error('Unauthorized to process this payment');
        }
        if (payment.status !== wallet_transaction_entity_1.TransactionStatus.PENDING) {
            throw new Error('Payment is not pending');
        }
        try {
            const isPaymentSuccessful = await this.simulatePaymentProcessing(payment.amount, paymentMethod, token);
            if (isPaymentSuccessful) {
                payment.status = wallet_transaction_entity_1.TransactionStatus.COMPLETED;
                payment.paidAt = new Date();
                payment.transactionId = this.generateTransactionId();
            }
            else {
                payment.status = wallet_transaction_entity_1.TransactionStatus.FAILED;
                payment.failureReason = 'Payment processing failed';
            }
            return await this.paymentRepository.save(payment);
        }
        catch (error) {
            this.logger.error(`Error processing payment: ${error.message}`, error.stack);
            payment.status = wallet_transaction_entity_1.TransactionStatus.FAILED;
            payment.failureReason = error.message;
            await this.paymentRepository.save(payment);
            throw error;
        }
    }
    async refundPayment(paymentId, reason) {
        const payment = await this.paymentRepository.findOne({
            where: { id: paymentId },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.status !== wallet_transaction_entity_1.TransactionStatus.COMPLETED) {
            throw new Error('Can only refund completed payments');
        }
        payment.status = wallet_transaction_entity_1.TransactionStatus.CANCELLED;
        payment.failureReason = `Refunded: ${reason || 'No reason provided'}`;
        return await this.paymentRepository.save(payment);
    }
    async createPaymentForRide(rideId, amount) {
        const ride = await this.rideRepository.findOne({
            where: { id: rideId },
        });
        if (!ride) {
            throw new common_1.NotFoundException('Ride not found');
        }
        if (ride.status !== 'completed') {
            throw new Error('Can only create payment for completed rides');
        }
        const payment = new trip_payment_entity_1.TripPayment();
        payment.rideId = rideId;
        payment.amount = amount;
        payment.status = wallet_transaction_entity_1.TransactionStatus.PENDING;
        return await this.paymentRepository.save(payment);
    }
    async simulatePaymentProcessing(amount, paymentMethod, token) {
        this.logger.log(`Processing payment of $${amount} via ${paymentMethod || 'unknown method'}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    }
    generateTransactionId() {
        return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(trip_payment_entity_1.TripPayment)),
    __param(1, (0, typeorm_1.InjectRepository)(ride_entity_1.Ride)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _d : Object])
], PaymentsService);


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WalletModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const wallet_account_entity_1 = __webpack_require__(26);
const wallet_transaction_entity_1 = __webpack_require__(27);
let WalletModule = class WalletModule {
};
exports.WalletModule = WalletModule;
exports.WalletModule = WalletModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([wallet_account_entity_1.WalletAccount, wallet_transaction_entity_1.WalletTransaction])],
        controllers: [],
        providers: [],
        exports: [],
    })
], WalletModule);


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const admin_user_entity_1 = __webpack_require__(59);
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([admin_user_entity_1.AdminUser])],
        controllers: [],
        providers: [],
        exports: [],
    })
], AdminModule);


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminUser = exports.AdminRole = void 0;
const typeorm_1 = __webpack_require__(17);
const class_transformer_1 = __webpack_require__(20);
var AdminRole;
(function (AdminRole) {
    AdminRole["SUPER_ADMIN"] = "super_admin";
    AdminRole["ADMIN"] = "admin";
    AdminRole["SUPPORT"] = "support";
    AdminRole["ANALYST"] = "analyst";
})(AdminRole || (exports.AdminRole = AdminRole = {}));
let AdminUser = class AdminUser {
};
exports.AdminUser = AdminUser;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AdminUser.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], AdminUser.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], AdminUser.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AdminUser.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AdminUser.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AdminRole,
        default: AdminRole.ADMIN,
    }),
    __metadata("design:type", String)
], AdminUser.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], AdminUser.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], AdminUser.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], AdminUser.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], AdminUser.prototype, "updatedAt", void 0);
exports.AdminUser = AdminUser = __decorate([
    (0, typeorm_1.Entity)('admin_users')
], AdminUser);


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PricingModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const pricing_service_1 = __webpack_require__(61);
const pricing_controller_1 = __webpack_require__(63);
const ride_type_entity_1 = __webpack_require__(24);
const pricing_rule_entity_1 = __webpack_require__(62);
const ride_entity_1 = __webpack_require__(21);
let PricingModule = class PricingModule {
};
exports.PricingModule = PricingModule;
exports.PricingModule = PricingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ride_type_entity_1.RideType, pricing_rule_entity_1.PricingRule, ride_entity_1.Ride])],
        providers: [pricing_service_1.PricingService],
        controllers: [pricing_controller_1.PricingController],
        exports: [pricing_service_1.PricingService],
    })
], PricingModule);


/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PricingService_1;
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PricingService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(17);
const config_1 = __webpack_require__(4);
const ride_type_entity_1 = __webpack_require__(24);
const pricing_rule_entity_1 = __webpack_require__(62);
const ride_entity_1 = __webpack_require__(21);
let PricingService = PricingService_1 = class PricingService {
    constructor(rideTypeRepository, pricingRuleRepository, rideRepository, configService) {
        this.rideTypeRepository = rideTypeRepository;
        this.pricingRuleRepository = pricingRuleRepository;
        this.rideRepository = rideRepository;
        this.configService = configService;
        this.logger = new common_1.Logger(PricingService_1.name);
        this.platformCommission = parseFloat(this.configService.get('PLATFORM_COMMISSION_PERCENTAGE', '20'));
    }
    async calculateEstimatedFare(rideTypeId, distanceKm, durationMinutes, pickupLat, pickupLon, dropoffLat, dropoffLon) {
        const rideType = await this.rideTypeRepository.findOne({
            where: { id: rideTypeId },
        });
        if (!rideType) {
            throw new Error('Ride type not found');
        }
        const baseFare = parseFloat(rideType.baseFare.toString());
        const distanceFare = distanceKm * parseFloat(rideType.perKmRate.toString());
        const timeFare = durationMinutes * parseFloat(rideType.perMinuteRate.toString());
        const surgeMultiplier = await this.calculateSurgeMultiplier(pickupLat, pickupLon, rideTypeId);
        const subtotal = baseFare + distanceFare + timeFare;
        const surgeAmount = subtotal * (surgeMultiplier - 1);
        const totalFare = Math.max(subtotal * surgeMultiplier, parseFloat(rideType.minimumFare.toString()));
        return {
            baseFare,
            distanceFare,
            timeFare,
            surgeMultiplier,
            surgeAmount,
            discountAmount: 0,
            subtotal,
            totalFare: Math.round(totalFare * 100) / 100,
            currency: 'ETB',
        };
    }
    async calculateActualFare(rideId, actualDistanceKm, actualDurationMinutes) {
        const ride = await this.rideRepository.findOne({
            where: { id: rideId },
            relations: ['rideType'],
        });
        if (!ride) {
            throw new Error('Ride not found');
        }
        const rideType = ride.rideType;
        const baseFare = parseFloat(rideType.baseFare.toString());
        const distanceFare = actualDistanceKm * parseFloat(rideType.perKmRate.toString());
        const timeFare = actualDurationMinutes * parseFloat(rideType.perMinuteRate.toString());
        const surgeMultiplier = parseFloat(ride.surgeMultiplier?.toString() || '1');
        const subtotal = baseFare + distanceFare + timeFare;
        const surgeAmount = subtotal * (surgeMultiplier - 1);
        const totalFare = Math.max(subtotal * surgeMultiplier, parseFloat(rideType.minimumFare.toString()));
        const discountAmount = parseFloat(ride.discountAmount?.toString() || '0');
        const finalFare = Math.max(0, totalFare - discountAmount);
        return {
            baseFare,
            distanceFare,
            timeFare,
            surgeMultiplier,
            surgeAmount,
            discountAmount,
            subtotal,
            totalFare: Math.round(finalFare * 100) / 100,
            currency: 'ETB',
        };
    }
    async calculateSurgeMultiplier(lat, lon, rideTypeId) {
        try {
            const activeRequests = await this.rideRepository.count({
                where: {
                    rideTypeId,
                    status: ride_entity_1.RideStatus.REQUESTED,
                },
            });
            const baseSurge = 1.0;
            let surgeMultiplier = baseSurge;
            const now = new Date();
            const hour = now.getHours();
            const dayOfWeek = now.getDay();
            const timeBasedRules = await this.pricingRuleRepository.find({
                where: {
                    type: PricingRuleType.SURGE,
                    isActive: true,
                    rideTypeId: rideTypeId,
                },
            });
            for (const rule of timeBasedRules) {
                if (this.isRuleActive(rule, hour, dayOfWeek)) {
                    surgeMultiplier = Math.max(surgeMultiplier, parseFloat(rule.multiplier.toString()));
                }
            }
            if (activeRequests > 10) {
                surgeMultiplier = Math.min(surgeMultiplier * 1.5, 3.0);
            }
            else if (activeRequests > 5) {
                surgeMultiplier = Math.min(surgeMultiplier * 1.25, 2.0);
            }
            return Math.round(surgeMultiplier * 100) / 100;
        }
        catch (error) {
            this.logger.error(`Error calculating surge: ${error.message}`, error.stack);
            return 1.0;
        }
    }
    isRuleActive(rule, currentHour, currentDay) {
        if (rule.daysOfWeek && !rule.daysOfWeek.includes(currentDay)) {
            return false;
        }
        if (rule.startTime && rule.endTime) {
            const [startHour, startMin] = rule.startTime.split(':').map(Number);
            const [endHour, endMin] = rule.endTime.split(':').map(Number);
            const startMinutes = startHour * 60 + startMin;
            const endMinutes = endHour * 60 + endMin;
            const currentMinutes = currentHour * 60;
            if (startMinutes <= endMinutes) {
                if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
                    return false;
                }
            }
            else {
                if (currentMinutes < startMinutes && currentMinutes > endMinutes) {
                    return false;
                }
            }
        }
        if (rule.validFrom && new Date() < rule.validFrom) {
            return false;
        }
        if (rule.validUntil && new Date() > rule.validUntil) {
            return false;
        }
        return true;
    }
    calculateDriverEarnings(totalFare) {
        const commission = (totalFare * this.platformCommission) / 100;
        return Math.round((totalFare - commission) * 100) / 100;
    }
    calculatePlatformCommission(totalFare) {
        return Math.round((totalFare * this.platformCommission) / 100 * 100) / 100;
    }
};
exports.PricingService = PricingService;
exports.PricingService = PricingService = PricingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ride_type_entity_1.RideType)),
    __param(1, (0, typeorm_1.InjectRepository)(pricing_rule_entity_1.PricingRule)),
    __param(2, (0, typeorm_1.InjectRepository)(ride_entity_1.Ride)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _d : Object])
], PricingService);


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PricingRule = exports.PricingRuleType = void 0;
const typeorm_1 = __webpack_require__(17);
var PricingRuleType;
(function (PricingRuleType) {
    PricingRuleType["SURGE"] = "surge";
    PricingRuleType["DISCOUNT"] = "discount";
    PricingRuleType["COMMISSION"] = "commission";
})(PricingRuleType || (exports.PricingRuleType = PricingRuleType = {}));
let PricingRule = class PricingRule {
};
exports.PricingRule = PricingRule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PricingRule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PricingRuleType,
    }),
    __metadata("design:type", String)
], PricingRule.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PricingRule.prototype, "rideTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 1.0 }),
    __metadata("design:type", Number)
], PricingRule.prototype, "multiplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], PricingRule.prototype, "fixedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PricingRule.prototype, "minRides", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], PricingRule.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], PricingRule.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], PricingRule.prototype, "daysOfWeek", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], PricingRule.prototype, "zones", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], PricingRule.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], PricingRule.prototype, "validFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], PricingRule.prototype, "validUntil", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], PricingRule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], PricingRule.prototype, "updatedAt", void 0);
exports.PricingRule = PricingRule = __decorate([
    (0, typeorm_1.Entity)('pricing_rules')
], PricingRule);


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PricingController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const pricing_service_1 = __webpack_require__(61);
const jwt_auth_guard_1 = __webpack_require__(34);
let PricingController = class PricingController {
    constructor(pricingService) {
        this.pricingService = pricingService;
    }
    async estimateFare(rideTypeId, distance, duration, pickupLat, pickupLon, dropoffLat, dropoffLon) {
        return this.pricingService.calculateEstimatedFare(rideTypeId, parseFloat(distance.toString()), parseFloat(duration.toString()), parseFloat(pickupLat.toString()), parseFloat(pickupLon.toString()), parseFloat(dropoffLat.toString()), parseFloat(dropoffLon.toString()));
    }
    async calculateFare(rideId, distance, duration) {
        return this.pricingService.calculateActualFare(rideId, parseFloat(distance.toString()), parseFloat(duration.toString()));
    }
};
exports.PricingController = PricingController;
__decorate([
    (0, common_1.Get)('estimate'),
    (0, swagger_1.ApiOperation)({ summary: 'Get estimated fare for a ride' }),
    __param(0, (0, common_1.Query)('rideTypeId')),
    __param(1, (0, common_1.Query)('distance')),
    __param(2, (0, common_1.Query)('duration')),
    __param(3, (0, common_1.Query)('pickupLat')),
    __param(4, (0, common_1.Query)('pickupLon')),
    __param(5, (0, common_1.Query)('dropoffLat')),
    __param(6, (0, common_1.Query)('dropoffLon')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "estimateFare", null);
__decorate([
    (0, common_1.Post)('calculate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate actual fare after trip completion' }),
    __param(0, (0, common_1.Body)('rideId')),
    __param(1, (0, common_1.Body)('distance')),
    __param(2, (0, common_1.Body)('duration')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "calculateFare", null);
exports.PricingController = PricingController = __decorate([
    (0, swagger_1.ApiTags)('pricing'),
    (0, common_1.Controller)('pricing'),
    __metadata("design:paramtypes", [typeof (_a = typeof pricing_service_1.PricingService !== "undefined" && pricing_service_1.PricingService) === "function" ? _a : Object])
], PricingController);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSocketModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(8);
const jwt_1 = __webpack_require__(14);
const config_1 = __webpack_require__(4);
const websocket_gateway_1 = __webpack_require__(65);
const driver_entity_1 = __webpack_require__(22);
const driver_location_entity_1 = __webpack_require__(45);
const ride_entity_1 = __webpack_require__(21);
let WebSocketModule = class WebSocketModule {
};
exports.WebSocketModule = WebSocketModule;
exports.WebSocketModule = WebSocketModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([driver_entity_1.Driver, driver_location_entity_1.DriverLocation, ride_entity_1.Ride]),
            jwt_1.JwtModule,
            config_1.ConfigModule,
        ],
        providers: [websocket_gateway_1.WebSocketGateway],
        exports: [websocket_gateway_1.WebSocketGateway],
    })
], WebSocketModule);


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WebSocketGateway_1;
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSocketGateway = void 0;
const websockets_1 = __webpack_require__(66);
const socket_io_1 = __webpack_require__(67);
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(14);
const config_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(8);
const typeorm_2 = __webpack_require__(17);
const driver_entity_1 = __webpack_require__(22);
const driver_location_entity_1 = __webpack_require__(45);
const ride_entity_1 = __webpack_require__(21);
let WebSocketGateway = WebSocketGateway_1 = class WebSocketGateway {
    constructor(jwtService, configService, driverRepository, driverLocationRepository, rideRepository) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.driverRepository = driverRepository;
        this.driverLocationRepository = driverLocationRepository;
        this.rideRepository = rideRepository;
        this.logger = new common_1.Logger(WebSocketGateway_1.name);
        this.connectedDrivers = new Map();
        this.connectedUsers = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
            if (!token) {
                this.logger.warn(`Client ${client.id} connected without token`);
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            const { sub: id, type } = payload;
            if (type === 'driver') {
                this.connectedDrivers.set(client.id, id);
                await this.driverRepository.update(id, { lastOnlineAt: new Date() });
                this.logger.log(`Driver ${id} connected (socket: ${client.id})`);
            }
            else if (type === 'user') {
                this.connectedUsers.set(client.id, id);
                this.logger.log(`User ${id} connected (socket: ${client.id})`);
            }
            client.join(`user:${id}`);
        }
        catch (error) {
            this.logger.error(`Connection error: ${error.message}`);
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        const driverId = this.connectedDrivers.get(client.id);
        const userId = this.connectedUsers.get(client.id);
        if (driverId) {
            this.connectedDrivers.delete(client.id);
            this.logger.log(`Driver ${driverId} disconnected`);
        }
        if (userId) {
            this.connectedUsers.delete(client.id);
            this.logger.log(`User ${userId} disconnected`);
        }
    }
    async handleDriverLocation(client, data) {
        const driverId = this.connectedDrivers.get(client.id);
        if (!driverId) {
            return { error: 'Not authenticated as driver' };
        }
        try {
            await this.driverRepository.update(driverId, {
                latitude: data.lat,
                longitude: data.lon,
                heading: data.heading || null,
            });
            const location = this.driverLocationRepository.create({
                driverId: driverId,
                latitude: data.lat,
                longitude: data.lon,
                heading: data.heading || null,
                speed: data.speed || null,
                accuracy: data.accuracy || null,
            });
            await this.driverLocationRepository.save(location);
            const activeRide = await this.rideRepository.findOne({
                where: {
                    driverId,
                    status: ride_entity_1.RideStatus.IN_PROGRESS,
                },
            });
            if (activeRide) {
                this.server.to(`user:${activeRide.userId}`).emit('driver:location', {
                    driverId,
                    lat: data.lat,
                    lon: data.lon,
                    heading: data.heading,
                });
            }
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Error updating driver location: ${error.message}`);
            return { error: error.message };
        }
    }
    async handleTrackDriver(client, data) {
        const userId = this.connectedUsers.get(client.id);
        if (!userId) {
            return { error: 'Not authenticated as user' };
        }
        const ride = await this.rideRepository.findOne({
            where: { id: data.rideId, userId },
            relations: ['driver'],
        });
        if (!ride || !ride.driverId) {
            return { error: 'Ride not found or no driver assigned' };
        }
        client.join(`ride:${data.rideId}`);
        if (ride.driver.latitude && ride.driver.longitude) {
            client.emit('driver:location', {
                driverId: ride.driverId,
                lat: ride.driver.latitude,
                lon: ride.driver.longitude,
                heading: ride.driver.heading,
            });
        }
        return { success: true };
    }
    broadcastRideUpdate(rideId, status, data) {
        this.server.to(`ride:${rideId}`).emit('ride:update', {
            rideId,
            status,
            ...data,
        });
    }
    notifyDriver(driverId, rideData) {
        this.server.to(`user:${driverId}`).emit('ride:request', rideData);
    }
};
exports.WebSocketGateway = WebSocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_f = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _f : Object)
], WebSocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('driver:location'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _g : Object, Object]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleDriverLocation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('user:track-driver'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _h : Object, Object]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleTrackDriver", null);
exports.WebSocketGateway = WebSocketGateway = WebSocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: '/ws',
    }),
    __param(2, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __param(3, (0, typeorm_1.InjectRepository)(driver_location_entity_1.DriverLocation)),
    __param(4, (0, typeorm_1.InjectRepository)(ride_entity_1.Ride)),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object])
], WebSocketGateway);


/***/ }),
/* 66 */
/***/ ((module) => {

module.exports = require("@nestjs/websockets");

/***/ }),
/* 67 */
/***/ ((module) => {

module.exports = require("socket.io");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const helmet_1 = __webpack_require__(5);
const compression_1 = __webpack_require__(6);
const app_module_1 = __webpack_require__(7);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    const corsOrigin = configService.get('CORS_ORIGIN') || '*';
    app.enableCors({
        origin: corsOrigin === '*' ? true : corsOrigin.split(',').map((o) => o.trim()),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Zuber API')
        .setDescription('Zuber Ride-Hailing Platform API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Authentication endpoints')
        .addTag('riders', 'Rider endpoints')
        .addTag('drivers', 'Driver endpoints')
        .addTag('rides', 'Ride management endpoints')
        .addTag('payments', 'Payment endpoints')
        .addTag('admin', 'Admin endpoints')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = configService.get('APP_PORT') || 3000;
    await app.listen(port);
    console.log(`🚀 Zuber API is running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();

})();

/******/ })()
;