import {Component, OnInit} from '@angular/core';
import {Observation} from 'src/models/observation.model';
import {ChildStatsService} from 'src/services/child-stats.service';

@Component({
  selector: 'app-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.scss']
})
export class ObservationComponent implements OnInit {
  observations: Observation[] = [];
  newObservation: Observation = {id: 0, title: '', content: '', date: new Date()};
  confirmationId: number | null = null;

  constructor(private childStatsService: ChildStatsService) {
  }

  ngOnInit(): void {
    this.loadObservations();
  }

  loadObservations(): void {
    this.observations = this.childStatsService.getObservations();
  }

  requestDelete(obs: Observation): void {
    this.confirmationId = obs.id;
  }

  confirmDelete(obs: Observation): void {
    this.childStatsService.deleteObservation(obs.id);
    this.loadObservations();
    this.confirmationId = null;
  }

  cancelDelete(): void {
    this.confirmationId = null;
  }

  addObservation(): void {
    if (this.newObservation.title && this.newObservation.content) {
      this.childStatsService.addObservation(this.newObservation);
      this.loadObservations();
      this.newObservation = {id: 0, title: '', content: '', date: new Date()};
    }
  }
}
