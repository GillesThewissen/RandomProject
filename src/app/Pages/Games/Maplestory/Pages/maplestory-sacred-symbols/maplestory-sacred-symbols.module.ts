import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestorySacredSymbolsComponent } from './sacred-symbols/maplestory-sacred-symbols.component';
import { MaplestorySacredSymbolsRoutingModule } from './maplestory-sacred-symbols-routing.module';
import { MaplestorySharedModule } from '../../side-navigation/maplestory-shared.module';
import { CerniumComponent } from './sacred-symbols/Areas/cernium/cernium.component';
import { ArcusComponent } from './sacred-symbols/Areas/arcus/arcus.component';

@NgModule({
    declarations: [
        MaplestorySacredSymbolsComponent,
        CerniumComponent,
        ArcusComponent
    ],
    imports: [
        CommonModule, 
        MaplestorySacredSymbolsRoutingModule, 
        MaplestorySharedModule
    ],
    exports: [MaplestorySacredSymbolsComponent]
})
export class MaplestorySacredSymbolsModule { }