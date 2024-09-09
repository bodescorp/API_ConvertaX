export class WithdrawalHelper {
  
    static calculateWithdrawalAmount(creationDate: Date, amount: number) {
      const investmentAgeInYears = this.getInvestmentAgeInYears(creationDate);
      let taxRate = this.getTaxRate(investmentAgeInYears); 
  
      const taxApplied = (amount * taxRate) / 100;
      const netAmount = amount - taxApplied;
  
      return { netAmount, taxRate, taxApplied };
    }
  
    private static getTaxRate(investmentAgeInYears: number): number {
      if (investmentAgeInYears < 1) {
        return 22.5;
      } else if (investmentAgeInYears >= 1 && investmentAgeInYears < 2) {
        return 18.5;
      } else {
        return 15.0;
      }
    }
  
    // Calcula a idade do investimento em anos, considerando o aniversário do investimento
    static getInvestmentAgeInYears(creationDate: Date): number {
      const today = new Date();
      const yearsDifference = today.getFullYear() - creationDate.getFullYear();
  
      // Verifica se o aniversário do investimento já passou neste ano
      const isBeforeAnniversary =
        today.getMonth() < creationDate.getMonth() ||
        (today.getMonth() === creationDate.getMonth() && today.getDate() < creationDate.getDate());
  
      return isBeforeAnniversary ? yearsDifference - 1 : yearsDifference;
    }
  }
  