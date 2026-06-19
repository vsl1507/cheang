import BasicService from "../basic.service.js";
import Transaction from "../../models/v1/transaction.model.js";

class TransactionService extends BasicService {
  constructor() {
    super(Transaction);
  }

  async getAllTransactionsPopulated() {
    try {
      const transactions = await this.model.find({})
        .populate("payer", "nameuser email avatar")
        .populate("payee", "nameuser email avatar brandName")
        .populate("booking", "serviceName bookingDate status")
        .sort({ createdAt: -1 });
      return { success: true, data: transactions };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default TransactionService;
