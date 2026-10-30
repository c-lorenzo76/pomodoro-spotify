import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf
  ],
  templateUrl: './countdown.component.html',

})

export class CountdownComponent implements OnDestroy {
  workDuration = 25;
  breakDuration = 5;
  breakInput = '05:00'
  intervals = 4;

  timeLeft = 0;
  intervalIndex = 0;
  isRunning = false;
  isWorkSession = true;
  timelineEvents = [
    { label: 'Work 1' },
    { label: 'Break 1' },
    { label: 'Work 2' },
    { label: 'Break 2' },
  ];


  private timer: any = null;

  isEditingTime = false;
  customTimeInput = '';
  customWorkTimeSet: number | null = null;
  hasStarted = false;

  // Circumference of the progress ring (r = 45 in the SVG)
  readonly ringCircumference = 2 * Math.PI * 45;

  // Full length of the current session in seconds
  get sessionTotalSeconds(): number {
    return this.isWorkSession
      ? this.customWorkTimeSet ?? this.workDuration * 60
      : this.breakDurationSeconds();
  }

  // Before starting, show the full work time instead of 00:00
  get displaySeconds(): number {
    return this.hasStarted || this.timeLeft > 0 ? this.timeLeft : this.sessionTotalSeconds;
  }

  // 1 = full ring, 0 = empty
  get progress(): number {
    const total = this.sessionTotalSeconds;
    return total ? Math.min(1, this.displaySeconds / total) : 0;
  }

  breakDurationMinutes(): number {
    const [mins, secs] = this.breakInput.split(':').map(Number);
    if (isNaN(mins) && isNaN(secs)) return 0;
    return mins + secs / 60;
  }

  breakDurationSeconds(): number {
    const [mins, secs] = this.breakInput.split(':').map(Number);
    if (isNaN(mins) && isNaN(secs)) return 0;
    return mins * 60 + secs;
  }

  onBreakInputBlur() {
    const parts = this.breakInput.split(':');
    let min = Number(parts[0]) || 0;
    let sec = Number(parts[1]) || 0;

    if (sec > 59) {
      min += Math.floor(sec / 60);
      sec = sec % 60;
    }

    this.breakInput = `${min}:${sec.toString().padStart(2, '0')}`;

  }

  onTimeClick() {
    // The time can only be edited before the timer starts (Reset unlocks it again)
    if (!this.hasStarted) {
      this.isEditingTime = true;
      this.customTimeInput = this.formatTime(this.displaySeconds);
    }
  }

  onTimeInputBlur() {
    this.setCustomTime(this.customTimeInput);
    this.isEditingTime = false;
  }

  setCustomTime(input: string) {
    const [mins, secs] = input.split(':').map(Number);
    if (!isNaN(mins) && !isNaN(secs)) {
      const total = mins * 60 + secs;
      this.timeLeft = total;
      this.customWorkTimeSet = total; // store as custom work time
    }
  }

  constructor() {
    this.generateTimelineEvents();
  }

  startTimer() {
    if (!this.timeLeft) {
      this.timeLeft = this.customWorkTimeSet ?? this.workDuration * 60;
      this.isWorkSession = true;
      this.intervalIndex = 0;
    }

    this.generateTimelineEvents(); // ✅ Generate based on current intervals
    this.isRunning = true;
    this.hasStarted = true;

    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.handleSessionEnd();
      }
    }, 1000);
  }


  pauseTimer() {
    this.isRunning = false;
    clearInterval(this.timer);
  }

  resetTimer() {
    this.pauseTimer();
    this.timeLeft = 0;
    this.intervalIndex = 0;
    this.isWorkSession = true;
    this.hasStarted = false; // reset to original state
    this.customWorkTimeSet = null;
    this.generateTimelineEvents();
  }


  handleSessionEnd() {
    this.pauseTimer();

    if (this.intervalIndex < this.intervals) {
      this.isWorkSession = !this.isWorkSession;
      this.timeLeft = this.isWorkSession
        ? this.customWorkTimeSet ?? this.workDuration * 60
        : this.breakDurationSeconds();

      if (!this.isWorkSession) {
        this.intervalIndex++;
      }

      this.startTimer();
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  generateTimelineEvents() {
    this.timelineEvents = Array.from({ length: this.intervals }, (_, i) => ({
      label: `${i + 1}`
    }));
  }

  isBreakCompleted(index: number): boolean {
    // A break is completed if intervalIndex > index and index is odd (break intervals)
    return index % 2 === 1 && this.intervalIndex > index;
  }

  ngOnDestroy() {
    this.pauseTimer();
  }
}
