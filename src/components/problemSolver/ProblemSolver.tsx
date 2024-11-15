import React from 'react';
import { Puzzle } from 'lucide-react';
import ProblemForm from './ProblemForm';
import SolutionCard from './SolutionCard';
import SavedSolutionsButton from './SavedSolutionsButton';
import { useProblemSolverStore } from '../../store/problemSolverStore';

export default function ProblemSolver() {
  const { 
    solutions, 
    isLoading, 
    generateSolution,
    removeSolution
  } = useProblemSolverStore();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Puzzle className="w-8 h-8 text-blue-500" />
            Problem Solver
          </h1>
          <p className="text-gray-500 mt-1">
            Get AI-powered solutions for your business challenges
          </p>
        </div>
        <SavedSolutionsButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ProblemForm onSubmit={generateSolution} isLoading={isLoading} />
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {solutions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Puzzle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No solutions yet</h3>
                <p className="text-gray-500">
                  Start by describing your problem
                </p>
              </div>
            ) : (
              solutions.map((solution) => (
                <SolutionCard
                  key={solution.id}
                  solution={solution}
                  onDelete={removeSolution}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}