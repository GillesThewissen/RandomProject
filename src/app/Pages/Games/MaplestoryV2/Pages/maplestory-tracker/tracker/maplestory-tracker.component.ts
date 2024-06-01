import { Component, OnInit, OnDestroy } from '@angular/core';
import DailiesJsonV2 from '../../../../../../../assets/Games/Maplestory/DailiesV2.json';
import { Meta, Title } from '@angular/platform-browser';

// TODO: look into seeing if its possible to also show the info thing when loading the data fails

@Component({
  selector: 'app-maplestory-tracker',
  templateUrl: './maplestory-tracker.component.html',
  styleUrls: ['./maplestory-tracker.component.css']
})
export class MaplestoryTrackerComponent implements OnInit, OnDestroy {
  editMode: boolean = true;

  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle("Maplestory Dailies Tracker | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "A dailies tracker for Maplestory to keep track of your completed daily tasks. Keep track of your dailies across multiple different characters." });
    if (!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "index, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "index, follow" });
    }

    this.initialise();
  }

  ngOnDestroy() {
  }

  initialise() {
    
  }
}