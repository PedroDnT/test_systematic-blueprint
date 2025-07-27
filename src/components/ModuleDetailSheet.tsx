import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, BookCheck, ListChecks } from 'lucide-react';
import { ModuleContent } from '@/lib/syllabusData';

interface ModuleDetailSheetProps {
  moduleContent: ModuleContent | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const ModuleDetailSheet: React.FC<ModuleDetailSheetProps> = ({ moduleContent, isOpen, onOpenChange }) => {
  if (!moduleContent) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl">
        <ScrollArea className="h-full pr-6">
          <SheetHeader className="mb-6 text-left">
            <SheetTitle className="text-2xl font-bold">{moduleContent.title}</SheetTitle>
            <SheetDescription className="text-md">{moduleContent.introduction}</SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            {moduleContent.sections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                  {section.insight && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <Lightbulb className="w-5 h-5 text-yellow-600 mt-1 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">Key Insight</h4>
                        <p className="text-sm text-yellow-700">{section.insight}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><ListChecks /> Key Concepts</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {moduleContent.keyConcepts.map((concept) => (
                  <Badge key={concept} variant="secondary">{concept}</Badge>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><BookCheck /> Hands-on Exercise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold">Objective:</h4>
                  <p className="text-muted-foreground">{moduleContent.handsOnExercise.objective}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Task:</h4>
                  <p className="text-muted-foreground">{moduleContent.handsOnExercise.task}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Expected Outcome:</h4>
                  <p className="text-muted-foreground">{moduleContent.handsOnExercise.outcome}</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-xs text-muted-foreground">
              References: {moduleContent.references.map(r => `[${r}]`).join(', ')}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
