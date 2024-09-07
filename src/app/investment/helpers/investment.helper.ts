export class InvestmentHelper {
  static calculateExpectedReturn(initial_amount: number, creation_date: Date): number {
    const today = new Date();
    
    if (creation_date > today) {
      throw new Error("A data de criação do investimento não pode ser no futuro.");
    }

    const months = this.getMonthsDifference(today, creation_date);
    const rate = 0.0052; // 0.52% ao mês
    const compoundedAmount = initial_amount * Math.pow(1 + rate, months);
    return Math.round(compoundedAmount * 100) / 100; 
  }

  private static getMonthsDifference(date1: Date, date2: Date): number {
    const yearDiff = date1.getFullYear() - date2.getFullYear();
    const monthDiff = date1.getMonth() - date2.getMonth();
    const dayDiff = date1.getDate() - date2.getDate();

    let totalMonths = yearDiff * 12 + monthDiff;

    if (dayDiff < 0) {
      totalMonths--;
    }

    return totalMonths;
  }
}
