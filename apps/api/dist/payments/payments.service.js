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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = __importDefault(require("stripe"));
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const index_js_1 = require("../schemas/index.js");
let PaymentsService = class PaymentsService {
    paymentModel;
    transactionModel;
    constructor(paymentModel, transactionModel) {
        this.paymentModel = paymentModel;
        this.transactionModel = transactionModel;
    }
    async findAll(tenantId) {
        return this.paymentModel.find({ tenant_id: tenantId }).populate('transaction_id').sort({ created_at: -1 }).exec();
    }
    async create(tenantId, data) {
        const transaction = await this.transactionModel.findOne({
            _id: data.transaction_id,
            tenant_id: tenantId
        }).exec();
        if (!transaction) {
            throw new common_1.BadRequestException('Transaction not found or access denied');
        }
        return this.paymentModel.create({
            tenant_id: tenantId,
            ...data,
        });
    }
    async createCheckoutSession(tenantId) {
        const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', { apiVersion: '2026-09-30.endive' });
        if (!process.env.STRIPE_SECRET_KEY) {
            return { url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?upgrade=success` };
        }
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'ngn',
                        product_data: { name: 'SMB Portal PRO' },
                        unit_amount: 1500000,
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?upgrade=success`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/settings`,
            client_reference_id: tenantId,
        });
        return { url: session.url };
    }
    async handleStripeWebhook(payload, signature) {
        const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', { apiVersion: '2026-09-30.endive' });
        let event;
        try {
            event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock');
        }
        catch (err) {
            throw new common_1.BadRequestException(`Webhook Error: ${err.message}`);
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const tenantId = session.client_reference_id;
            const now = new Date();
            now.setFullYear(now.getFullYear() + 1);
            const { Tenant } = (await Promise.resolve().then(() => __importStar(require('../schemas/index.js'))));
            await this.paymentModel.db.model(Tenant.name).findByIdAndUpdate(tenantId, {
                subscription_status: 'ACTIVE',
                subscription_tier: 'PRO',
                subscription_ends_at: now,
                stripe_customer_id: session.customer,
                stripe_subscription_id: session.subscription,
            });
        }
        return { received: true };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(index_js_1.Payment.name)),
    __param(1, (0, mongoose_1.InjectModel)(index_js_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map