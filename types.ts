
import React from 'react';

export enum LevelStatus {
  Locked = 'locked',
  Active = 'active',
  Completed = 'completed',
}

export enum LevelType {
  Standard = 'standard',
  Checkpoint = 'checkpoint',
  Bonus = 'bonus',
}

export interface Level {
  id: number;
  title: string;
  status: LevelStatus;
  type: LevelType;
  icon: React.ReactNode;
  description: string;
  estimatedTime: string;
}

export interface Roadmap {
  topic: string;
  levels: Level[];
}

export interface AppProgress {
  roadmaps: Roadmap[];
  currentIndex: number;
}
