import { Question } from '../../types/test';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

interface ScenarioQuestionProps {
  question: Question;
  value?: number;
  onChange: (answer: number) => void;
}

const ScenarioQuestion = ({ question, value, onChange }: ScenarioQuestionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900">{question.title}</h3>
        <p className="text-sm text-gray-500">{question.points} points</p>
      </div>

      {/* Scenario Context */}
      <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-6">
        <p className="text-gray-800 leading-relaxed">{question.description}</p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900">What would you do?</h4>
        <RadioGroup 
          value={value?.toString()} 
          onValueChange={(val) => onChange(parseInt(val))}
          className="space-y-3"
        >
          {question.options?.map((option, index) => (
            <div 
              key={index} 
              className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
            >
              <RadioGroupItem value={index.toString()} id={`scenario-${index}`} className="mt-1" />
              <Label 
                htmlFor={`scenario-${index}`} 
                className="flex-1 cursor-pointer text-base leading-relaxed"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default ScenarioQuestion;
