import BasicController from "../basic.controller.js";
import TransactionService from "../../services/v1/transaction.service.js";
import { createTransactionSchema, updateTransactionSchema } from "../../schemas/v1/transaction.schema.js";
import { TransactionMapper } from "../../mappers/v1/transaction.mapper.js";
import ResponseUtil from "../../utils/response.util.js";

const transactionService = new TransactionService();

class TransactionController extends BasicController {
  constructor() {
    super(transactionService);
  }

  create = async (req, res) => {
    const { isValid, errors } = createTransactionSchema(req.body);
    if (!isValid) {
      return ResponseUtil.badRequest(res, errors.join(", "));
    }
    try {
      const result = await this.service.create(req.body, req.user?.id || req.user?._id || null);
      if (result.success) {
        result.data = TransactionMapper.toDTO(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result, 201);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  update = async (req, res) => {
    const { isValid, errors } = updateTransactionSchema(req.body);
    if (!isValid) {
      return ResponseUtil.badRequest(res, errors.join(", "));
    }
    try {
      const result = await this.service.update(req.params.id, req.body, req.user?.id || req.user?._id || null);
      if (result.success) {
        result.data = TransactionMapper.toDTO(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  getTransactions = async (req, res) => {
    try {
      const result = await this.service.getAllTransactionsPopulated();
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };
}

export default new TransactionController();
