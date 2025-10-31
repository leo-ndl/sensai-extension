
import React from 'react';
import { Level, LevelStatus, LevelType } from './types';

// SVG Icons for different states and types
export const ReadingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

export const QuizIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ProjectIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
  { id: 1, title: 'Basics 1', status: LevelStatus.Completed, type: LevelType.Reading, icon: <CheckIcon />, description: 'Learn the fundamental vocabulary and grammar.', estimatedTime: '5 min' },
  { id: 2, title: 'Basics 2', status: LevelStatus.Completed, type: LevelType.Quiz, icon: <CheckIcon />, description: 'Expand on the basics with new words and sentence structures.', estimatedTime: '7 min' },
  { id: 3, title: 'Greetings', status: LevelStatus.Active, type: LevelType.Reading, icon: <ReadingIcon />, description: 'Master common greetings and introductions.', estimatedTime: '6 min' },
  { id: 4, title: 'Checkpoint', status: LevelStatus.Locked, type: LevelType.Checkpoint, icon: <CastleIcon />, description: 'Test your knowledge of the basics to unlock new lessons.', estimatedTime: '10 min' },
  { id: 5, title: 'Food', status: LevelStatus.Locked, type: LevelType.Reading, icon: <LockIcon />, description: 'Learn how to talk about your favorite foods and order at a restaurant.', estimatedTime: '8 min' },
  { id: 6, title: 'Animals', status: LevelStatus.Locked, type: LevelType.Quiz, icon: <LockIcon />, description: 'Discover the names of common animals and pets.', estimatedTime: '5 min' },
  { id: 7, title: 'Bonus Skill', status: LevelStatus.Locked, type: LevelType.Bonus, icon: <TreasureIcon />, description: 'Unlock this special skill to learn fun idioms and phrases!', estimatedTime: '12 min' },
  { id: 8, title: 'Plurals', status: LevelStatus.Locked, type: LevelType.Project, icon: <LockIcon />, description: 'Apply your knowledge by writing sentences with plural nouns.', estimatedTime: '7 min' },
  { id: 9, title: 'Checkpoint 2', status: LevelStatus.Locked, type: LevelType.Checkpoint, icon: <CastleIcon />, description: 'Show you have mastered the material so far to proceed.', estimatedTime: '10 min' },
  { id: 10, title: 'Travel', status: LevelStatus.Locked, type: LevelType.Reading, icon: <LockIcon />, description: 'Learn essential phrases for traveling and asking for directions.', estimatedTime: '9 min' },
  { id: 11, title: 'Family', status: LevelStatus.Locked, type: LevelType.Quiz, icon: <LockIcon />, description: 'Talk about your family members and relationships.', estimatedTime: '6 min' },
  { id: 12, title: 'Verbs', status: LevelStatus.Locked, type: LevelType.Project, icon: <LockIcon />, description: 'Build a short story using common verbs in the correct conjugation.', estimatedTime: '10 min' },
];