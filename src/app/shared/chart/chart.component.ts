import { Component, Input } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {
  @Input() chartData!: ChartData<any, number[], string>;
  @Input() chartType!: ChartType;
  @Input() chartLabels?: string[];
  @Input() chartTitle?: string;
}