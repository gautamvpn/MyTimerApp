# React Native Multi-Timer App

A React Native app that allows users to create, manage, and visualize multiple customizable timers with category-based grouping and progress tracking.

## Features

### 1. Add Timer
- Create new timers with:
  - **Name**
  - **Duration (in seconds)**
  - **Category** (e.g., Workout, Study)
- Timers are saved to a list and persisted locally using `AsyncStorage`.

### 2. Timer List with Grouping
- Timers are displayed in collapsible groups by category.
- Each timer shows:
  - Name
  - Remaining time
  - Status: Running, Paused, or Completed

### 3. Timer Management
- Control individual timers with:
  - **Start**: Begin countdown
  - **Pause**: Pause countdown
  - **Reset**: Reset timer to original duration
- Automatically marks as "Completed" when countdown reaches zero.

### 4. Progress Visualization
- Each timer displays a horizontal progress bar to show elapsed time visually.
- Percentage of time completed is shown below the progress bar.


### 5: Bulk Actions
Add Start, Pause, and Reset buttons at the category level to control all timers within that category simultaneously.

### 6: User Feedback
Show a modal with a congratulatory message and the timer's name when a timer completes.

## Timer History

Maintain a log of completed timers with the following details:
- **Timer Name**
- **Completion Time**

View the history on a dedicated **History** screen.

### Deleting Record
Implemented deleting History Records with deleting category Timers