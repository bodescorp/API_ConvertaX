export class WithdrawalHelper {

    static calculateWithdrawalAmount(creationDate: Date, amount: number) {
        const investmentAgeInYears = this.getInvestmentAgeInYears(creationDate);
        let taxRate = 0;

        if (investmentAgeInYears < 1) {
            taxRate = 22.5;
        } else if (investmentAgeInYears >= 1 && investmentAgeInYears < 2) {
            taxRate = 18.5;
        } else {
            taxRate = 15.0;
        }

        const taxApplied = (amount * taxRate) / 100;
        const netAmount = amount - taxApplied;

        return { netAmount, taxRate, taxApplied };
    }

    static getInvestmentAgeInYears(creationDate: Date): number {
        const today = new Date();
        if (typeof creationDate === 'string') {
            creationDate = new Date(creationDate);
        }
        const yearsDifference = today.getFullYear() - creationDate.getFullYear();
        const isBeforeAnniversary =
            today.getMonth() < creationDate.getMonth() ||
            (today.getMonth() === creationDate.getMonth() && today.getDate() < creationDate.getDate());

        return isBeforeAnniversary ? yearsDifference - 1 : yearsDifference;
    }
}
