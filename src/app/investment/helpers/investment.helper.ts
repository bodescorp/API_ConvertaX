export class InvestmentHelper {
  static calculateExpectedReturn(initial_amount: number, creation_date: Date): number {
    const today = new Date();
    
    if (creation_date > today) {
      throw new Error("The investment creation date cannot be in the future.");
    }

    const months = this.getMonthsDifference(today, creation_date);
    const rate = 0.0052; // 0.52% ao mês
    const compoundedAmount = initial_amount * Math.pow(1 + rate, months);
    return Math.round(compoundedAmount * 100) / 100; 
  }

  private static getMonthsDifference(date1: Date | string, date2: Date | string): number {
    const d1 = (date1 instanceof Date ? date1 : new Date(date1));
    const d2 = (date2 instanceof Date ? date2 : new Date(date2));

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        throw new Error('Invalid date provided');
    }

    const yearDiff = d1.getFullYear() - d2.getFullYear();
    const monthDiff = d1.getMonth() - d2.getMonth();
    const dayDiff = d1.getDate() - d2.getDate();

    let totalMonths = yearDiff * 12 + monthDiff;

    if (dayDiff < 0) {
        totalMonths--;
    }

    return totalMonths;
}

}
