'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import type { Feedback } from '@/types';
import { CheckCircle2, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface FeedbackCardProps {
  feedback: Feedback;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const { scores, strengths, improvements, summary } = feedback;

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Needs Improvement';
  };

  const scoreCategories = [
    { key: 'contentQuality', label: 'Content Quality', value: scores.contentQuality },
    { key: 'communicationSkills', label: 'Communication Skills', value: scores.communicationSkills },
    { key: 'answerStructure', label: 'Answer Structure', value: scores.answerStructure },
    { key: 'confidence', label: 'Confidence', value: scores.confidence },
    { key: 'useOfExamples', label: 'Use of Examples', value: scores.useOfExamples },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-5xl font-bold">{scores.overall}<span className="text-2xl text-muted-foreground">/10</span></div>
              <p className={`text-lg font-medium mt-2 ${getScoreColor(scores.overall)}`}>
                {getScoreLabel(scores.overall)}
              </p>
            </div>
            <Badge variant={scores.overall >= 7 ? 'default' : 'secondary'} className="text-lg px-4 py-2">
              {Math.round((scores.overall / 10) * 100)}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{summary}</p>
        </CardContent>
      </Card>

      {/* Detailed Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {scoreCategories.map((category) => (
            <div key={category.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{category.label}</span>
                <span className={`font-semibold ${getScoreColor(category.value)}`}>
                  {category.value}/10
                </span>
              </div>
              <Progress value={category.value * 10} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <CardTitle>Strengths</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Areas for Improvement */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <CardTitle>Areas for Improvement</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2">
                <TrendingDown className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{improvement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
