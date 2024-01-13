import { Component, OnInit, OnDestroy } from '@angular/core';
import PlutusJson from '../../../../../../assets/Misc/PlutusTiers2.json';
import PlutusPromosJson from '../../../../../../assets/Misc/PlutusPromos.json';
import { Meta, Title } from '@angular/platform-browser';
import { PlutusSubscriptionTier, PlutusStackingTier, EligibleSpendTier, CurrentPrices, Coin, Pluton, Promos } from '../../../Models/PlutusTiers2';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { findIndex } from 'rxjs/operators';


@Component({
  selector: 'app-misc-plutus-new',
  templateUrl: './misc-plutus-new.component.html',
  styleUrls: ['./misc-plutus-new.component.css']
})
export class MiscPlutusNewComponent implements OnInit, OnDestroy {
  url: string = 'https://api.coingecko.com/api/v3/simple/price?ids=pluton&vs_currencies=eur%2Cgbp';
  pluPrice: Pluton = {
    eur: 0,
    gbp: 0
  };

  subscriptionTiers: PlutusSubscriptionTier[] = PlutusJson.subscriptionTiers;
  stackingTiers: PlutusStackingTier[] = PlutusJson.stackingTiers;
  eligibleSpendTiers: EligibleSpendTier[] = PlutusJson.eligibleSpendTiers;
  eligibleSpendTiersDefault: EligibleSpendTier[] = JSON.parse(JSON.stringify(PlutusJson.eligibleSpendTiers)); // for resetting promo changes
  promos: Promos[] = PlutusPromosJson.promos;
  currentPrices: CurrentPrices = {eurPrice: 0, gbpPrice: 0};

  selectedSubscriptionTier = this.subscriptionTiers[0];
  selectedStackingTier = this.stackingTiers[0];
  selectedEligibleSpendTier = this.eligibleSpendTiers[0];

  averageMonthlySpend: number;
  currencySymbol: string = "€";
  showPromotions: boolean = false;

  cashbackRate: number = 0;
  perkCount: number = 0;
  eligibleSpend: number = 0;

  monthlyCashbackValue: number = 0;
  monthlyPerkValue: number = 0;
  totalMonthlyValue: number = 0;
  subscriptionCost: number = 0;
  redeemCost: number = 0;
  
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

  constructor(private titleService: Title, private metaService: Meta, private http: HttpClient) {
  }

  ngOnInit() {
    this.titleService.setTitle("Plutus Subscriptions & Reward Levels");
    this.metaService.updateTag({ name: "description", content: "Community calculator for Plutus Subscriptions & Reward Levels" });
    if (!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "noindex, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "noindex, follow" });
    }

    // warning this fetch is not waited on, so if used for calculations, run the calculation again in this function.
    this.fetchPluPrice();
    this.initialise();
  }

  ngOnDestroy() {
    this.titleService.setTitle("Random Stuff");
  }

  initialise() {
    if (localStorage.getItem("pluCurrencySymbol")) {
      this.currencySymbol = localStorage.getItem("pluCurrencySymbol");
    }

    // this.calculate();
  }

  fetchPluPrice() {
    const apiUrl = this.url; // Replace with your API URL
  
    this.http.get<Coin>(apiUrl).subscribe(data => {
      // The JSON response is now converted into a coin object 
      const plutonData: Coin = data;
      
      // console.log(plutonData.pluton.eur);
      // console.log(plutonData.pluton.gbp);

      // add the values into the pluPrice object
      this.pluPrice = plutonData.pluton;
    });
    this.calculateRedeemCost();
  }

  getPrices(): Observable<Pluton> {
    return this.http.get<Pluton>(this.url);
  }

  subscriptionTierChange(event: any) {
    this.calculate();
  }

  stackingTierChange(event: any) {
    this.calculate();
  }

  eligibleSpendTierChange(event: any) {
    this.calculate();
  }

  averageSpendChange($event: any) {
    if(this.averageMonthlySpend < 0) {
      this.averageMonthlySpend = undefined;
    }

    //always run calculate incase the field is cleared
    this.calculate();
  }

  togglePromoVisiblity() {
    this.showPromotions = !this.showPromotions;
  }

  togglePromo(index: number) {
    this.promos[index].enabled = !this.promos[index].enabled;

    this.applyPromos();
  }

  applyPromos() {
    //reset the eligiblespendtier data as this is constantly being manipulated as a hardcoded promo list requires too many variations.
    //for some reason rereading the JSON file does not work, and resetting to a by value instead of reference breaks the code.
    //instead iterating over a second unmodified array to copy the default values
    for (let i = 0; i < this.eligibleSpendTiers.length; i++) {
      this.eligibleSpendTiers[i].cost = this.eligibleSpendTiersDefault[i].cost;
    }

    // This is not the cleanest and reusable way of working but it's the easiest as not all promos have the same logic to apply.
    // 5k metal promo
    if(this.promos[0].enabled) {
      if(this.eligibleSpendTiers.findIndex(el => el.name == "5000") > 0) {
        this.eligibleSpendTiers[this.eligibleSpendTiers.findIndex(el => el.name == "5000")].cost = 0;
      }
    }

    // 2k promo for new stack upgrades
    if(this.promos[1].enabled) {
      if(this.eligibleSpendTiers.findIndex(el => el.name == "2000") > 0) {
        this.eligibleSpendTiers[this.eligibleSpendTiers.findIndex(el => el.name == "2000")].cost = 0;
      }
    }
    
    // 10k promo 2
    if(this.promos[2].enabled) {
      if(this.eligibleSpendTiers.findIndex(el => el.name == "10000") > 0) {
        this.eligibleSpendTiers[this.eligibleSpendTiers.findIndex(el => el.name == "10000")].cost = 0;
      }
    }

    // 10k promo 1
    if(this.promos[3].enabled) {
      if(this.eligibleSpendTiers.findIndex(el => el.name == "10000") > 0) {
        this.eligibleSpendTiers[this.eligibleSpendTiers.findIndex(el => el.name == "10000")].cost = 0;
      }
    }

    // 1k promo
    if(this.promos[4].enabled) {
      if(this.eligibleSpendTiers.findIndex(el => el.name == "1000") > 0) {
        this.eligibleSpendTiers[this.eligibleSpendTiers.findIndex(el => el.name == "1000")].cost = 0;
      }
    }

    // 50% discount promo
    if(this.promos[5].enabled) {
      for (let i = 0; i < this.eligibleSpendTiers.length; i++) {
        if (this.eligibleSpendTiers[i].cost != 0) {
          this.eligibleSpendTiers[i].cost = this.eligibleSpendTiers[i].cost / 2;
        }  
      }
    }
    this.calculate();
  }
  

  calculate() {
    this.calculateCashbackRate();
    this.calculatePerkCount();
    this.calculateEligibleSpend();

    this.calculateMonthlyCashback();
    this.calculateMonthlyPerkValue();

    this.calculateTotalMonthlyValue();
    this.calculateTotalYearlyValue();

    this.calculateSubscriptionCost();
    this.calculateRedeemCost();

    this.calculateActualTotalYearlyValue();

  }

  calculateCashbackRate() {
    if (this.selectedStackingTier.name !== "None") {
      this.cashbackRate = this.selectedStackingTier.cashbackPercentage;
      return;
    }

    if (this.selectedSubscriptionTier.name === "Standard") {
      this.cashbackRate = 0;
    } else {
      this.cashbackRate = this.selectedSubscriptionTier.cashbackPercentage
    }
  }

  calculatePerkCount() {
    this.perkCount = this.selectedSubscriptionTier.perkCount + this.selectedStackingTier.perkCount;  
  }

  calculateEligibleSpend() {
    this.eligibleSpend = this.selectedSubscriptionTier.eligibleSpend + this.selectedEligibleSpendTier.eligibleSpend;
  }

  calculateMonthlyCashback() {
    //no cashback if user is on standard subscription
    if (this.selectedSubscriptionTier.name === "Standard") { 
      this.monthlyCashbackValue = 0; 
      return; 
    }

    //if the average monthly spend is zero or higher than the max eligible spend, then calculate using the max eligible spend
    if(this.averageMonthlySpend > this.eligibleSpend || this.averageMonthlySpend == null || this.averageMonthlySpend == 0) {
      this.monthlyCashbackValue = this.eligibleSpend * (this.cashbackRate / 100);
    } else {
        this.monthlyCashbackValue = this.averageMonthlySpend * (this.cashbackRate / 100);
    }

  }

  calculateMonthlyPerkValue() {
    //no cashback if user is on standard subscription
    if (this.selectedSubscriptionTier.name === "Standard") { 
      this.monthlyPerkValue = 0;
      return; 
    } 
    this.monthlyPerkValue = this.perkCount * 10;
  }
  
  calculateTotalMonthlyValue() {
    this.totalMonthlyValue = this.monthlyCashbackValue + this.monthlyPerkValue;
  }

  calculateTotalYearlyValue() {
    this.totalYearlyValue = this.totalMonthlyValue * 12;
  }

  calculateSubscriptionCost() {
    this.subscriptionCost = this.selectedSubscriptionTier.cost * 12;
  }

  calculateRedeemCost() {
    if (this.currencySymbol === "€") {
      this.redeemCost = this.selectedEligibleSpendTier.cost * this.pluPrice.eur;
    } else {
      this.redeemCost = this.selectedEligibleSpendTier.cost * this.pluPrice.gbp;
    }
  }

  calculateActualTotalYearlyValue() {
    this.actualTotalYearlyValue = this.totalYearlyValue - this.subscriptionCost - this.redeemCost;
  }

  changeCurrency() {
    if (this.currencySymbol === "€") {
      this.currencySymbol = "£";
    } else {
      this.currencySymbol = "€";
    }
    localStorage.setItem("pluCurrencySymbol", this.currencySymbol);
    this.calculate();
  }
}

