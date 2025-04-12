
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ProgressData = {
  id: string;
  goalId: string;
  month: string;
  completed: boolean;
  paymentDate: string | null;
};

type GoalProps = {
  id: string;
  name: string;
  targetAmount: number;
  durationMonths: number;
  monthlySIP: number;
  suggestedPlan: string;
  reasoning: string;
  createdAt: string;
  isCompleted: boolean;
  emoji: string;
  progress: number;
  progressData: ProgressData[];
};

export default function GoalCard({ goal }: { goal: GoalProps }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          {goal.emoji} {goal.name}
        </CardTitle>
        <div className="text-sm">Created At: {new Date(goal.createdAt).toLocaleDateString()}</div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="font-medium">Target Amount:</div>
          <div>₹{goal.targetAmount.toLocaleString()}</div>
        </div>
        <div>
          <div className="font-medium">Duration:</div>
          <div>{goal.durationMonths} months</div>
        </div>
        <div>
          <div className="font-medium">Monthly SIP:</div>
          <div>₹{goal.monthlySIP.toLocaleString()}</div>
        </div>
        <div>
          <div className="font-medium">Suggested Plan:</div>
          <div>{goal.suggestedPlan}</div>
        </div>
        <div>
          <div className="font-medium">Reasoning:</div>
          <div className="text-sm">{goal.reasoning}</div>
        </div>
        <div>
          <div className="font-medium">Progress:</div>
          <div>{goal.progress}%</div>
        </div>
        <div>
          <div className="font-medium mb-1">Payment Schedule:</div>
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {goal.progressData.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm border rounded-md px-2 py-1">
                <span>{item.month}</span>
                <Badge variant={item.completed ? "default" : "outline"}>
                  {item.completed ? "Done" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
