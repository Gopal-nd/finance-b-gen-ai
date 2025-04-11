export const calculatorConfig: Record<
  string,
  {
    name: string
    description: string
    icon: string
    fields: {
      id: string
      label: string
      tooltip: string
      min: number
      max: number
      step: number
      prefix?: string
      suffix?: string
    }[]
    defaultValues: Record<string, number>
  }
> = {
  sip: {
    name: "SIP Calculator",
    description: "Calculate returns from Systematic Investment Plans in mutual funds",
    icon: "💰",
    fields: [
      {
        id: "monthlyInvestment",
        label: "Monthly Investment",
        tooltip: "Amount you plan to invest every month",
        min: 500,
        max: 100000,
        step: 500,
        prefix: "₹",
      },
      {
        id: "expectedReturn",
        label: "Expected Annual Return",
        tooltip: "Expected annual return rate from your investments",
        min: 1,
        max: 30,
        step: 0.5,
        suffix: "%",
      },
      {
        id: "timePeriod",
        label: "Time Period",
        tooltip: "Investment duration in years",
        min: 1,
        max: 30,
        step: 1,
        suffix: "years",
      },
    ],
    defaultValues: {
      monthlyInvestment: 5000,
      expectedReturn: 12,
      timePeriod: 10,
    },
  },
  ppf: {
    name: "PPF Calculator",
    description: "Estimate maturity amount based on investment duration and contribution",
    icon: "💰",
    fields: [
      {
        id: "yearlyInvestment",
        label: "Yearly Investment",
        tooltip: "Amount you plan to invest every year",
        min: 500,
        max: 150000,
        step: 1000,
        prefix: "₹",
      },
      {
        id: "interestRate",
        label: "Interest Rate",
        tooltip: "Current PPF interest rate",
        min: 5,
        max: 9,
        step: 0.1,
        suffix: "%",
      },
      {
        id: "timePeriod",
        label: "Time Period",
        tooltip: "Investment duration in years",
        min: 15,
        max: 30,
        step: 1,
        suffix: "years",
      },
    ],
    defaultValues: {
      yearlyInvestment: 50000,
      interestRate: 7.1,
      timePeriod: 15,
    },
  },
  fd: {
    name: "Fixed Deposit Calculator",
    description: "Calculate interest and maturity amount based on deposit and duration",
    icon: "💰",
    fields: [
      {
        id: "principal",
        label: "Principal Amount",
        tooltip: "Amount you plan to deposit",
        min: 1000,
        max: 10000000,
        step: 1000,
        prefix: "₹",
      },
      {
        id: "interestRate",
        label: "Interest Rate",
        tooltip: "Annual interest rate offered by the bank",
        min: 3,
        max: 9,
        step: 0.1,
        suffix: "%",
      },
      {
        id: "timePeriod",
        label: "Time Period",
        tooltip: "Investment duration in years",
        min: 0.25,
        max: 10,
        step: 0.25,
        suffix: "years",
      },
    ],
    defaultValues: {
      principal: 100000,
      interestRate: 6.5,
      timePeriod: 5,
    },
  },
  "home-loan": {
    name: "Home Loan EMI Calculator",
    description: "Calculate monthly EMI based on loan amount, interest rate, and tenure",
    icon: "🧮",
    fields: [
      {
        id: "loanAmount",
        label: "Loan Amount",
        tooltip: "Total loan amount you want to borrow",
        min: 100000,
        max: 10000000,
        step: 100000,
        prefix: "₹",
      },
      {
        id: "interestRate",
        label: "Interest Rate",
        tooltip: "Annual interest rate on your loan",
        min: 5,
        max: 15,
        step: 0.1,
        suffix: "%",
      },
      {
        id: "loanTenure",
        label: "Loan Tenure",
        tooltip: "Duration of the loan in years",
        min: 1,
        max: 30,
        step: 1,
        suffix: "years",
      },
    ],
    defaultValues: {
      loanAmount: 3000000,
      interestRate: 8.5,
      loanTenure: 20,
    },
  },
  retirement: {
    name: "Retirement Planning Calculator",
    description: "Plan your retirement corpus and monthly savings needed",
    icon: "📅",
    fields: [
      {
        id: "currentAge",
        label: "Current Age",
        tooltip: "Your current age in years",
        min: 20,
        max: 59,
        step: 1,
        suffix: "years",
      },
      {
        id: "retirementAge",
        label: "Retirement Age",
        tooltip: "Age at which you plan to retire",
        min: 40,
        max: 70,
        step: 1,
        suffix: "years",
      },
      {
        id: "monthlyExpenses",
        label: "Monthly Expenses (Current)",
        tooltip: "Your current monthly expenses",
        min: 10000,
        max: 500000,
        step: 5000,
        prefix: "₹",
      },
      {
        id: "inflation",
        label: "Expected Inflation",
        tooltip: "Expected annual inflation rate",
        min: 2,
        max: 10,
        step: 0.5,
        suffix: "%",
      },
      {
        id: "returnRate",
        label: "Expected Return Rate",
        tooltip: "Expected annual return on your investments",
        min: 5,
        max: 15,
        step: 0.5,
        suffix: "%",
      },
      {
        id: "lifeExpectancy",
        label: "Life Expectancy",
        tooltip: "Expected age up to which you'll need retirement funds",
        min: 70,
        max: 100,
        step: 1,
        suffix: "years",
      },
    ],
    defaultValues: {
      currentAge: 30,
      retirementAge: 60,
      monthlyExpenses: 50000,
      inflation: 6,
      returnRate: 10,
      lifeExpectancy: 85,
    },
  },
}

// Add more calculators as needed
