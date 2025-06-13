import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from './chart.component';

// Tests for the ChartComponent
describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  // Set up the test environment before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test that the chart component is created
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
