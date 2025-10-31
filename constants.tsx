
import React from 'react';
import { Level, LevelStatus, LevelType } from './types';

// SVG Icons for different states and types
export const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export const CastleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.613 0V3a1 1 0 112 0v2.101a7.002 7.002 0 01.328 11.235 2 2 0 01-1.888.664H4.947a2 2 0 01-1.888-.664A7.002 7.002 0 014 5.101V3a1 1 0 011-1zM6 13a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
);

export const TreasureIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM4 8h5v2H4V8z" clipRule="evenodd" />
    </svg>
);


export const LEARNING_PATH: Level[] = [
  { id: 1, title: 'Basics 1', status: LevelStatus.Completed, type: LevelType.Standard, icon: <CheckIcon />, description: 'Learn the fundamental vocabulary and grammar.', estimatedTime: '5 min' },
  { id: 2, title: 'Basics 2', status: LevelStatus.Completed, type: LevelType.Standard, icon: <CheckIcon />, description: 'Expand on the basics with new words and sentence structures.', estimatedTime: '7 min' },
  { id: 3, title: 'Greetings', status: LevelStatus.Active, type: LevelType.Standard, icon: <StarIcon />, description: 'Master common greetings and introductions.', estimatedTime: '6 min' },
  { id: 4, title: 'Checkpoint', status: LevelStatus.Locked, type: LevelType.Checkpoint, icon: <CastleIcon />, description: 'Test your knowledge of the basics to unlock new lessons.', estimatedTime: '10 min' },
  { id: 5, title: 'Food', status: LevelStatus.Locked, type: LevelType.Standard, icon: <LockIcon />, description: 'Learn how to talk about your favorite foods and order at a restaurant.', estimatedTime: '8 min' },
  { id: 6, title: 'Animals', status: LevelStatus.Locked, type: LevelType.Standard, icon: <LockIcon />, description: 'Discover the names of common animals and pets.', estimatedTime: '5 min' },
  { id: 7, title: 'Bonus Skill', status: LevelStatus.Locked, type: LevelType.Bonus, icon: <TreasureIcon />, description: 'Unlock this special skill to learn fun idioms and phrases!', estimatedTime: '12 min' },
  { id: 8, title: 'Plurals', status: LevelStatus.Locked, type: LevelType.Standard, icon: <LockIcon />, description: 'Understand how to form plural nouns.', estimatedTime: '7 min' },
  { id: 9, title: 'Checkpoint 2', status: LevelStatus.Locked, type: LevelType.Checkpoint, icon: <CastleIcon />, description: 'Show you have mastered the material so far to proceed.', estimatedTime: '10 min' },
  { id: 10, title: 'Travel', status: LevelStatus.Locked, type: LevelType.Standard, icon: <LockIcon />, description: 'Learn essential phrases for traveling and asking for directions.', estimatedTime: '9 min' },
  { id: 11, title: 'Family', status: LevelStatus.Locked, type: LevelType.Standard, icon: <LockIcon />, description: 'Talk about your family members and relationships.', estimatedTime: '6 min' },
  { id: 12, title: 'Verbs', status: LevelStatus.Locked, type: LevelType.Standard, icon: <LockIcon />, description: 'Learn to conjugate and use common verbs.', estimatedTime: '10 min' },
];
