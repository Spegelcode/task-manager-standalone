import { Component, Input } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';

// This component shows a chart using ng2-charts
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {
  // Data for the chart
  @Input() chartData!: ChartData<any, number[], string>;
  // Type of the chart (bar, pie, etc)
  @Input() chartType!: ChartType;
  // Labels for the chart
  @Input() chartLabels?: string[];
  // Title for the chart
  @Input() chartTitle?: string;
}