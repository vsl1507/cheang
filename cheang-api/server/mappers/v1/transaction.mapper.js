export class TransactionMapper {
  static toDTO(transaction) {
    if (!transaction) return null;
    const transactionObj = transaction.toObject ? transaction.toObject() : { ...transaction };
    return {
      id: transactionObj._id || transactionObj.id,
      booking: transactionObj.booking,
      payer: transactionObj.payer,
      payee: transactionObj.payee,
      amount: transactionObj.amount,
      currency: transactionObj.currency,
      paymentMethod: transactionObj.paymentMethod,
      status: transactionObj.status,
      transactionRef: transactionObj.transactionRef,
      createdAt: transactionObj.createdAt,
      updatedAt: transactionObj.updatedAt,
    };
  }

  static toDTOs(transactions) {
    if (!transactions) return [];
    return transactions.map(this.toDTO);
  }
}
