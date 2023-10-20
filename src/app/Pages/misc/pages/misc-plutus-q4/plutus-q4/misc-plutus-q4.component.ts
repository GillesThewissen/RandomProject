import { Component, OnInit, OnDestroy } from '@angular/core';
import PlutusJson from '../../../../../../assets/Misc/PlutusTiers2.json';
import { Meta, Title } from '@angular/platform-browser';
import { PlutusSubscriptionTier, PlutusStackingTier, EligibleSpendTier } from '../../../Models/PlutusTiers2';

@Component({
  selector: 'app-misc-plutus-q4',
  templateUrl: './misc-plutus-q4.component.html',
  styleUrls: ['./misc-plutus-q4.component.css']
})
export class MiscPlutusQ4Component implements OnInit, OnDestroy {
  subscriptionTiers: PlutusSubscriptionTier[] = PlutusJson.subscriptionTiers;
  stackingTiers: PlutusStackingTier[] = PlutusJson.stackingTiers;
  eligibleSpendTiers: EligibleSpendTier[] = PlutusJson.eligibleSpendTiers;

  currencySymbol: string = "€";

  subscriptionTierSelectedIndex: number = 0;
  stackingTierSelectedIndex: number = 0;
  eligibleSpendTierSelectedIndex: number = 0;

  cashbackRate: number = 0;
  eligibleSpend: number = 0;
  monthlyCashbackValue: number = 0;

  perkCount: number = 0;
  monthlyPerkValue: number = 0;

  totalMonthlyValue: number = 0;
  totalYearlyValue: number = 0;
  actualTotalYearlyValue: number = 0;


  superChargedPerksValue: number[] = [0, 0, 0];
  superChargedPerksActualValue: number[] = [0, 0, 0];
  goldenTicketReferralsValue: number[] = [0, 0, 0];
  goldenTicketReferralsActualValue: number[] = [0, 0, 0];
  doubleRewardsVoucherValue: number[] = [0, 0, 0];
  doubleRewardsVoucherActualValue: number[] = [0, 0, 0];
  originalBenefitsValue: number[] = [0, 0, 0];

  superChargedPerksTotalCalc: boolean = true;
  superChargedPerksActualTotalCalc: boolean = false;
  goldenTicketReferralsTotalCalc: boolean = true;
  goldenTicketReferralsActualTotalCalc: boolean = false;
  doubleRewardsVoucherTotalCalc: boolean = true;
  doubleRewardsVoucherActualTotalCalc: boolean = false;

  totalValue: number[] = [0, 0, 0];
  totalActualValue: number[] = [0, 0, 0];
  totalValueMinusCost: number[] = [0, 0, 0];
  totalOriginalBenefits: number[] = [0, 0, 0];

  constructor(private titleService: Title, private metaService: Meta) {
  }

  ngOnInit() {
    this.titleService.setTitle("Plutus Q4 Calculator");
    this.metaService.updateTag({ name: "description", content: "Custom Plutus Q4 Benefit Calculator" });
    if (!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "noindex, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "noindex, follow" });
    }

    this.calculate();
  }

  ngOnDestroy() {
    this.titleService.setTitle("Random Stuff");
  }

  stackingTierChange(event: any) {
    this.stackingTierSelectedIndex = event.target.selectedIndex;
    this.calculate();
  }

  subscriptionTierChange(event: any) {
    this.subscriptionTierSelectedIndex = event.target.selectedIndex;
    this.calculate();
  }

  eligibleSpendTierChange(event: any) {
    this.eligibleSpendTierSelectedIndex = event.target.selectedIndex;
    this.calculate();
  }

  calculate() {
    this.calculateCashbackRate();
    this.calculateEligibleSpend();
    this.calculateMonthlyCashback();

    this.calculatePerkCount();
    this.calculateMonthlyPerkValue();

    this.calculateTotalMonthlyValue();
    this.calculateTotalYearlyValue();
    this.calculateActualTotalYearlyValue();
  }

  calculateCashbackRate() {
    // if user has no stack and no subscription the cashback is 0
    if(this.subscriptionTierSelectedIndex == 0 && this.stackingTierSelectedIndex == 0) {
      this.cashbackRate = 0;
      return;
    } 

    // if user is on a stacking tier this will be their cashback %
    if (this.stackingTierSelectedIndex != 0) {
      this.cashbackRate = this.stackingTiers[this.stackingTierSelectedIndex].cashbackPercentage;
    } else {
      this.cashbackRate = this.subscriptionTiers[this.subscriptionTierSelectedIndex].cashbackPercentage;
    }
  }

  calculateEligibleSpend() {
    // INFO: no longer valid as they will stack
    // if there is no higher eligible spend selected it will default to the subscription eligible spend
    // else it will pick the higher eligible spend limit
    // if(this.eligibleSpendTierSelectedIndex == 0) {
    //   this.eligibleSpend = this.subscriptionTiers[this.subscriptionTierSelectedIndex].eligibleSpend;
    // } else {
    //   this.eligibleSpend = this.eligibleSpendTiers[this.eligibleSpendTierSelectedIndex].eligibleSpend;
    // }

  
    // if eligible spend stacks
    this.eligibleSpend = this.subscriptionTiers[this.subscriptionTierSelectedIndex].eligibleSpend + this.eligibleSpendTiers[this.eligibleSpendTierSelectedIndex].eligibleSpend;
  }

  calculateMonthlyCashback() {
    this.monthlyCashbackValue = this.eligibleSpend * (this.cashbackRate / 100);
  }

  calculatePerkCount() {
    this.perkCount = this.subscriptionTiers[this.subscriptionTierSelectedIndex].perkCount + this.stackingTiers[this.stackingTierSelectedIndex].perkCount;
  }

  calculateMonthlyPerkValue() {
    this.monthlyPerkValue = this.perkCount * 10;
  }
  
  calculateTotalMonthlyValue() {
    this.totalMonthlyValue = this.monthlyCashbackValue + this.monthlyPerkValue;
  }

  calculateTotalYearlyValue() {
    this.totalYearlyValue = this.totalMonthlyValue * 12;
  }

  calculateActualTotalYearlyValue() {
    this.actualTotalYearlyValue = this.totalYearlyValue - (this.subscriptionTiers[this.subscriptionTierSelectedIndex].cost * 12);
  }

  changeCurrency() {
    if (this.currencySymbol === "€") {
      this.currencySymbol = "£";
    } else {
      this.currencySymbol = "€";
    }
  }
}

