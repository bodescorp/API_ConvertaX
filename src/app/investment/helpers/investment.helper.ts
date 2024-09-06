export class InvestmentHelper {
  static calculateExpectedReturn(initial_amount: number, creation_date: Date): number {
    const today = new Date();
    const months = this.getMonthsDifference(today, creation_date);
    const rate = 0.0052; // 0.52% ao mês
    const compoundedAmount = initial_amount * Math.pow(1 + rate, months);
    return Number(compoundedAmount.toFixed(2));
  }

  private static getMonthsDifference(date1: Date, date2: Date | string): number {
    // Se date2 for string, converte para Date
    if (typeof date2 === 'string') {
      date2 = new Date(date2);
    }
  
    // Verifica se a conversão foi bem-sucedida
    if (isNaN((date2 as Date).getTime())) {
      throw new Error("A data de criação do investimento não é válida.");
    }
    const yearDiff = date1.getFullYear() - (date2 as Date).getFullYear();
    const monthDiff = date1.getMonth() - (date2 as Date).getMonth();
    const dayDiff = date1.getDate() - (date2 as Date).getDate();
  
    let totalMonths = yearDiff * 12 + monthDiff;
  
    if (dayDiff < 0) {
      totalMonths--;
    }
  
    return totalMonths;
  }
  
}