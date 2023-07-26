import Objection, { transaction } from 'objection';

import Db from '../database';

export class Transaction {
  private static knex = Db;

  static async run(Fn: (tx: Objection.Transaction) => Promise<any>) {
    const tx = await transaction.start(this.knex);
    try {
      const result = await Fn(tx);
      await tx.commit();

      return result;
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  }
}
