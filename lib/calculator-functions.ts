export function calculateSIP(monthlyInvestment: number, expectedReturn: number, timePeriod: number) {
  const monthlyRate = expectedReturn / 100 / 12
  const months = timePeriod * 12

  const totalInvestment = monthlyInvestment * months
  const maturityValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
  const totalReturns = maturityValue - totalInvestment

  // Generate yearly data for charts and tables
  const yearlyData = []
  for (let year = 1; year <= timePeriod; year++) {
    const monthsCompleted = year * 12
    const investmentTillDate = monthlyInvestment * monthsCompleted
    const valueTillDate =
      monthlyInvestment * ((Math.pow(1 + monthlyRate, monthsCompleted) - 1) / monthlyRate) * (1 + monthlyRate)

    yearlyData.push({
      year,
      totalInvestment: investmentTillDate,
      totalValue: valueTillDate,
    })
  }

  return {
    totalInvestment,
    maturityValue,
    totalReturns,
    yearlyData,
  }
}

// PPF Calculator
export function calculatePPF(yearlyInvestment: number, interestRate: number, timePeriod: number) {
  const yearlyRate = interestRate / 100

  const totalInvestment = yearlyInvestment * timePeriod
  let totalInterest = 0
  let maturityValue = 0

  const yearlyData = []
  let runningBalance = 0

  for (let year = 1; year <= timePeriod; year++) {
    runningBalance += yearlyInvestment
    const yearlyInterest = runningBalance * yearlyRate
    runningBalance += yearlyInterest
    totalInterest += yearlyInterest

    yearlyData.push({
      year,
      totalInvestment: yearlyInvestment * year,
      totalValue: runningBalance,
    })
  }

  maturityValue = totalInvestment + totalInterest

  return {
    totalInvestment,
    totalInterest,
    maturityValue,
    yearlyData,
  }
}

// FD Calculator
export function calculateFD(principal: number, interestRate: number, timePeriod: number) {
  const yearlyRate = interestRate / 100

  // For simple interest calculation
  // const interestEarned = principal * yearlyRate * timePeriod;

  // For compound interest calculation (annual compounding)
  const maturityValue = principal * Math.pow(1 + yearlyRate, timePeriod)
  const interestEarned = maturityValue - principal

  const yearlyData = []
  let runningValue = principal

  for (let year = 1; year <= Math.ceil(timePeriod); year++) {
    // Handle partial years for the last entry
    const effectiveRate = year > timePeriod ? yearlyRate * (timePeriod % 1) : yearlyRate
    const yearInterest = runningValue * effectiveRate
    runningValue += yearInterest

    yearlyData.push({
      year,
      value: runningValue,
      interestEarned: yearInterest,
    })

    // Break if we've reached the end of the time period
    if (year >= timePeriod) break
  }

  return {
    principal,
    interestEarned,
    maturityValue,
    yearlyData,
  }
}

// Home Loan EMI Calculator
export function calculateHomeLoan(loanAmount: number, interestRate: number, loanTenure: number) {
  const monthlyRate = interestRate / 100 / 12
  const months = loanTenure * 12

  // Calculate EMI
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)

  const totalPayment = emi * months
  const totalInterest = totalPayment - loanAmount

  // Generate yearly data for amortization schedule
  const yearlyData = []
  let outstandingBalance = loanAmount
  let yearlyPrincipalPaid = 0
  let yearlyInterestPaid = 0

  for (let month = 1; month <= months; month++) {
    const interestForMonth = outstandingBalance * monthlyRate
    const principalForMonth = emi - interestForMonth

    outstandingBalance -= principalForMonth
    yearlyPrincipalPaid += principalForMonth
    yearlyInterestPaid += interestForMonth

    if (month % 12 === 0 || month === months) {
      const year = Math.ceil(month / 12)
      yearlyData.push({
        year,
        principalPaid: yearlyPrincipalPaid,
        interestPaid: yearlyInterestPaid,
        outstandingBalance: Math.max(0, outstandingBalance),
      })

      yearlyPrincipalPaid = 0
      yearlyInterestPaid = 0
    }
  }

  return {
    emi,
    totalPayment,
    totalInterest,
    principal: loanAmount,
    yearlyData,
  }
}

// Retirement Planning Calculator
export function calculateRetirement(
  currentAge: number,
  retirementAge: number,
  monthlyExpenses: number,
  inflation: number,
  returnRate: number,
  lifeExpectancy: number,
) {
  const yearsToRetirement = retirementAge - currentAge
  const retirementDuration = lifeExpectancy - retirementAge

  // Calculate monthly expenses at retirement (adjusted for inflation)
  const inflationFactor = Math.pow(1 + inflation / 100, yearsToRetirement)
  const monthlyExpensesAtRetirement = monthlyExpenses * inflationFactor
  const yearlyExpensesAtRetirement = monthlyExpensesAtRetirement * 12

  // Calculate corpus needed at retirement
  // Using the formula for present value of an annuity
  const monthlyReturnRate = returnRate / 100 / 12
  const inflationAdjustedReturn = (1 + returnRate / 100) / (1 + inflation / 100) - 1
  const monthlyInflationAdjustedRate = inflationAdjustedReturn / 12

  // Calculate corpus needed assuming withdrawals happen at the beginning of each month
  const corpusNeeded =
    (monthlyExpensesAtRetirement * (1 - Math.pow(1 + monthlyInflationAdjustedRate, -retirementDuration * 12))) /
    monthlyInflationAdjustedRate

  // Calculate monthly investment needed to reach the corpus
  const monthlyInvestmentNeeded =
    corpusNeeded /
    (((Math.pow(1 + monthlyReturnRate, yearsToRetirement * 12) - 1) / monthlyReturnRate) * (1 + monthlyReturnRate))

  // Generate yearly data for visualization
  const yearlyData = []
  let age = currentAge
  let corpus = 0

  // Accumulation phase
  while (age < retirementAge) {
    corpus = corpus * (1 + returnRate / 100) + monthlyInvestmentNeeded * 12
    age++
    yearlyData.push({
      age,
      corpus,
      yearlyInvestment: monthlyInvestmentNeeded * 12,
      isRetired: false,
    })
  }

  // Retirement phase
  let retirementCorpus = corpus
  while (age <= lifeExpectancy) {
    const yearlyExpense = yearlyExpensesAtRetirement * Math.pow(1 + inflation / 100, age - retirementAge)
    retirementCorpus = retirementCorpus * (1 + returnRate / 100) - yearlyExpense
    age++
    yearlyData.push({
      age,
      corpus: Math.max(0, retirementCorpus),
      yearlyExpense,
      isRetired: true,
    })
  }

  return {
    corpusNeeded,
    monthlyInvestmentNeeded,
    monthlyPension: monthlyExpensesAtRetirement,
    yearlyData,
  }
}
