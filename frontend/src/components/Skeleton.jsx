import React from 'react';

/**
 * Skeleton Loader Component for Premium UI Transitions
 */
export const SkeletonCard = () => {
  return (
    <div className="glass-panel p-6 rounded-3xl animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-3 flex-1">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-24"></div>
          <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded-lg w-16"></div>
        </div>
        <div className="h-10 w-10 bg-slate-250 dark:bg-slate-800 rounded-xl"></div>
      </div>
    </div>
  );
};

export const SkeletonRow = () => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-850 animate-pulse">
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
        <div className="h-3 bg-slate-150 dark:bg-slate-850 rounded w-1/2"></div>
      </div>
      <div className="flex space-x-2">
        <div className="h-8 w-14 bg-slate-250 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-8 w-8 bg-slate-250 dark:bg-slate-800 rounded-lg"></div>
      </div>
    </div>
  );
};

export const SkeletonChart = () => {
  return (
    <div className="glass-panel p-6 rounded-3xl animate-pulse min-h-[300px] flex flex-col justify-end space-y-4">
      <div className="flex justify-between items-center mb-auto">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-12"></div>
      </div>
      <div className="flex items-end justify-between space-x-2 pt-8 h-[200px]">
        <div className="h-[20%] w-full bg-slate-250 dark:bg-slate-850 rounded-t-md"></div>
        <div className="h-[40%] w-full bg-slate-200 dark:bg-slate-800 rounded-t-md"></div>
        <div className="h-[60%] w-full bg-slate-250 dark:bg-slate-850 rounded-t-md"></div>
        <div className="h-[35%] w-full bg-slate-200 dark:bg-slate-800 rounded-t-md"></div>
        <div className="h-[75%] w-full bg-slate-250 dark:bg-slate-850 rounded-t-md"></div>
        <div className="h-[50%] w-full bg-slate-200 dark:bg-slate-800 rounded-t-md"></div>
        <div className="h-[90%] w-full bg-slate-250 dark:bg-slate-850 rounded-t-md"></div>
      </div>
    </div>
  );
};
