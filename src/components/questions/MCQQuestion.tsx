import { Question } from '../../types/test';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

interface MCQQuestionProps {
  question: Question;
  value?: number;
  onChange: (answer: number) => void;
}

const MCQQuestion = ({ question, value, onChange }: MCQQuestionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900">{question.title}</h3>
        <p className="text-gray-600">{question.description}</p>
        <p className="text-sm text-gray-500">{question.points} points</p>
      </div>

      <RadioGroup 
        value={value?.toString()} 
        onValueChange={(val) => onChange(parseInt(val))}
        className="space-y-3"
      >
        {question.options?.map((option, index) => (
          <div 
            key={index} 
            className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
          >
            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
            <Label 
              htmlFor={`option-${index}`} 
              className="flex-1 cursor-pointer text-base"
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default MCQQuestion;
