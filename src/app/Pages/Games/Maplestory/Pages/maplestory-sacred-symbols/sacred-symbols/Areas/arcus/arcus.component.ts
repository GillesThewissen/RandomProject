import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-arcus',
  templateUrl: './arcus.component.html',
  styleUrls: ['./arcus.component.css']
})
export class ArcusComponent implements OnInit {
  @Output() valueChange = new EventEmitter();
  @Output() clearOutput = new EventEmitter();
  dailyQuest: boolean = true;

  ngOnInit() {
  }

  public calculateDailySymbols(): number {
    var symbolsPerDay: number = 0;

    if (this.dailyQuest) {
      symbolsPerDay += 5;
    }

    return symbolsPerDay;
  }

  valueChanged() {
    this.valueChange.emit();
  }

  emitClearOutput(){
    this.clearOutput.emit();
  }
}